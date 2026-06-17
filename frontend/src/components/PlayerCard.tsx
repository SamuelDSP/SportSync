import "../estilos/PlayerCard.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

interface PlayerCardProps {
  jogador: Jogador;
  tipo: number;
  onAlterar: (id:number ,novoStatus: Status)=>void;
}

export function PlayerCard({ jogador, tipo, onAlterar }: PlayerCardProps) {
  return (
    <>
      <div className="player-card">
        <h2>{jogador.name}</h2>
        {(tipo === 1 || tipo === 4) && <p>Age: {jogador.age}</p>}
        {(tipo === 1 || tipo === 4) && <p>Market Value: {jogador.mktValue}</p>}
        <p>Position: {jogador.position}</p>

        {tipo === 1 && <button onClick={() => onAlterar(jogador.id, "mercado")} className="botao">Demitir</button>}

        {tipo === 2 && (
          <>
            <br />
            <button className="botao">Colocar no banco</button>
          </>
        )}

        {tipo === 3 && (
          <>
            <br />
            <button className="botao">Colocar de titular</button>
          </>
        )}

        {tipo === 4 && <button className="botao">Contratar</button>}
      </div>
      <br />
    </>
  );
}
