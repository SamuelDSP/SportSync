import { PlayerCard } from "./components/PlayerCard.tsx";

import { TelaJogadores } from "./components/TelaJogadores.tsx";
import { TelaTimes } from "./components/TelaTimes.tsx";
import { TelaEstatisticas } from "./components/TelaEstatisticas.tsx";

import { useState } from "react";

export function App() {
  const [abaAtual, setAbaAtual] = useState("jogadores");

  return (
    <>
      <nav>
        <button onClick={() => setAbaAtual("jogadores")}>Jogadores</button>

        <button onClick={() => setAbaAtual("times")}>Times</button>

        <button onClick={() => setAbaAtual("estatisticas")}>
          Estatísticas
        </button>
      </nav>

      <main>
        {abaAtual === "jogadores" && <TelaJogadores />}
        {abaAtual === "times" && <TelaTimes />}
        {abaAtual === "estatisticas" && <TelaEstatisticas />}
      </main>
    </>
  );
}
