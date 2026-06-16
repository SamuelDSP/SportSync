import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardColumn.css";
import type { Jogador } from "../modelos/Jogador";

interface PlayerCardColumnProps {
  title: string;
  tipo: number;
}


const neymar: Jogador = {
  id: 1,
  name: "Neymar",
  age: 34,
  mktValue: 10,
  position: "PE"
}

export function PlayerCardColumn({ title, tipo }: PlayerCardColumnProps) {
  return (
    <div className="player-card-column">
      <h2>{title}</h2>
      <PlayerCard tipo={tipo} jogador={neymar}/>
      <PlayerCard tipo={tipo} jogador={neymar}/>
      <PlayerCard tipo={tipo} jogador={neymar}/>
      <PlayerCard tipo={tipo} jogador={neymar}/>
    </div>
  );
}
