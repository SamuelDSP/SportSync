import { useState, useEffect } from "react";
import type { Jogador, StatusUI, TipoElenco } from "../modelos/Jogador.ts";
import { getResumoClube } from "../services/financeiro.ts";
import { listarTransacoes } from "../services/financeiro.ts";
import { CLUBE_ID } from "../App.tsx";

const IconePosicao: Record<string, string> = {
  ATACANTE: "⚔️",
  MEIO_CAMPO: "🔄",
  DEFENSOR: "🛡️",
  GOLEIRO: "🧤",
};

const PosicaoBg: Record<string, string> = {
  ATACANTE: "#ede9fe",
  MEIO_CAMPO: "#dbeafe",
  DEFENSOR: "#dcfce7",
  GOLEIRO: "#fef9c3",
};

const PosicaoCor: Record<string, string> = {
  ATACANTE: "#7c3aed",
  MEIO_CAMPO: "#1d4ed8",
  DEFENSOR: "#15803d",
  GOLEIRO: "#a16207",
};

const PosicaoLabel: Record<string, string> = {
  ATACANTE: "Atacante",
  MEIO_CAMPO: "Meio-Campo",
  DEFENSOR: "Defensor",
  GOLEIRO: "Goleiro",
};

const POSICOES = ["TODOS", "ATACANTE", "MEIO_CAMPO", "DEFENSOR", "GOLEIRO"] as const;
type FiltroPos = typeof POSICOES[number];

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatValor(valor: number) {
  if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `R$ ${(valor / 1_000).toFixed(0)}K`;
  return `R$ ${valor}`;
}

interface TelaMercadoProps {
  jogadores: Jogador[];
  onAlterar: (id: number, novoStatus: StatusUI, rowlimit: number, novotipoElenco?: TipoElenco) => void;
}

type Aba = "mercado" | "elenco" | "ordens";

function JogadorCard({
  jogador,
  modo,
  onAlterar,
}: {
  jogador: Jogador;
  modo: "mercado" | "elenco";
  onAlterar: TelaMercadoProps["onAlterar"];
}) {
  return (
    <div style={c.card}>
      <div style={c.avatar}>
        <span style={c.avatarIcon}>{IconePosicao[jogador.posicao] ?? "⚽"}</span>
      </div>

      <p style={c.cardNome}>{jogador.nome}</p>
      <p style={c.cardIdade}>{jogador.idade} anos</p>

      <span style={{
        ...c.posicaoBadge,
        background: PosicaoBg[jogador.posicao] ?? "#f1f5f9",
        color: PosicaoCor[jogador.posicao] ?? "#64748b",
      }}>
         {PosicaoLabel[jogador.posicao] ?? jogador.posicao}
      </span>

      <div style={c.cardInfoRow}>
        <span style={c.cardInfoLabel}>Preço</span>
        <span style={c.cardInfoValor}>{formatValor(jogador.valorMercado)}</span>
      </div>

      {modo === "elenco" && jogador.salarioAtual != null && (
        <div style={c.cardInfoRow}>
          <span style={c.cardInfoLabel}>💵</span>
          <span style={c.cardInfoValor}>{formatBRL(jogador.salarioAtual)}/mês</span>
        </div>
      )}

      <div style={c.cardFooter}>
        {modo === "mercado" && (
          <button
            style={c.btnContratar}
            onClick={() => onAlterar(jogador.id, "ELENCO", 0, "RESERVA")}
          >
            Contratar
          </button>
        )}
        {modo === "elenco" && (
          <button
            style={c.btnDemitir}
            onClick={() => onAlterar(jogador.id, "MERCADO", 0)}
          >
            Demitir
          </button>
        )}
      </div>
    </div>
  );
}

