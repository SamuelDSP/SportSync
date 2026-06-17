
import { PlayerCardColumn } from "../../components/PlayerCardColumn";



export function Banco() {
  return (
    <div className="banco">
      <h2>Reservas</h2>
      <div className="colunas">
        <PlayerCardColumn tipo={3} title="Atacantes" />
        <PlayerCardColumn tipo={3} title="Meio-Campistas" />
        <PlayerCardColumn tipo={3} title="Defensores" />
        <PlayerCardColumn tipo={3} title="Goleiros" />
      </div>
    </div>
  );
}
