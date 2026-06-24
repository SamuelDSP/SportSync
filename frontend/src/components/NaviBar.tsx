import { useState } from "react";
import { Menu, X, Store, Users, DollarSign, Hospital, Home, LogOut } from "lucide-react";
import "../estilos/NaviBar.css";

interface NavbarProps {
  abaAtual: string;
  setAbaAtual: (aba: string) => void;
  onToggle?: (aberta: boolean) => void;
}

const abas = [
  { id: "jogadores",  label: "Jogadores",  icon: Store      },
  { id: "times",  label: "Dep. Médico", icon: Hospital },
  { id: "financeiro", label: "Financeiro", icon: DollarSign },
  { id: "elenco",     label: "Elenco",     icon: Users      },
];

export function NaviBar({ abaAtual, setAbaAtual, onToggle }: NavbarProps) {
  const [aberta, setAberta] = useState(false);

  function toggleSidebar() {
    const novoEstado = !aberta;
    setAberta(novoEstado);
    onToggle?.(novoEstado);
  }

  function navegarPara(aba: string) {
    setAbaAtual(aba);
    setAberta(false);
    onToggle?.(false);
  }

  return (
    <>
      {aberta && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <nav className={`sidebar ${aberta ? "sidebar--aberta" : ""}`}>

        {/* ── Topo: menu + home ── */}
        <div className="sidebar-topo">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {aberta ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            className={`sidebar-btn ${abaAtual === "" ? "sidebar-btn--ativo" : ""}`}
            onClick={() => navegarPara("")}
            title="Home"
          >
            <Home size={20} />
            {aberta && <span>Home</span>}
          </button>
        </div>

        {/* ── Centro: abas principais ── */}
        <div className="sidebar-centro">
          {abas.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-btn ${abaAtual === id ? "sidebar-btn--ativo" : ""}`}
              onClick={() => navegarPara(id)}
              title={label}
            >
              <Icon size={20} />
              {aberta && <span>{label}</span>}
            </button>
          ))}
        </div>

        {/* ── Rodapé: sair ── */}
        <div className="sidebar-rodape">
          <button className="sidebar-btn sidebar-btn--sair" title="Sair da conta">
            <LogOut size={20} />
            {aberta && <span>Sair da conta</span>}
          </button>
        </div>

      </nav>
    </>
  );
}