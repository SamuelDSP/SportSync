import { useState } from "react";
import type { Jogador } from "../modelos/Jogador";

interface ModalContratacaoProps {
  jogador: Jogador;
  onConfirmar: (salarioAceito: number) => void;
  onCancelar: () => void;
}

export function ModalContratacao({
  jogador,
  onConfirmar,
  onCancelar,
}: ModalContratacaoProps) {
  const [salario, setSalario] = useState<string>("");
  const [erro, setErro] = useState<string>("");

  function handleConfirmar() {
    const valor = Number(salario);
    if (!salario || isNaN(valor) || valor <= 0) {
      setErro("Informe um salário válido.");
      return;
    }
    setErro("");
    onConfirmar(valor);
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.titulo}>Contratar Jogador</h2>

        <p style={styles.nome}>{jogador.nome}</p>
        <p style={styles.info}>
          Posição: <strong>{jogador.posicao}</strong>
        </p>
        <p style={styles.info}>
          Valor de mercado:{" "}
          <strong>R$ {jogador.valorMercado.toLocaleString("pt-BR")}</strong>
        </p>
        {jogador.salarioMinimo != null && (
          <p style={styles.info}>
            Salário mínimo aceito:{" "}
            <strong>R$ {jogador.salarioMinimo.toLocaleString("pt-BR")}</strong>
          </p>
        )}
        {jogador.salarioDesejado != null && (
          <p style={styles.info}>
            Salário desejado:{" "}
            <strong>
              R$ {jogador.salarioDesejado.toLocaleString("pt-BR")}
            </strong>
          </p>
        )}

        <label style={styles.label} htmlFor="salario-input">
          Salário oferecido (R$)
        </label>
        <input
          id="salario-input"
          type="number"
          min={0}
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          style={styles.input}
          placeholder="Ex: 50000"
        />

        {erro && <p style={styles.erro}>{erro}</p>}

        <div style={styles.botoes}>
          <button style={styles.btnCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button style={styles.btnConfirmar} onClick={handleConfirmar}>
            Confirmar contratação
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  },
  titulo: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  nome: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#1e3a5f",
    margin: "0.25rem 0 0",
  },
  info: {
    margin: "0.1rem 0",
    fontSize: "0.9rem",
    color: "#475569",
  },
  label: {
    marginTop: "0.75rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#0f172a",
  },
  input: {
    padding: "0.6rem 0.75rem",
    borderRadius: "8px",
    border: "1.5px solid #cbd5e1",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  erro: {
    color: "#dc2626",
    fontSize: "0.85rem",
    margin: 0,
  },
  botoes: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1rem",
    justifyContent: "flex-end",
  },
  btnCancelar: {
    padding: "0.5rem 1.1rem",
    borderRadius: "8px",
    border: "1.5px solid #cbd5e1",
    background: "transparent",
    color: "#475569",
    cursor: "pointer",
    fontWeight: 500,
  },
  btnConfirmar: {
    padding: "0.5rem 1.1rem",
    borderRadius: "8px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};
