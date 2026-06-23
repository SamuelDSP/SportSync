import { useEffect, useState } from "react";
import { getResumoClube, listarTransacoes, criarTransacao } from "../services/financeiro";
import type { ResumoClube } from "../modelos/financeiro";

interface TelaFinanceiroProps {
  clubeId: number;
}

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Gráfico de rosca SVG ──────────────────────────────────────────────────────
function GraficoRosca({ receitas, despesas }: { receitas: number; despesas: number }) {
  const total = receitas + despesas || 1;
  const pctReceitas = receitas / total;
  const r = 54;
  const circunferencia = 2 * Math.PI * r;
  const dashReceitas = pctReceitas * circunferencia;
  const dashDespesas = circunferencia - dashReceitas;

  return (
    <div style={s.roscaWrap}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={r} fill="none" stroke="#e2e8f0" strokeWidth={16} />
        <circle cx={70} cy={70} r={r} fill="none" stroke="#00c774" strokeWidth={16}
          strokeDasharray={`${dashReceitas} ${dashDespesas}`}
          strokeDashoffset={circunferencia * 0.25} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <circle cx={70} cy={70} r={r} fill="none" stroke="#f87171" strokeWidth={16}
          strokeDasharray={`${dashDespesas} ${dashReceitas}`}
          strokeDashoffset={circunferencia * 0.25 - dashReceitas} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <text x={70} y={65} textAnchor="middle" fontSize={11} fill="#64748b" fontWeight={500}>Receitas</text>
        <text x={70} y={82} textAnchor="middle" fontSize={13} fill="#0f172a" fontWeight={700}>
          {Math.round(pctReceitas * 100)}%
        </text>
      </svg>
      <div style={s.roscaLegenda}>
        <span style={{ ...s.dot, background: "#00c774" }} /> Receitas
        <span style={{ ...s.dot, background: "#f87171", marginLeft: 12 }} /> Despesas
      </div>
    </div>
  );
}

