import "../estilos/tela-jogadores.css";


import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

import { PlayerCardColumn } from "../components/PlayerCardColumn.tsx";

interface TelaJogadoresProps{
  jogadores: Jogador[];
  onAlterar: (id:number , novoStatus: Status)=>void;
}

export function TelaJogadores({jogadores, onAlterar}: TelaJogadoresProps) {
  const Atacante=jogadores.filter(j=>(j.position==="Atacante" && j.status==="mercado"));
  const Defensor=jogadores.filter(j=>(j.position==="Defensor" && j.status==="mercado"));
  const Meiocampo=jogadores.filter(j=>(j.position==="Meio-campo" && j.status==="mercado"));
  const Goleiro=jogadores.filter(j=>(j.position==="Goleiro" && j.status==="mercado"));
  return (
    <>
      <div className="tela-jogadores">
        <h1>Tela de Jogadores</h1>
        <div className="colunas">
          <PlayerCardColumn tipo={4} title="Atacantes" jogadores={Atacante} onAlterar={onAlterar}/>
          <PlayerCardColumn tipo={4} title="Meio-Campistas" jogadores={Meiocampo} onAlterar={onAlterar}/>
          <PlayerCardColumn tipo={4} title="Defensores" jogadores={Defensor} onAlterar={onAlterar}/>
          <PlayerCardColumn tipo={4} title="Goleiros" jogadores={Goleiro} onAlterar={onAlterar}/>
        </div>
      </div>
    </>
  );
}
