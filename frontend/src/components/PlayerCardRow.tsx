import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardRow.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

interface PlayerCardRowProps {
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: Status) => void;
  tipo: number;
  limit: number;
}

export function PlayerCardRow({
  limit,
  tipo,
  jogadores,
  onAlterar,
}: PlayerCardRowProps) {
  return (
    <div className="player-card-row">
      {jogadores.map((jogador) => (
        <PlayerCard
          key={jogador.id}
          onAlterar={onAlterar}
          tipo={tipo}
          jogador={jogador}
        />
      ))}
    </div>
  );
}
