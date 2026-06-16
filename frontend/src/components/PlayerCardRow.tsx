import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardRow.css";

import type { Jogador } from "../modelos/Jogador";

interface PlayerCardRowProps {
    quantidade: number;
}

const neymar: Jogador = {
  id: 1,
  name: "Neymar",
  age: 34,
  mktValue: 10,
  position: "PE"
}

export function PlayerCardRow({ quantidade }: PlayerCardRowProps) {
    return (
        <div className="player-card-row">
            {Array.from({ length: quantidade }).map((_, index) => (
                <PlayerCard jogador={neymar} tipo={2}/>
            ))}
        </div>
    );
}