import "../estilos/tela-elenco.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { Status } from "../modelos/Jogador.ts";

import { PlayerCardRow } from "../components/PlayerCardRow";
import { PlayerCardColumn } from "../components/PlayerCardColumn.tsx";
import "../estilos/Campo.css"
import { useState } from "react";

interface TelaElencoProps {
  jogadores: Jogador[];
  onAlterar: (id:number ,novoStatus: Status) => void;
}

export function TelaElenco({ jogadores, onAlterar }: TelaElencoProps) {

  const titulares = jogadores.filter((j) => j.status === "titular");
  const reservas = jogadores.filter((j) => j.status === "reserva");

  const AtacanteTitu = titulares.filter((j) => j.position === "Atacante");
  const DefensorTitu = titulares.filter((j) => j.position === "Defensor");
  const MeiocampoTitu = titulares.filter((j) => j.position === "Meio-campo");
  const GoleiroTitu = titulares.filter((j) => j.position === "Goleiro");

  const Atacante = reservas.filter((j) => j.position === "Atacante");
  const Defensor = reservas.filter((j) => j.position === "Defensor");
  const Meiocampo = reservas.filter((j) => j.position === "Meio-campo");
  const Goleiro = reservas.filter((j) => j.position === "Goleiro");


  return (
    <>
      <h1>Tela Elenco</h1>
      <main className="campo-elenco">
        <div className="campo">
          <h2 id="campo-titulo">Titulares</h2>
          <PlayerCardRow limit={3} tipo={2} jogadores={AtacanteTitu} onAlterar={onAlterar}/>{/* implementar num de jogadores por linha */}
          <PlayerCardRow limit={3} tipo={2} jogadores={MeiocampoTitu} onAlterar={onAlterar} />
          <PlayerCardRow limit={4} tipo={2} jogadores={DefensorTitu} onAlterar={onAlterar} />
          <PlayerCardRow limit={1} tipo={2} jogadores={GoleiroTitu} onAlterar={onAlterar} />
        </div>
      </main>

      <div className="banco">
        <div className="colunas">
            <PlayerCardColumn tipo={3} title="Atacantes" jogadores={Atacante} onAlterar={onAlterar}/>
            <PlayerCardColumn tipo={3} title="Meio-Campistas" jogadores={Meiocampo} onAlterar={onAlterar}/>
            <PlayerCardColumn tipo={3} title="Defensores" jogadores={Defensor} onAlterar={onAlterar}/>
            <PlayerCardColumn tipo={3} title="Goleiros" jogadores={Goleiro} onAlterar={onAlterar}/>
          </div>
      </div>
    </>
  );
}
