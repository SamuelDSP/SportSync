import { useEffect, useState } from "react";
import { getResumoClube } from "../services/financeiro";
import type { ResumoClube } from "../modelos/financeiro";

interface TelaFinanceiroProps {
  clubeId: number;
}

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function TelaFinanceiro({ clubeId }: TelaFinanceiroProps) {
  const [resumo, setResumo] = useState<ResumoClube | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getResumoClube(clubeId);
        setResumo(data);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os dados financeiros.");
      }
    }
    load();
  }, [clubeId]);

  if (erro) return <p style={{ padding: "2rem", color: "#dc2626" }}>{erro}</p>;
  if (!resumo) return <p style={{ padding: "2rem" }}>Carregando...</p>;

  const { clube } = resumo;
  const usoLimite = clube.limiteDespesaMensal > 0
    ? (clube.despesaMensalAtual / clube.limiteDespesaMensal) * 100
    : 0;

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Financeiro</h1>
      <p style={styles.nomeClube}>{clube.nome}</p>

      {/* Cards principais */}
      <div style={styles.grid}>
        <Card label="Saldo atual" valor={formatBRL(clube.saldo)} destaque />
        <Card label="Receitas" valor={formatBRL(resumo.receitas)} cor="#16a34a" />
        <Card label="Despesas" valor={formatBRL(resumo.despesas)} cor="#dc2626" />
        <Card label="Transações" valor={String(resumo.quantidadeTransacoes)} />
      </div>

      {/* Limite mensal */}
      <div style={styles.secao}>
        <h2 style={styles.subtitulo}>Limite de despesa mensal</h2>
        <div style={styles.limiteRow}>
          <span style={styles.limiteValor}>{formatBRL(clube.despesaMensalAtual)}</span>
          <span style={styles.limiteSep}>/</span>
          <span style={styles.limiteMax}>{formatBRL(clube.limiteDespesaMensal)}</span>
        </div>
        <div style={styles.barraFundo}>
          <div
            style={{
              ...styles.barraPreenchimento,
              width: `${Math.min(usoLimite, 100)}%`,
              background: usoLimite >= 90 ? "#dc2626" : usoLimite >= 70 ? "#f59e0b" : "#16a34a",
            }}
          />
        </div>
        <p style={styles.margemTexto}>
          Margem disponível:{" "}
          <strong>{formatBRL(clube.margemDespesaMensal)}</strong>
        </p>
      </div>

      {/* Conferência */}
      <div style={styles.secao}>
        <h2 style={styles.subtitulo}>Conferência</h2>
        <p style={styles.infoTexto}>
          Saldo calculado por transações:{" "}
          <strong>{formatBRL(resumo.saldoCalculadoPorTransacoes)}</strong>
        </p>
        {resumo.saldoCalculadoPorTransacoes !== clube.saldo && (
          <p style={{ color: "#f59e0b", fontSize: "0.85rem" }}>
            ⚠️ Divergência entre saldo registrado e calculado por transações.
          </p>
        )}
      </div>
    </div>
  );
}

// Sub-componente de card
function Card({
  label,
  valor,
  destaque,
  cor,
}: {
  label: string;
  valor: string;
  destaque?: boolean;
  cor?: string;
}) {
  return (
    <div style={{ ...styles.card, ...(destaque ? styles.cardDestaque : {}) }}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={{ ...styles.cardValor, color: cor ?? (destaque ? "#fff" : "#0f172a") }}>
        {valor}
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "inherit",
  },
  titulo: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  nomeClube: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: "0.25rem",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
  },
  cardDestaque: {
    background: "#0f172a",
    border: "none",
  },
  cardLabel: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#94a3b8",
    margin: "0 0 0.4rem",
  },
  cardValor: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: 0,
  },
  secao: {
    marginBottom: "1.75rem",
  },
  subtitulo: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "0.5rem",
  },
  limiteRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.4rem",
    marginBottom: "0.5rem",
  },
  limiteValor: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  limiteSep: {
    color: "#94a3b8",
  },
  limiteMax: {
    fontSize: "0.95rem",
    color: "#64748b",
  },
  barraFundo: {
    height: "8px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
    marginBottom: "0.5rem",
  },
  barraPreenchimento: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },
  margemTexto: {
    fontSize: "0.875rem",
    color: "#475569",
    margin: 0,
  },
  infoTexto: {
    fontSize: "0.9rem",
    color: "#475569",
    margin: 0,
  },
};
