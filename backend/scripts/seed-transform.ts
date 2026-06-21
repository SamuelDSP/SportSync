import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PosicaoJogador } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/sportsync",
});
const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 500;


const POSICAO_MAP: Record<string, PosicaoJogador> = {
  GK: "GOLEIRO",
  CB: "DEFENSOR", RB: "DEFENSOR", LB: "DEFENSOR", RWB: "DEFENSOR", LWB: "DEFENSOR",
  CDM: "MEIO_CAMPO", CM: "MEIO_CAMPO", CAM: "MEIO_CAMPO", RM: "MEIO_CAMPO", LM: "MEIO_CAMPO",
  ST: "ATACANTE", CF: "ATACANTE", RW: "ATACANTE", LW: "ATACANTE",
};

function mapPosicao(playerPositions: string): PosicaoJogador {
  const primeira = playerPositions.split(",")[0]?.trim().toUpperCase();
  return POSICAO_MAP[primeira] ?? "MEIO_CAMPO";
}

let cursor: number | undefined = undefined;
let total = 0;

while (true) {
  const pagina = await prisma.jogadorCsvStaging.findMany({
    where: { processado: false },
    take: BATCH_SIZE,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { id: "asc" },
  });

  if (pagina.length === 0) break;

  const dataJogadores = pagina.map((row) => ({
    nome: row.shortName,
    idade: row.age ?? 0,
    valorMercado: row.valueEur ?? 0,
    salarioAtual: null,                      
    salarioDesejado: row.wageEur ?? 1500,   
    posicao: mapPosicao(row.playerPositions),
    status: "MERCADO" as const,
    clubeId: null,                          
  }));

  await prisma.jogador.createMany({ data: dataJogadores });


  await prisma.jogadorCsvStaging.updateMany({
    where: { id: { in: pagina.map((r) => r.id) } },
    data: { processado: true },
  });

  total += pagina.length;
  cursor = pagina[pagina.length - 1].id;
  console.log(`  ↳ ${total} jogadores transformados…`);
}

await prisma.$disconnect();
console.log(`Transformacao concluida: ${total} jogadores inseridos a partir da staging.`);