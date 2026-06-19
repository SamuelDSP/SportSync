import "../estilos/tela-jogadores.css";


import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

import { PlayerCardColumn } from "../components/PlayerCardColumn.tsx";

import { useState } from "react";

interface TelaJogadoresProps{
  jogadores: Jogador[];
  onAlterar: (id:number , novoStatus: Status, rowlimit: number)=>void;
}

export function TelaJogadores({jogadores, onAlterar}: TelaJogadoresProps) {

  const [busca, setBusca] = useState("");

  const jogadoresFiltrados = jogadores.filter((jogador) =>
    jogador.name.toLowerCase().includes(busca.toLowerCase())
  );

  const Atacante=jogadoresFiltrados.filter(j=>(j.position==="Atacante" && j.status==="mercado"));
  const Defensor=jogadoresFiltrados.filter(j=>(j.position==="Defensor" && j.status==="mercado"));
  const Meiocampo=jogadoresFiltrados.filter(j=>(j.position==="Meio-campo" && j.status==="mercado"));
  const Goleiro=jogadoresFiltrados.filter(j=>(j.position==="Goleiro" && j.status==="mercado"));
  return (
    <>
      <div className="telajogadores">
        <h1 className="titulo">Tela de Jogadores</h1>
        <input type="text" name="" id="barrapesquisa" placeholder="Pesquise um jogador pelo nome..." value={busca} onChange={(e)=>setBusca(e.target.value)}/>
        <div className="colunas">
          <PlayerCardColumn rowlimit={0} tipo={4} title="Atacantes" jogadores={Atacante} onAlterar={onAlterar}/>
          <PlayerCardColumn rowlimit={0} tipo={4} title="Meio-Campistas" jogadores={Meiocampo} onAlterar={onAlterar}/>
          <PlayerCardColumn rowlimit={0} tipo={4} title="Defensores" jogadores={Defensor} onAlterar={onAlterar}/>
          <PlayerCardColumn rowlimit={0} tipo={4} title="Goleiros" jogadores={Goleiro} onAlterar={onAlterar}/>
        </div>
      </div>
    </>
  );
}
