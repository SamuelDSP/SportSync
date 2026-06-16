import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardColumn.css";

interface PlayerCardColumnProps {
  title: string;
}

export function PlayerCardColumn({ title }: PlayerCardColumnProps) {
  return (
    <div className="player-card-column">
      <h2>{title}</h2>
      <PlayerCard tipo={4} name="Neymar" age={34} mktValue={10} position="PE" />
      <PlayerCard tipo={4} name="Ronaldo" age={40} mktValue={5} position="CA" />
      <PlayerCard tipo={4} name="Marquinhos" age={30} mktValue={30} position="PE" />
      <PlayerCard tipo={4} name="Neymar" age={34} mktValue={10} position="PE" />
    </div>
  );
}