// ── Modal Adicionar Receita ───────────────────────────────────────────────────
function ModalAdicionarReceita({ clubeId, onFechar, onSucesso }: {
  clubeId: number;
  onFechar: () => void;
  onSucesso: () => void;
}) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleConfirmar() {
    if (!descricao.trim() || descricao.trim().length < 3) {
      setErro("Descrição precisa ter pelo menos 3 caracteres.");
      return;
    }
    const valorNum = parseFloat(valor.replace(",", "."));
    if (!valorNum || valorNum <= 0) {
      setErro("Valor precisa ser maior que zero.");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      await criarTransacao({
        descricao: descricao.trim(),
        valor: valorNum,
        tipo: "RECEITA",
        clubeId,
      });
      onSucesso();
      onFechar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar receita.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div style={s.modalOverlay} onClick={onFechar}>
      <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <p style={s.modalTitulo}>Adicionar Receita</p>
          <button style={s.modalFechar} onClick={onFechar}>✕</button>
        </div>
        <div style={s.modalCampo}>
          <label style={s.modalLabel}>Descrição *</label>
          <input style={s.modalInput} placeholder="Ex: Patrocínio, bilheteria..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div style={s.modalCampo}>
          <label style={s.modalLabel}>Valor (R$) *</label>
          <input style={s.modalInput} type="number" min="0" placeholder="Ex: 50000" value={valor} onChange={(e) => setValor(e.target.value)} />
        </div>
        <div style={s.modalCampo}>
          <label style={s.modalLabel}>Categoria</label>
          <input style={s.modalInput} placeholder="Ex: Patrocínio, Bilheteria..." value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </div>
        <div style={s.modalCampo}>
          <label style={s.modalLabel}>Data</label>
          <input style={s.modalInput} type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        {erro && <p style={s.modalErro}>{erro}</p>}
        <div style={s.modalRodape}>
          <button style={s.btnCancelar} onClick={onFechar} disabled={salvando}>Cancelar</button>
          <button style={s.btnConfirmar} onClick={handleConfirmar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Lista de transações ───────────────────────────────────────────────────────
function ListaTransacoes({
  clubeId,
  refresh,
}: {
  clubeId: number;
  refresh: number;
}) {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    listarTransacoes(clubeId)
      .then(setTransacoes)
      .catch(() => setTransacoes([]))
      .finally(() => setCarregando(false));
  }, [clubeId, refresh]);

  if (carregando) return <p style={s.muted}>Carregando transações…</p>;
  if (transacoes.length === 0) return <p style={s.muted}>Nenhuma transação registrada.</p>;

  return (
    <div style={s.transacoesLista}>
      {transacoes.slice(0, 8).map((t: any, i: number) => {
        const isEntrada = t.tipo === "RECEITA";
        return (
          <div key={i} style={s.transacaoItem}>
            <div style={{ ...s.transacaoDot, background: isEntrada ? "#00c774" : "#f87171" }} />
            <div style={{ flex: 1 }}>
              <p style={s.transacaoDesc}>{t.descricao ?? t.tipo ?? "Transação"}</p>
              <p style={s.transacaoData}>{t.data ? new Date(t.data).toLocaleDateString("pt-BR") : "—"}</p>
            </div>
            <span style={{ ...s.transacaoValor, color: isEntrada ? "#00c774" : "#f87171" }}>
              {isEntrada ? "+" : "-"}{formatBRL(Math.abs(t.valor ?? 0))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────
export function TelaFinanceiro({ clubeId }: TelaFinanceiroProps) {
  const [resumo, setResumo] = useState<ResumoClube | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [refreshTransacoes, setRefreshTransacoes] = useState(0);

  function carregarResumo() {
    getResumoClube(clubeId)
      .then(setResumo)
      .catch(() => setErro("Não foi possível carregar os dados financeiros."));
  }

  useEffect(() => { carregarResumo(); }, [clubeId]);

  function handleSucesso() {
    setRefreshTransacoes((n) => n + 1);
    carregarResumo();
  }

  if (erro) return <p style={{ padding: "2rem", color: "#dc2626" }}>{erro}</p>;
  if (!resumo) return <p style={{ padding: "2rem", color: "#64748b" }}>Carregando…</p>;

  const { clube } = resumo;
  const usoLimite = clube.limiteDespesaMensal > 0
    ? (clube.despesaMensalAtual / clube.limiteDespesaMensal) * 100
    : 0;
  const corBarra = usoLimite >= 90 ? "#f87171" : usoLimite >= 70 ? "#f59e0b" : "#00c774";
  const saldoPositivo = clube.saldo >= 0;

  return (
    <div style={s.page}>
      {modalAberto && (
        <ModalAdicionarReceita
          clubeId={clubeId}
          onFechar={() => setModalAberto(false)}
          onSucesso={handleSucesso}
        />
      )}

      {/* ── Cabeçalho ── */}
      <div style={s.header}>
        <h1 style={s.titulo}>Financeiro</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button style={s.btnReceita} onClick={() => setModalAberto(true)}>+ Adicionar Receita</button>
          <span style={s.badge}>Visão Geral</span>
        </div>
      </div>

      <div style={s.divider} />

      {/* ── KPI Cards ── */}
      <div style={s.gridKpi}>
        <KpiCard label="Saldo Atual" valor={formatBRL(clube.saldo)} cor={saldoPositivo ? "#00c774" : "#f87171"} accent />
        <KpiCard label="Receitas" valor={formatBRL(resumo.receitas)} cor="#00c774" icon="↑" />
        <KpiCard label="Despesas" valor={formatBRL(resumo.despesas)} cor="#f87171" icon="↓" />
        <KpiCard label="Transações" valor={String(resumo.quantidadeTransacoes)} cor="#1e3a5f" />
      </div>

      {/* ── Gráfico + Cards secundários ── */}
      <div style={s.gridSecundario}>
        <div style={s.card}>
          <p style={s.cardTitulo}>Receitas vs Despesas</p>
          <GraficoRosca receitas={resumo.receitas} despesas={resumo.despesas} />
          <div style={s.roscaValores}>
            <div>
              <p style={s.roscaLabel}>Receitas</p>
              <p style={{ ...s.roscaNum, color: "#00c774" }}>{formatBRL(resumo.receitas)}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={s.roscaLabel}>Despesas</p>
              <p style={{ ...s.roscaNum, color: "#f87171" }}>{formatBRL(resumo.despesas)}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={s.card}>
            <p style={s.cardTitulo}>Limite de Despesa Mensal</p>
            <div style={s.limiteRow}>
              <span style={s.limiteValorAtual}>{formatBRL(clube.despesaMensalAtual)}</span>
              <span style={s.limiteSep}>/</span>
              <span style={s.limiteMax}>{formatBRL(clube.limiteDespesaMensal)}</span>
            </div>
            <div style={s.barraFundo}>
              <div style={{ ...s.barraFill, width: `${Math.min(usoLimite, 100)}%`, background: corBarra }} />
            </div>
            <div style={s.limiteFooter}>
              <span style={s.muted}>Uso: {usoLimite.toFixed(1)}%</span>
              <span style={{ ...s.muted, color: corBarra }}>Margem: {formatBRL(clube.margemDespesaMensal)}</span>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitulo}>Conferência de Saldo</p>
            <div style={s.conferRow}>
              <div>
                <p style={s.muted}>Saldo registrado</p>
                <p style={s.confVal}>{formatBRL(clube.saldo)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={s.muted}>Calculado por transações</p>
                <p style={s.confVal}>{formatBRL(resumo.saldoCalculadoPorTransacoes)}</p>
              </div>
            </div>
            {resumo.saldoCalculadoPorTransacoes !== clube.saldo ? (
              <div style={s.alertaWrap}>
                <span style={s.alertaIcon}>⚠️</span>
                <span style={s.alertaTexto}>Divergência detectada entre saldo registrado e calculado.</span>
              </div>
            ) : (
              <div style={{ ...s.alertaWrap, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <span style={s.alertaIcon}>✅</span>
                <span style={{ ...s.alertaTexto, color: "#166534" }}>Saldo conferido e consistente.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Transações recentes ── */}
      <div style={{ ...s.card, marginTop: "1rem" }}>
        <p style={s.cardTitulo}>Transações Recentes</p>
        <ListaTransacoes clubeId={clubeId} refresh={refreshTransacoes} />
      </div>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, valor, cor, accent, icon }: {
  label: string; valor: string; cor: string; accent?: boolean; icon?: string;
}) {
  return (
    <div style={{ ...s.kpiCard, ...(accent ? { borderTop: `3px solid ${cor}` } : {}) }}>
      <div style={s.kpiTop}>
        <span style={s.kpiLabel}>{label}</span>
        {icon && <span style={{ fontSize: "1rem", color: cor }}>{icon}</span>}
      </div>
      <p style={{ ...s.kpiValor, color: cor }}>{valor}</p>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: { background: "#ffffff", minHeight: "100vh", padding: "2rem", boxSizing: "border-box", width: "100%", overflowX: "hidden", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" },
  titulo: { fontSize: "2.75rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  nomeClube: { fontSize: "0.875rem", color: "#94a3b8", margin: "0.2rem 0 0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" },
  badge: { background: "#f0fdf4", color: "#00c774", border: "1px solid #bbf7d0", borderRadius: "999px", fontSize: "0.95rem", fontWeight: 600, padding: "0.3rem 0.85rem", letterSpacing: "0.04em", whiteSpace: "nowrap" },
  btnReceita: { background: "#00c774", color: "#ffffff", border: "none", borderRadius: "999px", fontSize: "0.95rem", fontWeight: 600, padding: "0.3rem 1rem", cursor: "pointer", whiteSpace: "nowrap" },
  divider: { height: "1px", background: "#f1f5f9", marginBottom: "1.75rem" },
  gridKpi: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" },
  kpiCard: { background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "1.1rem 1.25rem", boxShadow: "0 1px 4px rgba(15,23,42,0.04)", minWidth: 0 },
  kpiTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" },
  kpiLabel: { fontSize: "0.92rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", fontWeight: 600 },
  kpiValor: { fontSize: "1.55rem", fontWeight: 800, margin: 0, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  gridSecundario: { display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1rem" },
  card: { background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem 1.4rem", boxShadow: "0 1px 4px rgba(15,23,42,0.04)", minWidth: 0 },
  cardTitulo: { fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 1rem" },
  roscaWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" },
  roscaLegenda: { fontSize: "0.98rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" },
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: "50%" },
  roscaValores: { display: "flex", justifyContent: "space-between", marginTop: "1rem", padding: "0.75rem 0 0", borderTop: "1px solid #f1f5f9" },
  roscaLabel: { fontSize: "0.95rem", color: "#94a3b8", margin: "0 0 0.15rem", fontWeight: 600 },
  roscaNum: { fontSize: "1.2rem", fontWeight: 700, margin: 0 },
  limiteRow: { display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.75rem", flexWrap: "wrap" },
  limiteValorAtual: { fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" },
  limiteSep: { color: "#cbd5e1", fontSize: "1.3rem" },
  limiteMax: { fontSize: "1.1rem", color: "#94a3b8", fontWeight: 500 },
  barraFundo: { height: "7px", borderRadius: "999px", background: "#f1f5f9", overflow: "hidden", marginBottom: "0.5rem" },
  barraFill: { height: "100%", borderRadius: "999px", transition: "width 0.5s ease" },
  limiteFooter: { display: "flex", justifyContent: "space-between", fontSize: "0.98rem", fontWeight: 600, flexWrap: "wrap", gap: "0.25rem" },
  conferRow: { display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" },
  confVal: { fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: "0.2rem 0 0" },
  alertaWrap: { display: "flex", alignItems: "center", gap: "0.5rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.6rem 0.85rem" },
  alertaIcon: { fontSize: "1.1rem", flexShrink: 0 },
  alertaTexto: { fontSize: "1.0rem", color: "#92400e", fontWeight: 500 },
  transacoesLista: { display: "flex", flexDirection: "column", gap: "0.1rem" },
  transacaoItem: { display: "flex", alignItems: "center", gap: "1.05rem", padding: "0.65rem 0", borderBottom: "1px solid #f8fafc" },
  transacaoDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  transacaoDesc: { fontSize: "1.075rem", fontWeight: 600, color: "#0f172a", margin: 0 },
  transacaoData: { fontSize: "0.95rem", color: "#94a3b8", margin: "0.1rem 0 0" },
  transacaoValor: { fontSize: "1.1rem", fontWeight: 700, whiteSpace: "nowrap" },
  muted: { fontSize: "0.98rem", color: "#94a3b8", margin: 0, fontWeight: 500 },
  // Modal
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox: { background: "#ffffff", borderRadius: "16px", padding: "1.75rem", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(15,23,42,0.16)", display: "flex", flexDirection: "column", gap: "1rem" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitulo: { fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: 0 },
  modalFechar: { background: "none", border: "none", fontSize: "1.1rem", color: "#94a3b8", cursor: "pointer", padding: "0.25rem" },
  modalCampo: { display: "flex", flexDirection: "column", gap: "0.35rem" },
  modalLabel: { fontSize: "0.85rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" },
  modalInput: { border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "0.6rem 0.85rem", fontSize: "1rem", color: "#0f172a", outline: "none", width: "100%", boxSizing: "border-box" },
  modalErro: { fontSize: "0.9rem", color: "#dc2626", margin: 0, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.5rem 0.75rem" },
  modalRodape: { display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.25rem" },
  btnCancelar: { background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", padding: "0.6rem 1.25rem", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" },
  btnConfirmar: { background: "#00c774", color: "#ffffff", border: "none", borderRadius: "8px", padding: "0.6rem 1.25rem", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" },
};
