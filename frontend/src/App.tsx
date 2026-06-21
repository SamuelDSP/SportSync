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
  const [jogadores, setJogadores] = useState<Jogador[]>([
    // ELENCO
    {
      id: 1,
      nome: "Alisson Becker",
      idade: 32,
      valorMercado: 250000000,
      posicao: "Goleiro",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 2,
      nome: "Marquinhos",
      idade: 31,
      valorMercado: 180000000,
      posicao: "Defensor",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 3,
      nome: "Éder Militão",
      idade: 28,
      valorMercado: 320000000,
      posicao: "Defensor",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 4,
      nome: "Alex Sandro",
      idade: 35,
      valorMercado: 40000000,
      posicao: "Defensor",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 5,
      nome: "Danilo",
      idade: 34,
      valorMercado: 50000000,
      posicao: "Defensor",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 6,
      nome: "Casemiro",
      idade: 34,
      valorMercado: 150000000,
      posicao: "Meio-campo",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 7,
      nome: "Bruno Guimarães",
      idade: 29,
      valorMercado: 350000000,
      posicao: "Meio-campo",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 8,
      nome: "Lucas Paquetá",
      idade: 29,
      valorMercado: 300000000,
      posicao: "Meio-campo",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 9,
      nome: "Vinícius Júnior",
      idade: 26,
      valorMercado: 1000000000,
      posicao: "Atacante",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 10,
      nome: "Rodrygo",
      idade: 25,
      valorMercado: 700000000,
      posicao: "Atacante",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },
    {
      id: 11,
      nome: "Neymar",
      idade: 34,
      valorMercado: 250000000,
      posicao: "Atacante",
      status: "ELENCO",
      tipoElenco: "TITULAR",
    },

    {
      id: 12,
      nome: "Ederson",
      idade: 31,
      valorMercado: 220000000,
      posicao: "Goleiro",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },
    {
      id: 13,
      nome: "Gabriel Magalhães",
      idade: 28,
      valorMercado: 280000000,
      posicao: "Defensor",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },
    {
      id: 14,
      nome: "Léo Ortiz",
      idade: 30,
      valorMercado: 80000000,
      posicao: "Defensor",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },
    {
      id: 15,
      nome: "André",
      idade: 25,
      valorMercado: 120000000,
      posicao: "Meio-campo",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },
    {
      id: 16,
      nome: "Douglas Luiz",
      idade: 28,
      valorMercado: 240000000,
      posicao: "Meio-campo",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },
    {
      id: 17,
      nome: "Raphinha",
      idade: 30,
      valorMercado: 400000000,
      posicao: "Atacante",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },
    {
      id: 18,
      nome: "Endrick",
      idade: 20,
      valorMercado: 500000000,
      posicao: "Atacante",
      status: "ELENCO",
      tipoElenco: "RESERVA",
    },

    // MERCADO
    {
      id: 19,
      nome: "Bento",
      idade: 27,
      valorMercado: 90000000,
      posicao: "Goleiro",
      status: "MERCADO",
    },
    {
      id: 20,
      nome: "Weverton",
      idade: 38,
      valorMercado: 20000000,
      posicao: "Goleiro",
      status: "MERCADO",
    },
    {
      id: 21,
      nome: "Murilo",
      idade: 29,
      valorMercado: 70000000,
      posicao: "Defensor",
      status: "MERCADO",
    },
    {
      id: 22,
      nome: "Yan Couto",
      idade: 24,
      valorMercado: 180000000,
      posicao: "Defensor",
      status: "MERCADO",
    },
    {
      id: 23,
      nome: "Guilherme Arana",
      idade: 29,
      valorMercado: 110000000,
      posicao: "Defensor",
      status: "MERCADO",
    },
    {
      id: 24,
      nome: "Wesley",
      idade: 22,
      valorMercado: 90000000,
      posicao: "Defensor",
      status: "MERCADO",
    },
    {
      id: 25,
      nome: "João Gomes",
      idade: 25,
      valorMercado: 230000000,
      posicao: "Meio-campo",
      status: "MERCADO",
    },
    {
      id: 26,
      nome: "Joelinton",
      idade: 30,
      valorMercado: 260000000,
      posicao: "Meio-campo",
      status: "MERCADO",
    },
    {
      id: 27,
      nome: "Gerson",
      idade: 29,
      valorMercado: 90000000,
      posicao: "Meio-campo",
      status: "MERCADO",
    },
    {
      id: 28,
      nome: "Raphael Veiga",
      idade: 31,
      valorMercado: 80000000,
      posicao: "Meio-campo",
      status: "MERCADO",
    },
    {
      id: 29,
      nome: "Andrey Santos",
      idade: 22,
      valorMercado: 140000000,
      posicao: "Meio-campo",
      status: "MERCADO",
    },
    {
      id: 30,
      nome: "Matheus Pereira",
      idade: 30,
      valorMercado: 70000000,
      posicao: "Meio-campo",
      status: "MERCADO",
    },
    {
      id: 31,
      nome: "Gabriel Jesus",
      idade: 29,
      valorMercado: 220000000,
      posicao: "Atacante",
      status: "MERCADO",
    },
    {
      id: 32,
      nome: "Richarlison",
      idade: 29,
      valorMercado: 180000000,
      posicao: "Atacante",
      status: "MERCADO",
    },
    {
      id: 33,
      nome: "Pedro",
      idade: 30,
      valorMercado: 100000000,
      posicao: "Atacante",
      status: "MERCADO",
    },
    {
      id: 34,
      nome: "Evanilson",
      idade: 27,
      valorMercado: 130000000,
      posicao: "Atacante",
      status: "MERCADO",
    },
    {
      id: 35,
      nome: "Luiz Henrique",
      idade: 25,
      valorMercado: 220000000,
      posicao: "Atacante",
      status: "MERCADO",
    },
    {
      id: 36,
      nome: "Estevão",
      idade: 19,
      valorMercado: 350000000,
      posicao: "Atacante",
      status: "MERCADO",
    },

    // DEMITIDOS
    {
      id: 37,
      nome: "Thiago Silva",
      idade: 41,
      valorMercado: 30000000,
      posicao: "Defensor",
      status: "DEMITIDO",
    },
    {
      id: 38,
      nome: "Alan Patrick",
      idade: 35,
      valorMercado: 40000000,
      posicao: "Meio-campo",
      status: "DEMITIDO",
    },
    {
      id: 39,
      nome: "Paulinho",
      idade: 26,
      valorMercado: 150000000,
      posicao: "Atacante",
      status: "DEMITIDO",
    },
    {
      id: 40,
      nome: "David Luiz",
      idade: 39,
      valorMercado: 10000000,
      posicao: "Defensor",
      status: "DEMITIDO",
    },
  ]);
  const [loading, setLoading] = useState(true);

  // Estado do modal de contratação
  const [modalJogador, setModalJogador] = useState<Jogador|null>();
  const [pendente, setPendente] = useState<{
    novoStatus: StatusUI;
    rowlimit: number;
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
          getJogadoresElenco(CLUBE_ID),
          getJogadoresMercado(),
        ]);

        // Elenco vem com status ELENCO da API → mapeia para "reserva" no front
        const elencoMapeado: Jogador[] = jogadoresElenco.map((j: Jogador) => ({
          ...j,
          status: "reserva" as StatusUI,
        }));

        // Mercado já vem com status MERCADO
        const mercadoMapeado: Jogador[] = jogadoresMercado.map((j: Jogador) => ({
          ...j,
          status: "MERCADO" as StatusUI,
        }));

        setJogadores([...elencoMapeado, ...mercadoMapeado]);
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
          setPendente({ novoStatus, rowlimit });
          
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
            ? { ...j, status: pendente.novoStatus, salarioAtual: salarioAceito }
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