function MinhasOrdens() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarTransacoes()
      .then(setTransacoes)
      .catch(() => setTransacoes([]))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p style={c.muted}>Carregando ordens…</p>;
  if (transacoes.length === 0) return <p style={c.muted}>Nenhuma ordem registrada.</p>;

  return (
    <div style={c.ordensLista}>
      {transacoes.map((t: any, i: number) => {
        const isEntrada = t.tipo === "RECEITA";
        return (
          <div key={i} style={c.ordemItem}>
            <div style={{ ...c.ordemDot, background: isEntrada ? "#00c774" : "#f87171" }} />
            <div style={{ flex: 1 }}>
              <p style={c.ordemDesc}>{t.descricao ?? t.tipo ?? "Transação"}</p>
              <p style={c.ordemData}>
                {t.data ? new Date(t.data).toLocaleDateString("pt-BR") : "—"}
              </p>
            </div>
            <span style={{ ...c.ordemValor, color: isEntrada ? "#00c774" : "#f87171" }}>
              {isEntrada ? "+" : "-"}{formatBRL(Math.abs(t.valor ?? 0))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TelaMercado({ jogadores, onAlterar }: TelaMercadoProps) {
  const [aba, setAba] = useState<Aba>("mercado");
  const [busca, setBusca] = useState("");
  const [posicao, setPosicao] = useState<FiltroPos>("TODOS");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(20);

  useEffect(() => {
    getResumoClube(CLUBE_ID)
      .then((r) => setSaldo(r.clube.saldo))
      .catch(() => setSaldo(null));
  }, []);

  useEffect(() => {
    setBusca("");
    setPosicao("TODOS");
    setQuantidadeVisivel(20);
  }, [aba]);

  const mercado = jogadores.filter((j) => j.status === "MERCADO");
  const elenco  = jogadores.filter((j) => j.status === "ELENCO");

  const filtrar = (lista: Jogador[]) =>
    lista
      .filter((j) => j.nome.toLowerCase().includes(busca.toLowerCase()))
      .filter((j) => posicao === "TODOS" || j.posicao === posicao);

  const mercadoFiltrado = filtrar(mercado);
  const elencoFiltrado  = filtrar(elenco);

  return (
    <div style={c.page}>
      <div style={c.header}>
        <div>
          <h1 style={c.titulo}>Jogadores</h1>
          <p style={c.subtitulo}>Gerencie seu elenco e o mercado</p>
        </div>
        {saldo !== null && (
          <div style={c.saldoBadge}>
            <span style={c.saldoLabel}>Saldo disponível</span>
            <span style={c.saldoValor}>{formatBRL(saldo)}</span>
          </div>
        )}
      </div>

      <div style={c.divider} />

      <div style={c.abas}>
        {(["mercado", "elenco", "ordens"] as Aba[]).map((a) => (
          <button
            key={a}
            style={{ ...c.abaBtn, ...(aba === a ? c.abaBtnAtivo : {}) }}
            onClick={() => setAba(a)}
          >
            {a === "mercado" ? "Mercado" : a === "elenco" ? "Meu Elenco" : "Minhas Ordens"}
          </button>
        ))}
      </div>

      {aba !== "ordens" && (
        <div style={c.filtrosRow}>
          <input
            style={c.busca}
            type="text"
            placeholder={aba === "mercado" ? "Buscar jogador no mercado…" : "Buscar no elenco…"}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div style={c.posicoesBtns}>
            {POSICOES.map((p) => {
              const ativo = posicao === p;
              const bg = p !== "TODOS" ? PosicaoBg[p] : "#f8fafc";
              const cor = p !== "TODOS" ? PosicaoCor[p] : "#64748b";
              return (
                <button
                  key={p}
                  onClick={() => { setPosicao(p); setQuantidadeVisivel(20); }}
                  style={{
                    ...c.posicaoBtn,
                    background: ativo ? (p !== "TODOS" ? bg : "#0f172a") : "#f8fafc",
                    color: ativo ? (p !== "TODOS" ? cor : "#ffffff") : "#64748b",
                    border: ativo
                      ? `1.5px solid ${p !== "TODOS" ? cor : "#0f172a"}`
                      : "1.5px solid #e2e8f0",
                    fontWeight: ativo ? 700 : 500,
                  }}
                >
                  {p === "TODOS" ? "Todos" : `${IconePosicao[p]} ${PosicaoLabel[p]}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {aba === "mercado" && (
        <>
          <div style={c.grid}>
            {mercadoFiltrado.slice(0, quantidadeVisivel).map((j) => (
              <JogadorCard key={j.id} jogador={j} modo="mercado" onAlterar={onAlterar} />
            ))}
          </div>
          {mercadoFiltrado.length === 0 && <p style={c.muted}>Nenhum jogador encontrado.</p>}
          {quantidadeVisivel < mercadoFiltrado.length && (
            <div style={c.loadMoreRow}>
              <button style={c.btnLoad} onClick={() => setQuantidadeVisivel((q) => q + 20)}>
                Carregar mais
              </button>
            </div>
          )}
        </>
      )}

      {aba === "elenco" && (
        <>
          <div style={c.grid}>
            {elencoFiltrado.map((j) => (
              <JogadorCard key={j.id} jogador={j} modo="elenco" onAlterar={onAlterar} />
            ))}
          </div>
          {elencoFiltrado.length === 0 && <p style={c.muted}>Seu elenco está vazio.</p>}
        </>
      )}

      {aba === "ordens" && <MinhasOrdens />}
    </div>
  );
}

const c: Record<string, React.CSSProperties> = {
  page: {
    background: "#ffffff",
    minHeight: "100vh",
    padding: "2rem",
    boxSizing: "border-box",
    width: "100%",
    overflowX: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
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
  saldoBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "0.6rem 1rem",
  },
  saldoLabel: {
    fontSize: "0.9rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#94a3b8",
  },
  saldoValor: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#00c774",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    marginBottom: "1.25rem",
  },
  abas: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.25rem",
  },
  abaBtn: {
    background: "none",
    border: "1.5px solid #e2e8f0",
    borderRadius: "999px",
    padding: "0.45rem 1.1rem",
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  abaBtnAtivo: {
    background: "#0f172a",
    border: "1.5px solid #0f172a",
    color: "#ffffff",
  },
  filtrosRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  busca: {
    width: "100%",
    maxWidth: "280px",
    padding: "0.6rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "999px",
    fontSize: "0.9rem",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },
  posicoesBtns: {
    display: "flex",
    gap: "0.4rem",
    flexWrap: "wrap",
  },
  posicaoBtn: {
    borderRadius: "999px",
    padding: "0.45rem 0.85rem",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "1rem",
  },
  card: {
    background: "#ffffff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "16px",
    padding: "1.25rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.35rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
    minWidth: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.25rem",
  },
  avatarIcon: { fontSize: "1.5rem" },
  cardNome: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    textAlign: "center",
    lineHeight: 1.2,
  },
  cardIdade: {
    fontSize: "0.78rem",
    color: "#94a3b8",
    margin: 0,
    fontWeight: 500,
  },
  posicaoBadge: {
    fontSize: "0.78rem",
    fontWeight: 700,
    padding: "0.2rem 0.6rem",
    borderRadius: "999px",
    letterSpacing: "0.03em",
    margin: "0.15rem 0",
  },
  cardInfoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    width: "100%",
    justifyContent: "center",
  },
  cardInfoLabel: { fontSize: "0.8rem" },
  cardInfoValor: {
    fontSize: "0.82rem",
    color: "#475569",
    fontWeight: 600,
  },
  cardFooter: {
    marginTop: "0.5rem",
    width: "100%",
  },
  btnContratar: {
    width: "100%",
    padding: "0.5rem 0",
    background: "#00c774",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  btnDemitir: {
    width: "100%",
    padding: "0.5rem 0",
    background: "#fff1f2",
    color: "#f87171",
    border: "1.5px solid #fecaca",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  loadMoreRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
  },
  btnLoad: {
    padding: "0.6rem 2rem",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  ordensLista: {
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
  },
  ordemItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f8fafc",
  },
  ordemDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  ordemDesc: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  ordemData: {
    fontSize: "0.78rem",
    color: "#94a3b8",
    margin: "0.1rem 0 0",
  },
  ordemValor: {
    fontSize: "0.95rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  muted: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    fontWeight: 500,
    textAlign: "center",
    marginTop: "2rem",
  },
};
