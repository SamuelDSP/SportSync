import { TelaJogadores } from "./pages/TelaJogadores.tsx";
import { TelaTimes } from "./pages/TelaTimes.tsx";
import { TelaFinanceiro } from "./pages/TelaFinanceiro.tsx";
import { useState, useEffect } from "react";
import { NaviBar } from "./components/NaviBar.tsx";
import { TelaElenco } from "./pages/TelaElenco.tsx";
import { TelaInicial } from "./pages/TelaInicial.tsx";
import type { Jogador } from "./modelos/Jogador.ts";
import type { Status } from "./modelos/Jogador.ts";
import { atualizarStatus } from "./services/jogadorService";
import { getJogadores } from "./services/getJogadores.ts";
import "./estilos/App.css";

export function App() {
  const [abaAtual, setAbaAtual] = useState("");
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  const [loading, setLoading] = useState(true);

  async function onAlterar(id: number, novoStatus: Status, rowlimit: number) {
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

      if (player.position === "Defensor" && zagTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (player.position === "Atacante" && ataTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (player.position === "Goleiro" && golTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (player.position === "Meio-campo" && meiTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
    }

    try {
      await atualizarStatus(id, novoStatus);

      setJogadores((jogadores) =>
        jogadores.map((jogador) =>
          jogador.id === id ? { ...jogador, status: novoStatus } : jogador,
        ),
      );
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error);
      alert("Erro ao atualizar jogador.");
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getJogadores();
        setJogadores(data);
      } catch (error) {
        console.error("Erro ao carregar jogadores:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Carregando...</p>;

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
