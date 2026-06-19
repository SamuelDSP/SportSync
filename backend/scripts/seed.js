import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/sportsync",
});

const prisma = new PrismaClient({ adapter });

const jogadores = [
  {
    nome: "Alisson",
    idade: 33,
    valorMercado: 30000000,
    salarioDesejado: 450000,
    posicao: "GOLEIRO",
  },
  {
    nome: "Marquinhos",
    idade: 32,
    valorMercado: 40000000,
    salarioDesejado: 520000,
    posicao: "DEFENSOR",
  },
  {
    nome: "Bruno Guimaraes",
    idade: 28,
    valorMercado: 70000000,
    salarioDesejado: 650000,
    posicao: "MEIO_CAMPO",
  },
  {
    nome: "Vinicius Junior",
    idade: 26,
    valorMercado: 180000000,
    salarioDesejado: 1200000,
    posicao: "ATACANTE",
  },
  {
    nome: "Endrick",
    idade: 20,
    valorMercado: 60000000,
    salarioDesejado: 400000,
    posicao: "ATACANTE",
  },
  {
    nome: "Murillo",
    idade: 24,
    valorMercado: 50000000,
    salarioDesejado: 360000,
    posicao: "DEFENSOR",
  },
];

await prisma.clube.upsert({
  where: { id: 1 },
  update: {},
  create: {
    nome: "SportSync FC",
    saldo: 250000000,
    limiteDespesaMensal: 3000000,
  },
});

for (const jogador of jogadores) {
  const existente = await prisma.jogador.findFirst({
    where: { nome: jogador.nome },
  });

  if (!existente) {
    await prisma.jogador.create({ data: jogador });
  }
}

await prisma.$disconnect();

console.log("Seed concluido: clube e jogadores de mercado cadastrados.");
