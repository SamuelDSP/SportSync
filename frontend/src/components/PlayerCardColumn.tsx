import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardColumn.css"

interface PlayerCardColumnProps {
  title: string;
}

export function PlayerCardColumn({title}: PlayerCardColumnProps){
    return(
        <div className="player-card-grid">
            <h2>{title}</h2>
            <PlayerCard name="Neymar" age={34} mktValue={10} position="PE" />
            <PlayerCard name="Ronaldo" age={40} mktValue={5} position="CA" />
            <PlayerCard name="Marquinhos" age={30} mktValue={30} position="PE" />
            <PlayerCard name="Neymar" age={34} mktValue={10} position="PE" />
        </div>
    )
}