import "../estilos/tela-elenco.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

import { PlayerCardRow } from "../components/PlayerCardRow";
import "../estilos/Campo.css"

interface TelaElencoProps {
  jogadores: Jogador[];
  onAlterar: (id:number ,novoStatus: Status) => void;
}

export function TelaElenco({ jogadores, onAlterar }: TelaElencoProps) {
  const titulares = jogadores.filter((j) => j.status === "titular");
  const reservas = jogadores.filter((j) => j.status === "reserva");
  return (
    <>
      <h1>Tela Elenco</h1>
      <main className="campo-elenco">
        <div className="campo">
          <h2 id="campo-titulo">Titulares</h2>
          <PlayerCardRow jogadores={titulares} onAlterar={onAlterar}/>
          <PlayerCardRow jogadores={titulares} onAlterar={onAlterar} />
          <PlayerCardRow jogadores={titulares} onAlterar={onAlterar} />
          <PlayerCardRow jogadores={titulares} onAlterar={onAlterar} />
        </div>
      </main>

      <div className="banco">
        
      
      </div>
    </>
  );
}
