import { useEffect, useState } from "react";
import { getElencoClube, registrarLesao, recuperarJogador } from "../services/financeiro";
import { CLUBE_ID } from "../App";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface Jogador {
  id: number;
  nome: string;
  posicao: string;
  idade: number;
  salarioAtual?: number;
  lesionado?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const COR_POSICAO: Record<string, { bg: string; cor: string }> = {
  GOL: { bg: "#fef9c3", cor: "#854d0e" },
  ZAG: { bg: "#dbeafe", cor: "#1e40af" },
  LAT: { bg: "#ede9fe", cor: "#6d28d9" },
  VOL: { bg: "#dcfce7", cor: "#166534" },
  MEI: { bg: "#ffedd5", cor: "#9a3412" },
  ATA: { bg: "#fee2e2", cor: "#991b1b" },
};

function BadgePosicao({ posicao }: { posicao: string }) {
  const chave = posicao?.toUpperCase().slice(0, 3) as keyof typeof COR_POSICAO;
  const cores = COR_POSICAO[chave] ?? { bg: "#f1f5f9", cor: "#475569" };
  return (
    <span
      style={{
        background: cores.bg,
        color: cores.cor,
        borderRadius: "6px",
        padding: "0.15rem 0.55rem",
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {posicao}
    </span>
  );
}

// ── KPI Card (igual à TelaFinanceiro) ─────────────────────────────────────────
function KpiCard({
  label,
  valor,
  cor,
  accent,
  icon,
}: {
  label: string;
  valor: string;
  cor: string;
  accent?: boolean;
  icon?: string;
}) {
  return (
    <div style={{ ...s.kpiCard, ...(accent ? { borderTop: `3px solid ${cor}` } : {}) }}>
      <div style={s.kpiTop}>
        <span style={s.kpiLabel}>{label}</span>
        {icon && <span style={{ fontSize: "1.1rem", color: cor }}>{icon}</span>}
      </div>
      <p style={{ ...s.kpiValor, color: cor }}>{valor}</p>
    </div>
  );
}

// ── Card de jogador ───────────────────────────────────────────────────────────
function CardJogador({
  jogador,
  onToggle,
  carregando,
}: {
  jogador: Jogador;
  onToggle: (j: Jogador) => void;
  carregando: boolean;
}) {
  const lesionado = jogador.lesionado;

  return (
    <div
      style={{
        ...s.card,
        borderLeft: `4px solid ${lesionado ? "#f87171" : "#e2e8f0"}`,
        opacity: carregando ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Avatar + info */}
      <div style={s.cardTop}>
        <div
          style={{
            ...s.avatar,
            background: lesionado ? "#fee2e2" : "#f0fdf4",
            color: lesionado ? "#f87171" : "#00c774",
          }}
        >
          {jogador.nome.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={s.cardNomeRow}>
            <p style={s.cardNome}>{jogador.nome}</p>
            {lesionado && (
              <span style={s.tagLesionado}>🩹 Lesionado</span>
            )}
          </div>
          <div style={s.cardMeta}>
            <BadgePosicao posicao={jogador.posicao} />
            <span style={s.metaItem}>·</span>
            <span style={s.metaItem}>{jogador.idade} anos</span>
            <span style={s.metaItem}>·</span>
            {jogador.salarioAtual != null && (
              <span style={s.metaItem}>{formatBRL(jogador.salarioAtual)}/mês</span>
            )}
          </div>
        </div>

        {/* Botão de ação */}
        <button
          onClick={() => onToggle(jogador)}
          disabled={carregando}
          style={{
            ...s.btn,
            background: lesionado ? "#f0fdf4" : "#fff1f2",
            color: lesionado ? "#00c774" : "#f87171",
            border: `1.5px solid ${lesionado ? "#bbf7d0" : "#fecaca"}`,
            cursor: carregando ? "not-allowed" : "pointer",
          }}
        >
          {lesionado ? "✓ Recuperar" : "⚠ Lesionar"}
        </button>
      </div>

      {/* Barra de status */}
      <div style={s.statusBar}>
        <span
          style={{
            ...s.statusDot,
            background: lesionado ? "#f87171" : "#00c774",
          }}
        />
        <span style={{ ...s.statusTexto, color: lesionado ? "#f87171" : "#00c774" }}>
          {lesionado ? "Fora de combate" : "Disponível"}
        </span>
      </div>
    </div>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────
export function TelaDepMed() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "saudaveis" | "lesionados">("todos");

  useEffect(() => {
    getElencoClube(CLUBE_ID)
      .then(setJogadores)
      .catch(() => setErro("Não foi possível carregar o elenco."))
      .finally(() => setCarregando(false));
  }, []);

  async function handleToggle(jogador: Jogador) {
    setLoadingId(jogador.id);
    try {
      if (jogador.lesionado) {
        await recuperarJogador(jogador.id);
      } else {
        await registrarLesao(jogador.id);
      }
      // Atualiza estado local sem re-fetch
      setJogadores((prev) =>
        prev.map((j) =>
          j.id === jogador.id ? { ...j, lesionado: !j.lesionado } : j
        )
      );
    } catch {
      setErro(`Erro ao atualizar status de ${jogador.nome}. Verifica o console.`);
      setTimeout(() => setErro(null), 4000);
    } finally {
      setLoadingId(null);
    }
  }

  const lesionados = jogadores.filter((j) => j.lesionado);
  const saudaveis = jogadores.filter((j) => !j.lesionado);

  const jogadoresFiltrados =
    filtro === "lesionados"
      ? lesionados
      : filtro === "saudaveis"
      ? saudaveis
      : jogadores;

  if (carregando) return <p style={{ padding: "2rem", color: "#64748b" }}>Carregando…</p>;

  return (
    <div style={s.page}>
      {/* ── Toast de erro ── */}
      {erro && (
        <div style={s.toast}>
          ⚠️ {erro}
          <button onClick={() => setErro(null)} style={s.toastClose}>✕</button>
        </div>
      )}
      {/* ── Cabeçalho ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Departamento Médico</h1>
        </div>
        <span style={s.badge}>Gestão de Lesões</span>
      </div>

      <div style={s.divider} />

      {/* ── KPIs ── */}
      <div style={s.gridKpi}>
        <KpiCard
          label="Total no Elenco"
          valor={String(jogadores.length)}
          cor="#0f172a"
          accent
        />
        <KpiCard
          label="Disponíveis"
          valor={String(saudaveis.length)}
          cor="#00c774"
          icon="✓"
        />
        <KpiCard
          label="Lesionados"
          valor={String(lesionados.length)}
          cor="#f87171"
          icon="🩹"
        />
        <KpiCard
          label="% Disponível"
          valor={
            jogadores.length > 0
              ? `${Math.round((saudaveis.length / jogadores.length) * 100)}%`
              : "—"
          }
          cor={
            jogadores.length > 0 && saudaveis.length / jogadores.length < 0.7
              ? "#f87171"
              : "#00c774"
          }
        />
      </div>

      {/* ── Filtros ── */}
      <div style={s.filtrosRow}>
        {(["todos", "saudaveis", "lesionados"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              ...s.filtroBtn,
              background: filtro === f ? "#0f172a" : "#f8fafc",
              color: filtro === f ? "#ffffff" : "#64748b",
              border: `1.5px solid ${filtro === f ? "#0f172a" : "#e2e8f0"}`,
            }}
          >
            {f === "todos" ? "Todos" : f === "saudaveis" ? "✓ Disponíveis" : "🩹 Lesionados"}
          </button>
        ))}
        <span style={s.filtroCount}>
          {jogadoresFiltrados.length} jogador{jogadoresFiltrados.length !== 1 ? "es" : ""}
        </span>
      </div>

      {/* ── Lista de jogadores ── */}
      {jogadoresFiltrados.length === 0 ? (
        <div style={s.vazio}>
          <span style={{ fontSize: "2rem" }}>
            {filtro === "lesionados" ? "🎉" : "📋"}
          </span>
          <p style={s.vazioTexto}>
            {filtro === "lesionados"
              ? "Nenhum jogador lesionado!"
              : "Nenhum jogador encontrado."}
          </p>
        </div>
      ) : (
        <div style={s.listaJogadores}>
          {jogadoresFiltrados.map((jogador) => (
            <CardJogador
              key={jogador.id}
              jogador={jogador}
              onToggle={handleToggle}
              carregando={loadingId === jogador.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
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
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  badge: {
    background: "#fff1f2",
    color: "#f87171",
    border: "1px solid #fecaca",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: 600,
    padding: "0.3rem 0.85rem",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    marginBottom: "1.75rem",
  },
  gridKpi: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  kpiCard: {
    background: "#ffffff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1.1rem 1.25rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
    minWidth: 0,
  },
  kpiTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  kpiLabel: {
    fontSize: "0.92rem",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#94a3b8",
    fontWeight: 600,
  },
  kpiValor: {
    fontSize: "1.55rem",
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  filtrosRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "1.25rem",
    flexWrap: "wrap",
  },
  filtroBtn: {
    borderRadius: "8px",
    padding: "0.4rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  filtroCount: {
    marginLeft: "auto",
    fontSize: "0.9rem",
    color: "#94a3b8",
    fontWeight: 500,
  },
  listaJogadores: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  card: {
    background: "#ffffff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1rem 1.25rem",
    boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
    minWidth: 0,
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: 800,
    flexShrink: 0,
  },
  cardNomeRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "0.3rem",
  },
  cardNome: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  tagLesionado: {
    background: "#fee2e2",
    color: "#f87171",
    borderRadius: "6px",
    padding: "0.1rem 0.45rem",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    flexWrap: "wrap",
  },
  metaItem: {
    fontSize: "0.875rem",
    color: "#64748b",
    fontWeight: 500,
  },
  btn: {
    borderRadius: "8px",
    padding: "0.45rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    flexShrink: 0,
    transition: "all 0.15s",
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    marginTop: "0.75rem",
    paddingTop: "0.6rem",
    borderTop: "1px solid #f8fafc",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusTexto: {
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  vazio: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    gap: "0.75rem",
    background: "#f8fafc",
    borderRadius: "14px",
    border: "1.5px dashed #e2e8f0",
  },
  vazioTexto: {
    fontSize: "1rem",
    color: "#94a3b8",
    fontWeight: 500,
    margin: 0,
  },
  toast: {
    position: "fixed",
    top: "1.25rem",
    right: "1.25rem",
    zIndex: 9999,
    background: "#fff1f2",
    border: "1.5px solid #fecaca",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    color: "#dc2626",
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  toastClose: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 700,
    padding: 0,
    lineHeight: 1,
  },
};
