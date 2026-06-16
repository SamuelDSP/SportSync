

import "../estilos/NaviBar.css"




interface NavbarProps {
  abaAtual: string;
  setAbaAtual: (aba: string) => void;
}


export function NaviBar({abaAtual,setAbaAtual}: NavbarProps){

    return(
    <>
      <nav className="navibar-buttons">
        <button className="botao-navi" onClick={() => setAbaAtual("jogadores")}>Jogadores</button>

        <button className="botao-navi" onClick={() => setAbaAtual("times")}>Times</button>

        <button className="botao-navi" onClick={() => setAbaAtual("financeiro")}>Financeiro</button>

        <button className="botao-navi" onClick={() => setAbaAtual("elenco")}>Elenco</button>
      </nav>
    </>
    )
}