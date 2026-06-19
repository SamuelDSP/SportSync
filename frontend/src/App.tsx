import { TelaJogadores } from "./pages/TelaJogadores.tsx";
import { TelaTimes } from "./pages/TelaTimes.tsx";
import { TelaFinanceiro } from "./pages/TelaFinanceiro.tsx";
import { useState } from "react";
import { NaviBar } from "./components/NaviBar.tsx";
import { TelaElenco } from "./pages/TelaElenco.tsx";
import { TelaInicial } from "./pages/TelaInicial.tsx";
import type { Jogador } from "./modelos/Jogador.ts";
import type { Status } from "./modelos/Jogador.ts";

import "./estilos/App.css";

export function App() {
  const [abaAtual, setAbaAtual] = useState("");
  const [jogadores, setJogadores] = useState<Jogador[]>([
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
  ]);

  function onAlterar(id: number, novoStatus: Status, rowlimit: number) {
    const player = jogadores.find((p) => p.id === id);
    if (!player) return;

    const titulares = jogadores.filter(
      (jogador) => jogador.status === "titular",
    );

    if (novoStatus === "titular" && jogadores) {
      const qtdTitulares = titulares.length;

      if (qtdTitulares >= 11) {
        alert("Já existem 11 titulares!");
        return;
      }

      const zagTitulares = titulares.filter((p) => p.position === "Defensor");
      const ataTitulares = titulares.filter((p) => p.position === "Atacante");
      const golTitulares = titulares.filter((p) => p.position === "Goleiro");
      const meiTitulares = titulares.filter((p) => p.position === "Meio-campo");

      if (
        player.position === "Defensor" &&
        zagTitulares.length >= rowlimit
      ) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (
        player.position === "Atacante" &&
        ataTitulares.length >= rowlimit
      ) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (
        player.position === "Goleiro" &&
        golTitulares.length >= rowlimit
      ) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (
        player.position === "Meio-campo" &&
        meiTitulares.length >= rowlimit
      ) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
    }

    setJogadores((jogadores) =>
      jogadores.map((jogador) =>
        jogador.id === id ? { ...jogador, status: novoStatus } : jogador,
      ),
    );
  }

  return (
    <>
      {abaAtual !== "" && <NaviBar abaAtual={abaAtual} setAbaAtual={setAbaAtual} />}

      <main>
        {abaAtual === "" && <TelaInicial setAbaAtual={setAbaAtual} />}
        {abaAtual === "jogadores" && (
          <TelaJogadores jogadores={jogadores} onAlterar={onAlterar} />
        )}
        {abaAtual === "times" && <TelaTimes />}
        {abaAtual === "financeiro" && <TelaFinanceiro />}
        {abaAtual === "elenco" && (
          <TelaElenco jogadores={jogadores} onAlterar={onAlterar} />
        )}
      </main>
    </>
  );
}
