import "../estilos/tela-jogadores.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { StatusUI } from "../modelos/Jogador.ts";

import { PlayerCardColumn } from "../components/PlayerCardColumn.tsx";

import { useState } from "react";

interface TelaJogadoresProps {
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: StatusUI, rowlimit: number) => void;
}

export function TelaMercado({ jogadores, onAlterar }: TelaJogadoresProps) {
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(20);

  const [busca, setBusca] = useState("");

  const jogadoresFiltrados = jogadores.filter((jogador) =>
    jogador.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const jogadoresVisiveis = jogadoresFiltrados.slice(0, quantidadeVisivel);

  const Atacante = jogadoresVisiveis.filter(
    (j) => j.posicao === "Atacante" && j.status === "MERCADO",
  );
  const Defensor = jogadoresVisiveis.filter(
    (j) => j.posicao === "Defensor" && j.status === "MERCADO",
  );
  const Meiocampo = jogadoresVisiveis.filter(
    (j) => j.posicao === "Meio-campo" && j.status === "MERCADO",
  );
  const Goleiro = jogadoresVisiveis.filter(
    (j) => j.posicao === "Goleiro" && j.status === "MERCADO",
  );
  return (
    <>
      <div className="telajogadores">
        <h1 className="titulo">Tela de Jogadores</h1>
        <input
          type="text"
          name=""
          id="barrapesquisa"
          placeholder="Pesquise um jogador pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="colunas">
          <PlayerCardColumn
            rowlimit={0}
            tipo={4}
            title="Atacantes"
            jogadores={Atacante}
            onAlterar={onAlterar}
          />
          <PlayerCardColumn
            rowlimit={0}
            tipo={4}
            title="Meio-Campistas"
            jogadores={Meiocampo}
            onAlterar={onAlterar}
          />
          <PlayerCardColumn
            rowlimit={0}
            tipo={4}
            title="Defensores"
            jogadores={Defensor}
            onAlterar={onAlterar}
          />
          <PlayerCardColumn
            rowlimit={0}
            tipo={4}
            title="Goleiros"
            jogadores={Goleiro}
            onAlterar={onAlterar}
          />
        </div>
        {quantidadeVisivel < jogadoresFiltrados.length && (
          <div>
            <button onClick={() => setQuantidadeVisivel((q) => q + 50)}>
              Carregar mais
            </button>
            <button onClick={() => window.scrollTo(0, 0)}>
              Voltar ao topo
            </button>
          </div>
        )}
      </div>
    </>
  );
}
