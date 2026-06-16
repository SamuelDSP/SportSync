import "../../estilos/tela-jogadores.css";

import { PlayerCardColumn } from "../PlayerCardColumn.tsx";

export function TelaJogadores() {
  return (
    <>
      <h1>Tela de Jogadores</h1>
      <div className="colunas">
        <PlayerCardColumn title="Atacantes" />
        <PlayerCardColumn title="Meio-Campistas" />
        <PlayerCardColumn title="Defensores" />
        <PlayerCardColumn title="Goleiros" />
      </div>
    </>
  );
}
