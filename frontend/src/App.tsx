import { TelaMercado } from "./pages/TelaMercado.tsx";
import { TelaTimes } from "./pages/TelaTimes.tsx";
import { TelaFinanceiro } from "./pages/TelaFinanceiro.tsx";
import { useState, useEffect } from "react";
import { NaviBar } from "./components/NaviBar.tsx";
import { TelaElenco } from "./pages/TelaElenco.tsx";
import { TelaInicial } from "./pages/TelaInicial.tsx";
import type { Jogador, TipoElenco } from "./modelos/Jogador.ts";
import type { StatusUI } from "./modelos/Jogador.ts";
import {
  getJogadoresElenco,
  getJogadoresMercado,
} from "./services/getJogadores.ts";
import "./estilos/App.css";
import { demitirJogador, contratarJogador } from "./services/alterarStatus.ts";

export function App() {
  const [abaAtual, setAbaAtual] = useState("");
  const [jogadores, setJogadores] = useState<Jogador[]>(
    Array.from({ length: 800 }, (_, i) => ({
      id: i + 1,
      nome: `Jogador ${i + 1}`,
      idade: 20 + (i % 15),
      valorMercado: 1000000 * (i + 1),
      posicao: ["Goleiro", "Defensor", "Meio-campo", "Atacante"][i % 4],
      status: "MERCADO",
    })),
  );
  const [loading, setLoading] = useState(false); // lembrar de mudar para true dps de testes

  useEffect(() => {
    if (abaAtual === "") {
      document.body.classList.remove("dentro");
    } else {
      document.body.classList.add("dentro");
    }
  }, [abaAtual]);

  /* useEffect(() => {
    async function load() {
      try {
        const jogadoresElenco = await getJogadoresElenco(0);
        const jogadoresMercado = await getJogadoresMercado();
        const data = [...jogadoresElenco, ...jogadoresMercado];
        setJogadores(data);

        const clubes

      } catch (error) {
        console.error("Erro ao carregar jogadores:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);


  coloquei como comentario para testar

  */

  async function onAlterar(id: number, novoStatus: StatusUI, rowlimit: number, novotipoElenco?: TipoElenco) {
    const player = jogadores.find((p) => p.id === id);
    if (!player) return;

    const titulares = jogadores.filter(
      (jogador) => jogador.tipoElenco === "TITULAR",
    );

    if (novotipoElenco === "TITULAR" ) {
      const qtdTitulares = titulares.length;

      if (qtdTitulares >= 11) {
        alert("Já existem 11 titulares!");
        return;
      }

      const zagTitulares = titulares.filter((p) => p.posicao === "Defensor");
      const ataTitulares = titulares.filter((p) => p.posicao === "Atacante");
      const golTitulares = titulares.filter((p) => p.posicao === "Goleiro");
      const meiTitulares = titulares.filter((p) => p.posicao === "Meio-campo");

      if (player.posicao === "Defensor" && zagTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (player.posicao === "Atacante" && ataTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (player.posicao === "Goleiro" && golTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }
      if (player.posicao === "Meio-campo" && meiTitulares.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }

      setJogadores((jogadores) =>
        jogadores.map((jogador) =>
          jogador.id === id ? { ...jogador, status: novoStatus } : jogador,
        ),
      );
    }

    if (novoStatus==="ELENCO" && novotipoElenco === "RESERVA") {
      if (player.status === "MERCADO") {
        try {
          await contratarJogador(1, id);
          setJogadores((jogadores) =>
            jogadores.map((jogador) =>
              jogador.id === id ? { ...jogador, status: novoStatus } : jogador,
            ),
          );
        } catch (error) {
          console.error("Erro ao contratar jogador:", error);
          alert("Erro ao contratar jogador.");
        }
      } else {
        setJogadores((jogadores) =>
          jogadores.map((jogador) =>
            jogador.id === id ? { ...jogador, status: novoStatus } : jogador,
          ),
        );
        //torna titular
      }
    }

    if (novoStatus === "MERCADO") {
      try {
        await demitirJogador(1, id);
        setJogadores((jogadores) =>
          jogadores.map((jogador) =>
            jogador.id === id ? { ...jogador, status: novoStatus } : jogador,
          ),
        );
      } catch (error) {
        console.error("Erro ao demitir jogador:", error);
        alert("Erro ao demitir jogador.");
      }
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      {abaAtual !== "" && (
        <NaviBar abaAtual={abaAtual} setAbaAtual={setAbaAtual} />
      )}
      <main className="telas">
        {abaAtual === "" && <TelaInicial setAbaAtual={setAbaAtual} />}
        {abaAtual === "jogadores" && (
          <TelaMercado jogadores={jogadores} onAlterar={onAlterar} />
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
