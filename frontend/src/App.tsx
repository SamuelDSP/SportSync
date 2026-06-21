import { TelaMercado } from "./pages/TelaMercado.tsx";
import { TelaTimes } from "./pages/TelaTimes.tsx";
import { TelaFinanceiro } from "./pages/TelaFinanceiro.tsx";
import { useState, useEffect } from "react";
import { NaviBar } from "./components/NaviBar.tsx";
import { TelaElenco } from "./pages/TelaElenco.tsx";
import { TelaInicial } from "./pages/TelaInicial.tsx";
import type { Jogador, TipoElenco } from "./modelos/Jogador.ts";
import { ModalContratacao } from "./components/ModalContratacao.tsx";
import type { StatusUI } from "./modelos/Jogador.ts";
import {
  getJogadoresElenco,
  getJogadoresMercado,
} from "./services/getJogadores.ts";
import "./estilos/App.css";
import { demitirJogador, contratarJogador } from "./services/alterarStatus.ts";

export const CLUBE_ID = 2;

export function App() {
  const [abaAtual, setAbaAtual] = useState("");
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do modal de contratação
  const [modalJogador, setModalJogador] = useState<Jogador|null>();
  const [pendente, setPendente] = useState<{
    novoStatus: StatusUI;
    rowlimit: number;
    novotipoElenco?: TipoElenco;
  } | null>(null);

  useEffect(() => {
    if (abaAtual === "") {
      document.body.classList.remove("dentro");
    } else {
      document.body.classList.add("dentro");
    }
  }, [abaAtual]);

  useEffect(() => {
    async function load() {
      try {
        const [jogadoresElenco, jogadoresMercado] = await Promise.all([
          getJogadoresElenco(),
          getJogadoresMercado(),
        ]);
        console.log("ELENCO:", jogadoresElenco);
        console.log("MERCADO:", jogadoresMercado);
        setJogadores([...jogadoresElenco, ...jogadoresMercado]);
      } catch (error) {
        console.error("Erro ao carregar jogadores:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onAlterar(
    id: number,
    novoStatus: StatusUI,
    rowlimit: number,
    novotipoElenco?: TipoElenco,
  ) {
    const player = jogadores.find((p) => p.id === id);
    if (!player) return;

    const titulares = jogadores.filter(
      (jogador) => jogador.tipoElenco === "TITULAR",
    );

    //colocar titular
    if (novotipoElenco === "TITULAR" && player.status==="ELENCO") {
      if (titulares.length >= 11) {
        alert("Já existem 11 titulares!");
        return;
      }

      const porPosicao = titulares.filter((p) => p.posicao === player.posicao);
      if (porPosicao.length >= rowlimit) {
        alert("A quantidade de titulares nessa posição foi atingida!");
        return;
      }

      setJogadores((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: novoStatus, tipoElenco: novotipoElenco } : j)),
      );
      return;
    }

    //contratar ou colocar no banco
    if (novoStatus === "ELENCO" || novotipoElenco === "RESERVA") {
      if (player.status === "MERCADO") {
        try {
          setModalJogador(player);
          setPendente({ novoStatus, rowlimit, novotipoElenco });
          
          return;
        } catch (error) {
          console.error("Erro ao contratar jogador:", error);
          alert("Erro ao contratar jogador.");
        }
      } else {
        setJogadores((jogadores) =>
          jogadores.map((jogador) =>
            jogador.id === id ? { ...jogador, status: novoStatus, tipoElenco: novotipoElenco } : jogador, 
          ),
        );
      }
    }

    //demitir
    if (novoStatus === "MERCADO") {
      try {
        await demitirJogador(id);
        setJogadores((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: novoStatus } : j)),
        );
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : "Erro ao demitir jogador.";
        alert(msg);
      }
      return;
    }
  }

  // Chamado quando o usuário confirma o salário no modal
  async function handleConfirmarContratacao(salarioAceito: number) {
    if (!modalJogador || !pendente) return;

    try {
      await contratarJogador(modalJogador.id, salarioAceito);
      setJogadores((prev) =>
        prev.map((j) =>
          j.id === modalJogador.id
            ? { ...j, status: pendente.novoStatus, salarioAtual: salarioAceito, tipoElenco: pendente.novotipoElenco }
            : j,
        ),
      );
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro ao contratar jogador.";
      alert(msg);
    } finally {
      setModalJogador(null);
      setPendente(null);
    }
  }

  function handleCancelarModal() {
    setModalJogador(null);
    setPendente(null);
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      {abaAtual !== "" && (
        <NaviBar abaAtual={abaAtual} setAbaAtual={setAbaAtual} />
      )}

      {/* Modal de contratação (renderiza acima de tudo quando aberto) */}
      {modalJogador && (
        <ModalContratacao
          jogador={modalJogador}
          onConfirmar={handleConfirmarContratacao}
          onCancelar={handleCancelarModal}
        />
      )}

      <main className="telas">
        {abaAtual === "" && <TelaInicial setAbaAtual={setAbaAtual} />}
        {abaAtual === "jogadores" && (
          <TelaMercado jogadores={jogadores} onAlterar={onAlterar} />
        )}
        {abaAtual === "times" && <TelaTimes />}
        {abaAtual === "financeiro" && <TelaFinanceiro clubeId={CLUBE_ID} />}
        {abaAtual === "elenco" && (
          <TelaElenco jogadores={jogadores} onAlterar={onAlterar} />
        )}
      </main>
    </>
  );
}
