import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/sportsync",
});
const prisma = new PrismaClient({ adapter });

const CSV_PATH = path.resolve(import.meta.dirname, "male_players.csv");
const BATCH_SIZE = 500;

interface CsvRow {
  player_id: string;
  short_name: string;
  long_name: string;
  player_positions: string;
  age: string;
  overall: string;
  potential: string;
  value_eur: string;
  wage_eur: string;
  club_team_id: string;
  club_name: string;
  league_name: string;
}

function streamCsv(cb: (row: CsvRow) => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    const parser = fs
      .createReadStream(CSV_PATH)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

    let inflight = Promise.resolve();

    parser.on("data", (row: CsvRow) => {
      parser.pause();
      inflight = inflight
        .then(() => cb(row))
        .then(() => parser.resume())
        .catch(reject);
    });

    parser.on("end", () => inflight.then(resolve).catch(reject));
    parser.on("error", reject);
  });
}

let batch: Parameters<typeof prisma.jogadorCsvStaging.createMany>[0]["data"] = [];
let total = 0;

async function flush() {
  if (batch.length === 0) return;
  await prisma.jogadorCsvStaging.createMany({ data: batch, skipDuplicates: true });
  total += batch.length;
  console.log(`  ↳ ${total} linhas importadas para staging…`);
  batch = [];
}

await streamCsv(async (row) => {
  const playerId = parseInt(row.player_id);
  if (!playerId || !row.short_name) return;

  batch.push({
    playerId,
    shortName: row.short_name,
    longName: row.long_name,
    playerPositions: row.player_positions,
    age: parseInt(row.age) || null,
    overall: parseInt(row.overall) || null,
    potential: parseInt(row.potential) || null,
    valueEur: parseFloat(row.value_eur) || null,
    wageEur: parseFloat(row.wage_eur) || null,
    clubTeamId: parseInt(row.club_team_id) || null,
    clubName: row.club_name || null,
    leagueName: row.league_name || null,
  });

  if (batch.length >= BATCH_SIZE) await flush();
});

await flush();

await prisma.$disconnect();
console.log(`Staging concluido: ${total} jogadores brutos importados do CSV.`);
