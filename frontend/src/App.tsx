import { TelaJogadores } from "./components/TelaJogadores.tsx";
import { TelaTimes } from "./components/TelaTimes.tsx";
import { TelaEstatisticas } from "./components/TelaEstatisticas.tsx";
import { useState } from "react";


import { NaviBar } from "./components/NaviBar.tsx"

export function App() {
  const [abaAtual, setAbaAtual] = useState("jogadores");

  return (
    <>

      <NaviBar 
        abaAtual={abaAtual}
        setAbaAtual={setAbaAtual}
      />

      <main>
        {abaAtual === "jogadores" && <TelaJogadores />}
        {abaAtual === "times" && <TelaTimes />}
        {abaAtual === "estatisticas" && <TelaEstatisticas />}
      </main>

    </>
  );
}
