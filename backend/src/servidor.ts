import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

type Status = "titular" |"mercado" |"reserva"| "lesionado"

type Jogador = {
  id: number;
  name: string;
  age: number;
  mktValue: number;
  position: string;
  status: Status;
};

// banco fake em memória
let jogadores: Jogador[] = [
   // TITULARES
    {
      id: 1,
      name: "Alisson",
      age: 33,
      mktValue: 30000000,
      position: "Goleiro",
      status: "titular",
    },
    {
      id: 2,
      name: "Marquinhos",
      age: 32,
      mktValue: 40000000,
      position: "Defensor",
      status: "titular",
    },
    {
      id: 3,
      name: "Bruno Guimarães",
      age: 28,
      mktValue: 70000000,
      position: "Meio-campo",
      status: "titular",
    },
    {
      id: 4,
      name: "Vinícius Júnior",
      age: 26,
      mktValue: 180000000,
      position: "Atacante",
      status: "titular",
    },

    // RESERVAS
    {
      id: 5,
      name: "Endrick",
      age: 20,
      mktValue: 60000000,
      position: "Atacante",
      status: "reserva",
    },
    {
      id: 6,
      name: "Beraldo",
      age: 23,
      mktValue: 25000000,
      position: "Defensor",
      status: "reserva",
    },
    {
      id: 7,
      name: "Andrey Santos",
      age: 22,
      mktValue: 18000000,
      position: "Meio-campo",
      status: "lesionado",
    },

    // MERCADO
    {
      id: 8,
      name: "Rayan",
      age: 19,
      mktValue: 12000000,
      position: "Atacante",
      status: "mercado",
    },
    {
      id: 9,
      name: "Estevão",
      age: 19,
      mktValue: 45000000,
      position: "Atacante",
      status: "mercado",
    },
    {
      id: 10,
      name: "João Gomes",
      age: 25,
      mktValue: 35000000,
      position: "Meio-campo",
      status: "mercado",
    },
    {
      id: 11,
      name: "Murillo",
      age: 24,
      mktValue: 50000000,
      position: "Defensor",
      status: "mercado",
    },
    {
      id: 12,
      name: "Lucas Perri",
      age: 29,
      mktValue: 15000000,
      position: "Goleiro",
      status: "mercado",
    },
    {
      id: 13,
      name: "Yuri Alberto",
      age: 25,
      mktValue: 22000000,
      position: "Atacante",
      status: "mercado",
    },
    {
      id: 14,
      name: "Pedro",
      age: 29,
      mktValue: 28000000,
      position: "Atacante",
      status: "mercado",
    },
    {
      id: 15,
      name: "Raphael Veiga",
      age: 31,
      mktValue: 17000000,
      position: "Meio-campo",
      status: "mercado",
    },
    {
      id: 16,
      name: "Gerson",
      age: 29,
      mktValue: 22000000,
      position: "Meio-campo",
      status: "mercado",
    },
    {
      id: 17,
      name: "Wesley",
      age: 22,
      mktValue: 18000000,
      position: "Defensor",
      status: "mercado",
    },
    {
      id: 18,
      name: "Léo Ortiz",
      age: 30,
      mktValue: 14000000,
      position: "Defensor",
      status: "mercado",
    },
    {
      id: 19,
      name: "John",
      age: 30,
      mktValue: 8000000,
      position: "Goleiro",
      status: "mercado",
    },
    {
      id: 20,
      name: "Kaio Jorge",
      age: 24,
      mktValue: 16000000,
      position: "Atacante",
      status: "mercado",
    },
];

// GET - listar jogadores
app.get("/jogadores", (req, res) => {
  res.json(jogadores);
});

// PATCH - atualizar status
app.patch("/jogadores/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const jogador = jogadores.find((j) => j.id === id);

  if (!jogador) {
    return res.status(404).json({ message: "Jogador não encontrado" });
  }

  jogador.status = status;

  return res.json(jogador);
});

// start
app.listen(8080, () => {
  console.log("🚀 API rodando em http://localhost:8080");
});