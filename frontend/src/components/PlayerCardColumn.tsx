import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardColumn.css";
import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

interface PlayerCardColumnProps {
  title: string;
  tipo: number;
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: Status, rowlimit: number) => void;
  rowlimit: number;
}

export function PlayerCardColumn({
  jogadores,
  title,
  tipo,
  onAlterar,
  rowlimit,
}: PlayerCardColumnProps) {
  return (
    <div className="player-card-column">
      <h2 id="titulo">{title}</h2>
      {jogadores.map((jogador) => (
        <PlayerCard
          onAlterar={onAlterar}
          tipo={tipo}
          jogador={jogador}
          rowlimit={rowlimit}
        />
      ))}
    </div>
  );
}
