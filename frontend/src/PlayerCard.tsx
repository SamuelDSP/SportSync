import { Jogador } from "./jogador-clase";

import "./PlayerCard.css";

export function PlayerCard(person: Jogador) {
  return (
    <>
      <div className="player-card">
        <h2>Name: {person.name}</h2>
        <p>Age: {person.age}</p>
        <p>Maket Value: {person.mktValue}</p>
        <p>Position: {person.position}</p>
      </div>
      <br />
    </>
  );
}



