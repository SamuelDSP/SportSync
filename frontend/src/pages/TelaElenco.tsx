import { useState, useEffect } from "react";
import type { Jogador, StatusUI, TipoElenco } from "../modelos/Jogador.ts";

interface TelaElencoProps {
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: StatusUI, rowlimit: number, novotipoElenco?: TipoElenco) => void;
}

const IconePosicao: Record<string, string> = {
  ATACANTE: "⚔️",
  MEIO_CAMPO: "🔄",
  DEFENSOR: "🛡️",
  GOLEIRO: "🧤",
};

// ── Card compacto ─────────────────────────────────────────────────────────────
function CardCompacto({
  jogador,
  tipo,
  onAlterar,
  rowlimit,
}: {
  jogador: Jogador;
  tipo: "titular" | "reserva" | "banco";
  onAlterar: TelaElencoProps["onAlterar"];
  rowlimit?: number;
}) {
  return (
    <div style={e.card}>
      <span style={e.cardIcon}>{IconePosicao[jogador.posicao] ?? "⚽"}</span>
      <span style={e.cardNome}>{jogador.nome}</span>
      {tipo === "titular" && (
        <button
          style={e.btnBanco}
          onClick={() => onAlterar(jogador.id, "ELENCO", 0, "RESERVA")}
        >
          → Banco
        </button>
      )}
      {tipo === "banco" && (
        <button
          style={e.btnTitular}
          onClick={() => onAlterar(jogador.id, "ELENCO", rowlimit ?? 0, "TITULAR")}
        >
          → Titular
        </button>
      )}
      {tipo === "reserva" && (
        <button
          style={e.btnDemitir}
          onClick={() => onAlterar(jogador.id, "MERCADO", 0)}
        >
          Demitir
        </button>
      )}
    </div>
  );
}

