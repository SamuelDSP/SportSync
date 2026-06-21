import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardRow.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { StatusUI } from "../modelos/Jogador.ts";
import type { TipoElenco } from "../modelos/Jogador.ts";

interface PlayerCardRowProps {
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: StatusUI, rowlimit: number, novotipoElenco: TipoElenco) => void;
  tipo: number;
  rowlimit: number;
}

export function PlayerCardRow({
  rowlimit,
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
          rowlimit={rowlimit}
        />
      ))}
    </div>
  );
}
