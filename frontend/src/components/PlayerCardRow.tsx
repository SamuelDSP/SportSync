
import { PlayerCard } from "./PlayerCard";
import "../estilos/PlayerCardRow.css";

interface PlayerCardRowProps {
    quantidade: number;
}


export function PlayerCardRow({ quantidade }: PlayerCardRowProps) {
    return (
        <div className="player-card-row">
            {Array.from({ length: quantidade }).map((_, index) => (
                <PlayerCard
                    tipo={2}
                    key={index}
                    name="Neymar"
                    age={34}
                    mktValue={10}
                    position="PE"
                />
            ))}
        </div>
    );
}