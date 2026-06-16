import "../../estilos/tela-jogadores.css";

import { PlayerCardColumn } from "../../components/PlayerCardColumn.tsx";

export function TelaJogadores({ verba }: { verba: number }) {
  return (
    <>
      <div className="tela-jogadores">
        <h1>Tela de Jogadores</h1>
        <div className="amount">
          <h2>Amount: {verba}</h2>
        </div>
        <div className="colunas">
          <PlayerCardColumn tipo={4} title="Atacantes" />
          <PlayerCardColumn tipo={4} title="Meio-Campistas" />
          <PlayerCardColumn tipo={4} title="Defensores" />
          <PlayerCardColumn tipo={4} title="Goleiros" />
        </div>
      </div>
    </>
  );
}
