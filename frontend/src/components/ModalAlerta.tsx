import type { CSSProperties } from "react";

interface ModalAlertaProps {
  titulo?: string;
  mensagem: string;
  tipo?: "info" | "Alerta" | "sucesso" | "alerta";
  textoBotao?: string;
  onFechar: () => void;
}

export function ModalAlerta({
  titulo,
  mensagem,
  tipo,
  textoBotao = "OK",
  onFechar,
}: ModalAlertaProps) {
  const corTitulo =
    tipo === "Alerta"
      ? "#dc2626"
      : tipo === "sucesso"
      ? "#16a34a"
      : tipo === "alerta"
      ? "#f59e0b"
      : "#0f172a";

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ ...styles.titulo, color: corTitulo }}>{titulo}</h2>

        <p style={styles.mensagem}>{mensagem}</p>

        <div style={styles.botoes}>
          <button style={styles.btnOk} onClick={onFechar}>
            {textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
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
    padding: "1.5rem",
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  titulo: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    fontFamily:'"Inter", sans-serif',
  },
  mensagem: {
    fontSize: "0.95rem",
    color: "#475569",
    margin: 0,
  },
  botoes: {
    display: "flex",
    justifyContent: "center",
    marginTop: "0.5rem",
  },
  btnOk: {
    padding: "0.5rem 1.2rem",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};