import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardRow.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

interface PlayerCardRowProps {
  jogadores: Jogador[];
  onAlterar: (id:number ,novoStatus: Status)=>void;
}


export function PlayerCardRow({jogadores, onAlterar}: PlayerCardRowProps) {
  return (
    <div className="player-card-row">
      {jogadores.map((jogador) => (
        <PlayerCard key={jogador.id} onAlterar={onAlterar} tipo={1} jogador={jogador} />
      ))}
    </div>
  );
}
