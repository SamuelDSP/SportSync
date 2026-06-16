import { PlayerCardRow } from "../../components/PlayerCardRow";
import "../../estilos/Campo.css"

export function Campo() {
  return (
    <div className="campo">
      <h2 id="campo-titulo">Titulares</h2>
      <PlayerCardRow quantidade={3}/>
      <PlayerCardRow quantidade={3}/>
      <PlayerCardRow quantidade={4}/>
      <PlayerCardRow quantidade={1}/>
    </div>
  );
}