// ── Linha do campo ────────────────────────────────────────────────────────────
function LinhaField({
  label,
  jogadores,
  onAlterar,
}: {
  label: string;
  jogadores: Jogador[];
  onAlterar: TelaElencoProps["onAlterar"];
}) {
  return (
    <div style={e.linhaField}>
      <span style={e.linhaLabel}>{label}</span>
      <div style={e.linhaCards}>
        {jogadores.length === 0 ? (
          <span style={e.vazio}>—</span>
        ) : (
          jogadores.map((j) => (
            <CardCompacto key={j.id} jogador={j} tipo="titular" onAlterar={onAlterar} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────
export function TelaElenco({ jogadores, onAlterar }: TelaElencoProps) {
  const [rowlimitDef, setRowlimitDef] = useState(4);
  const [rowlimitAta, setRowlimitAta] = useState(3);
  const [rowlimitMei, setRowlimitMei] = useState(3);

  const elenco   = jogadores.filter((j) => j.status === "ELENCO");
  const titulares = elenco.filter((j) => j.tipoElenco === "TITULAR");
  const reservas  = elenco.filter((j) => j.tipoElenco === "RESERVA");

  const AtaTitu  = titulares.filter((j) => j.posicao === "ATACANTE");
  const MeiTitu  = titulares.filter((j) => j.posicao === "MEIO_CAMPO");
  const DefTitu  = titulares.filter((j) => j.posicao === "DEFENSOR");
  const GolTitu  = titulares.filter((j) => j.posicao === "GOLEIRO");

  const AtaRes   = reservas.filter((j) => j.posicao === "ATACANTE");
  const MeiRes   = reservas.filter((j) => j.posicao === "MEIO_CAMPO");
  const DefRes   = reservas.filter((j) => j.posicao === "DEFENSOR");
  const GolRes   = reservas.filter((j) => j.posicao === "GOLEIRO");

  useEffect(() => {
    const excAta = AtaTitu.length - rowlimitAta;
    const excDef = DefTitu.length - rowlimitDef;
    const excMei = MeiTitu.length - rowlimitMei;
    for (let i = 0; i < excAta; i++) onAlterar(AtaTitu[i].id, "ELENCO", 0, "RESERVA");
    for (let i = 0; i < excDef; i++) onAlterar(DefTitu[i].id, "ELENCO", 0, "RESERVA");
    for (let i = 0; i < excMei; i++) onAlterar(MeiTitu[i].id, "ELENCO", 0, "RESERVA");
  }, [rowlimitAta, rowlimitDef, rowlimitMei]);

  const esquemas = [
    { label: "4-3-3", def: 4, mei: 3, ata: 3 },
    { label: "4-4-2", def: 4, mei: 4, ata: 2 },
    { label: "3-5-2", def: 3, mei: 5, ata: 2 },
    { label: "3-4-3", def: 3, mei: 4, ata: 3 },
    { label: "5-3-2", def: 5, mei: 3, ata: 2 },
  ];

  return (
    <div style={e.page}>
      {/* ── Header ── */}
      <div style={e.header}>
        <div>
          <h1 style={e.titulo}>Elenco</h1>
          <p style={e.subtitulo}>
            {titulares.length} titular{titulares.length !== 1 ? "es" : ""} · {reservas.length} no banco
          </p>
        </div>
        <div style={e.esquemasBtns}>
          {esquemas.map((es) => (
            <button
              key={es.label}
              style={{
                ...e.esquemaBtn,
                ...(rowlimitDef === es.def && rowlimitMei === es.mei && rowlimitAta === es.ata
                  ? e.esquemaBtnAtivo : {}),
              }}
              onClick={() => {
                setRowlimitDef(es.def);
                setRowlimitMei(es.mei);
                setRowlimitAta(es.ata);
              }}
            >
              {es.label}
            </button>
          ))}
        </div>
      </div>

      <div style={e.divider} />

      {/* ── Campo ── */}
      <div style={e.campo}>
        <p style={e.campoTitulo}>
          Titulares — {rowlimitDef}-{rowlimitMei}-{rowlimitAta}
        </p>
        <LinhaField label="ATQ" jogadores={AtaTitu} onAlterar={onAlterar} />
        <LinhaField label="MEI" jogadores={MeiTitu} onAlterar={onAlterar} />
        <LinhaField label="DEF" jogadores={DefTitu} onAlterar={onAlterar} />
        <LinhaField label="GOL" jogadores={GolTitu} onAlterar={onAlterar} />
      </div>

      <div style={e.divider} />

      {/* ── Banco ── */}
      <p style={e.bancoTitulo}>Banco de Reservas</p>
      <div style={e.bancoGrid}>
        {[
          { label: "Atacantes",    lista: AtaRes, limit: rowlimitAta },
          { label: "Meio-Campo",   lista: MeiRes, limit: rowlimitMei },
          { label: "Defensores",   lista: DefRes, limit: rowlimitDef },
          { label: "Goleiros",     lista: GolRes, limit: 1 },
        ].map(({ label, lista, limit }) => (
          <div key={label} style={e.bancoColuna}>
            <p style={e.bancoColunaLabel}>{label}</p>
            {lista.length === 0
              ? <span style={e.vazio}>Vazio</span>
              : lista.map((j) => (
                  <CardCompacto key={j.id} jogador={j} tipo="banco" onAlterar={onAlterar} rowlimit={limit} />
                ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const e: Record<string, React.CSSProperties> = {
  page: {
    background: "#ffffff",
    minHeight: "100vh",
    padding: "2rem",
    boxSizing: "border-box",
    width: "100%",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titulo: {
    fontSize: "2.75rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitulo: {
    fontSize: "0.875rem",
    color: "#94a3b8",
    margin: "0.2rem 0 0",
    fontWeight: 500,
  },
  esquemasBtns: {
    display: "flex",
    gap: "0.4rem",
    flexWrap: "wrap",
  },
  esquemaBtn: {
    background: "none",
    border: "1.5px solid #e2e8f0",
    borderRadius: "999px",
    padding: "0.35rem 0.9rem",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  esquemaBtnAtivo: {
    background: "#0f172a",
    border: "1.5px solid #0f172a",
    color: "#ffffff",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "1.25rem 0",
  },
  campo: {
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "16px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  campoTitulo: {
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#94a3b8",
    margin: "0 0 0.25rem",
  },
  linhaField: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  linhaLabel: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
    width: 32,
    flexShrink: 0,
  },
  linhaCards: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  vazio: {
    fontSize: "0.8rem",
    color: "#cbd5e1",
    fontStyle: "italic",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "#ffffff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    padding: "0.35rem 0.65rem",
    boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
  },
  cardIcon: { fontSize: "0.85rem" },
  cardNome: {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#0f172a",
    whiteSpace: "nowrap",
  },
  btnBanco: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 600,
    padding: "0 0.2rem",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  btnTitular: {
    background: "none",
    border: "none",
    color: "#00c774",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 600,
    padding: "0 0.2rem",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  btnDemitir: {
    background: "none",
    border: "none",
    color: "#f87171",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 600,
    padding: "0 0.2rem",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  bancoTitulo: {
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#94a3b8",
    margin: "0 0 0.75rem",
  },
  bancoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
  },
  bancoColuna: {
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  bancoColunaLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#64748b",
    margin: "0 0 0.25rem",
  },
};