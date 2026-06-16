import { TelaJogadores } from "./components/tela jogadores/TelaJogadores.tsx";
import { TelaTimes } from "./components/TelaTimes.tsx";
import { TelaEstatisticas } from "./components/TelaEstatisticas.tsx";
import { useState } from "react";
import { NaviBar } from "./components/NaviBar.tsx";
import { TelaElenco } from "./components/tela elenco/TelaElenco.tsx";

import "./estilos/App.css";

export function App() {
  const [abaAtual, setAbaAtual] = useState("");

  return (
    <>
      <NaviBar abaAtual={abaAtual} setAbaAtual={setAbaAtual} />

      <main>
        {abaAtual === "jogadores" && <TelaJogadores />}
        {abaAtual === "times" && <TelaTimes />}
        {abaAtual === "estatisticas" && <TelaEstatisticas />}
        {abaAtual === "elenco" && <TelaElenco />}
      </main>
    </>
  );
}
