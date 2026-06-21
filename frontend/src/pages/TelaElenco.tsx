import "../estilos/tela-elenco.css";

import type { Jogador } from "../modelos/Jogador.ts";
import type { StatusUI } from "../modelos/Jogador.ts";

import { PlayerCardRow } from "../components/PlayerCardRow";
import { PlayerCardColumn } from "../components/PlayerCardColumn.tsx";
import "../estilos/Campo.css";
import { useState, useEffect } from "react";

import type { TipoElenco } from "../modelos/Jogador.ts";

interface TelaElencoProps {
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: StatusUI, rowlimit: number, novotipoElenco?: TipoElenco) => void;
}

export function TelaElenco({ jogadores, onAlterar }: TelaElencoProps) {
  const [rowlimitDef, setRowlimitDef] = useState(4);
  const [rowlimitAta, setRowlimitAta] = useState(3);
  const [rowlimitMei, setRowlimitMei] = useState(3);

  const titulares = jogadores.filter((j) => j.tipoElenco === "TITULAR");
  const reservas = jogadores.filter((j) => j.tipoElenco === "RESERVA");

  const AtacanteTitu = titulares.filter((j) => j.posicao === "Atacante");
  const DefensorTitu = titulares.filter((j) => j.posicao === "Defensor");
  const MeiocampoTitu = titulares.filter((j) => j.posicao === "Meio-campo");
  const GoleiroTitu = titulares.filter((j) => j.posicao === "Goleiro");

  const Atacante = reservas.filter((j) => j.posicao === "Atacante");
  const Defensor = reservas.filter((j) => j.posicao === "Defensor");
  const Meiocampo = reservas.filter((j) => j.posicao === "Meio-campo");
  const Goleiro = reservas.filter((j) => j.posicao === "Goleiro");

  function atualizaTitular() {
    const excessoAta = AtacanteTitu.length - rowlimitAta;
    const excessoDef = DefensorTitu.length - rowlimitDef;
    const excessoMei = MeiocampoTitu.length - rowlimitMei;

    for (let i = 0; i < excessoAta; i++) {
      onAlterar(AtacanteTitu[i].id, "ELENCO", 0, "RESERVA");
    }
    for (let i = 0; i < excessoDef; i++) {
      onAlterar(DefensorTitu[i].id, "ELENCO", 0, "RESERVA");
    }
    for (let i = 0; i < excessoMei; i++) {
      onAlterar(MeiocampoTitu[i].id, "ELENCO", 0, "RESERVA");
    }
  }

  useEffect(() => {
    atualizaTitular();
  }, [rowlimitAta, rowlimitDef, rowlimitMei]);

  return (
    <>
      <div className="telaelenco">
        <h1 className="titulo">Tela Elenco</h1>
        <main className="campo-elenco">
          <div className="campo">
            <h2 id="campo-titulo">Titulares</h2>
            <PlayerCardRow
              rowlimit={0}
              tipo={2}
              jogadores={AtacanteTitu}
              onAlterar={onAlterar}
            />
            {/* implementar num de jogadores por linha */}
            <PlayerCardRow
              rowlimit={0}
              tipo={2}
              jogadores={MeiocampoTitu}
              onAlterar={onAlterar}
            />
            <PlayerCardRow
              rowlimit={0}
              tipo={2}
              jogadores={DefensorTitu}
              onAlterar={onAlterar}
            />
            <PlayerCardRow
              rowlimit={0}
              tipo={2}
              jogadores={GoleiroTitu}
              onAlterar={onAlterar}
            />
            <h2 id="campo-titulo">
              Esquema: {rowlimitDef}-{rowlimitMei}-{rowlimitAta}
            </h2>
          </div>
        </main>

        <div className="alterarEsquema">
          <button
            onClick={() => {
              setRowlimitAta(3);
              setRowlimitMei(3);
              setRowlimitDef(4);
            }}
            className="botao"
          >
            {" "}
            4-3-3{" "}
          </button>
          <button
            onClick={() => {
              setRowlimitAta(2);
              setRowlimitMei(4);
              setRowlimitDef(4);
            }}
            className="botao"
          >
            {" "}
            4-4-2{" "}
          </button>
          <button
            onClick={() => {
              setRowlimitAta(2);
              setRowlimitMei(5);
              setRowlimitDef(3);
            }}
            className="botao"
          >
            {" "}
            3-5-2{" "}
          </button>
          <button
            onClick={() => {
              setRowlimitAta(3);
              setRowlimitMei(4);
              setRowlimitDef(3);
            }}
            className="botao"
          >
            {" "}
            3-4-3{" "}
          </button>
          <button
            onClick={() => {
              setRowlimitAta(2);
              setRowlimitMei(3);
              setRowlimitDef(5);
            }}
            className="botao"
          >
            {" "}
            5-3-2{" "}
          </button>
        </div>

        <div className="banco">
          <div className="colunas">
            <PlayerCardColumn
              rowlimit={rowlimitAta}
              tipo={3}
              title="Atacantes"
              jogadores={Atacante}
              onAlterar={onAlterar}
            />
            <PlayerCardColumn
              rowlimit={rowlimitMei}
              tipo={3}
              title="Meio-Campistas"
              jogadores={Meiocampo}
              onAlterar={onAlterar}
            />
            <PlayerCardColumn
              rowlimit={rowlimitDef}
              tipo={3}
              title="Defensores"
              jogadores={Defensor}
              onAlterar={onAlterar}
            />
            <PlayerCardColumn
              rowlimit={1}
              tipo={3}
              title="Goleiros"
              jogadores={Goleiro}
              onAlterar={onAlterar}
            />
          </div>
        </div>
      </div>
    </>
  );
}
