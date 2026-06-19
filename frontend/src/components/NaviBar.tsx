import { useState } from "react";
import { Menu, X, Sword, Users, DollarSign, List, Home, LogOut } from "lucide-react";
import "../estilos/NaviBar.css";

interface NavbarProps {
  abaAtual: string;
  setAbaAtual: (aba: string) => void;
}

const abas = [
  { id: "jogadores", label: "Jogadores", icon: Sword },
  { id: "times",     label: "Times",     icon: Users },
  { id: "financeiro",label: "Financeiro",icon: DollarSign },
  { id: "elenco",    label: "Elenco",    icon: List },
];

export function NaviBar({ abaAtual, setAbaAtual }: NavbarProps) {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      {/* Overlay escuro no mobile quando aberta */}
      {aberta && <div className="sidebar-overlay" onClick={() => setAberta(false)} />}

      <nav className={`sidebar ${aberta ? "sidebar--aberta" : ""}`}>
        {/* Botão toggle */}
        <button className="sidebar-toggle" onClick={() => setAberta(!aberta)}>
          {aberta ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Itens de navegação */}
        <div className="sidebar-itens">
          <button
            className={`sidebar-btn ${abaAtual === "" ? "sidebar-btn--ativo" : ""}`}
            onClick={() => { setAbaAtual(""); setAberta(false); }}
            title="Home"
          >
            <Home size={20} />
            {aberta && <span>Home</span>}
          </button>

          {abas.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-btn ${abaAtual === id ? "sidebar-btn--ativo" : ""}`}
              onClick={() => { setAbaAtual(id); setAberta(false); }}
              title={label}
            >
              <Icon size={20} />
              {aberta && <span>{label}</span>}
            </button>
          ))}
        </div>

        {/* Botão sair */}
        <button className="sidebar-btn sidebar-btn--sair" title="Sair da conta">
          <LogOut size={20} />
          {aberta && <span>Sair da conta</span>}
        </button>
      </nav>
    </>
  );
}