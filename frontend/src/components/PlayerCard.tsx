import "../estilos/PlayerCard.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";
import machucadoImg from "../assets/machucado.png";

interface PlayerCardProps {
  jogador: Jogador;
  tipo: number;
  onAlterar: (id:number ,novoStatus: Status, rowlimit: number)=>void;
  rowlimit: number
}

export function PlayerCard({ jogador, tipo, onAlterar, rowlimit}: PlayerCardProps) {
  return (
    <>
      <div className="player-card">
        {jogador.status === "lesionado" && (<img className="lesionado" src={machucadoImg} alt="machucado" />)}
        <h2>{jogador.name}</h2>
        {(tipo === 1 || tipo === 4) && <p>Age: {jogador.age}</p>}
        {(tipo === 1 || tipo === 4) && <p>Market Value: {jogador.mktValue}</p>}
        <p>Position: {jogador.position}</p>

        {tipo === 1 && <button onClick={() => onAlterar(jogador.id, "mercado", 0)} className="botao">Demitir</button>}

        {tipo === 2 && (
          <>
            <br />
            <button onClick={() => onAlterar(jogador.id, "reserva",0)} className="botao">Colocar no banco</button>
          </>
        )}

        {tipo === 3 && (
          <>
            <br />
            <button onClick={() => onAlterar(jogador.id, "titular", rowlimit)} className="botao">Colocar de titular</button>
          </>
        )}

        {tipo === 4 && <button onClick={() => onAlterar(jogador.id, "reserva",0)} className="botao">Contratar</button>}
      </div>
      <br />
    </>
  );
}
