import { PlayerCard } from './PlayerCard.tsx'

import { useState } from "react";

export function App(){
  const [abaAtual, setAbaAtual] = useState("jogadores");

  return (
    <>
      <nav>
        <button onClick={() => setAbaAtual("jogadores")}>
          Jogadores
        </button>

        <button onClick={() => setAbaAtual("times")}>
          Times
        </button>

        <button onClick={() => setAbaAtual("estatisticas")}>
          Estatísticas
        </button>
      </nav>

      <main>
        {abaAtual === "jogadores" && <Jogadores />}
        {abaAtual === "times" && <Times />}
        {abaAtual === "estatisticas" && <Estatisticas />}
      </main>      
    </>
  )
}

function Jogadores() {
  return(
    <>
      <h1>Tela de Jogadores</h1>
      <PlayerCard name='Neymar' age={34} mktValue={10} position='PE'/>
      <PlayerCard name='Ronaldo' age={40} mktValue={5} position='CA'/>
      <PlayerCard name='Marquinhos' age={30} mktValue={30} position='ZAG'/>
      <PlayerCard name='Neymar' age={34} mktValue={10} position='PE'/>
    </>
  )

}

function Times() {
  return <h1>Tela de Times</h1>;
}

function Estatisticas() {
  return <h1>Tela de Estatísticas</h1>;
}
