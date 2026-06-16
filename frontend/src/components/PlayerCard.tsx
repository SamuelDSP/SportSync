import { Jogador } from "../jogador-clase";

import "../estilos/PlayerCard.css";

export interface PlayerCardProps {
  name: string;
  age: number;
  mktValue: number;
  position: string;
  tipo: number;
}

export function PlayerCard({
  name,
  age,
  mktValue,
  position,
  tipo,
}: PlayerCardProps) {
  return (
    <>
      <div className="player-card">
        <h2>Name: {name}</h2>
        <p>Age: {age}</p>
        <p>Maket Value: {mktValue}</p>
        <p>Position: {position}</p>

        {tipo === 1 && <button className="botao" >Demitir</button>}

        {tipo === 2 && <button className="botao">Colocar no banco</button>}

        {tipo === 3 && <button className="botao">Colocar de titular</button>}

        {tipo === 4 && <button className="botao">Contratar</button>}

      </div>
      <br />
    </>
  );
}
