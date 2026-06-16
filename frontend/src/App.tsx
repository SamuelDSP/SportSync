import { TelaJogadores } from "./pages/tela jogadores/TelaJogadores.tsx";
import { TelaTimes } from "./pages/TelaTimes.tsx";
import { TelaFinanceiro } from "./pages/TelaFinanceiro.tsx";
import { useState } from "react";
import { NaviBar } from "./components/NaviBar.tsx";
import { TelaElenco } from "./pages/tela elenco/TelaElenco.tsx";
import { TelaInicial } from "./pages/TelaInicial.tsx";

import "./estilos/App.css";

export function App() {
  const [abaAtual, setAbaAtual] = useState("");

  return (
    <>
      <NaviBar abaAtual={abaAtual} setAbaAtual={setAbaAtual} />

      <main>
        {abaAtual === "" && <TelaInicial/>}
        {abaAtual === "jogadores" && <TelaJogadores verba={2000} />}
        {abaAtual === "times" && <TelaTimes />}
        {abaAtual === "financeiro" && <TelaFinanceiro />}
        {abaAtual === "elenco" && <TelaElenco />}
      </main>
    </>
  );
}
