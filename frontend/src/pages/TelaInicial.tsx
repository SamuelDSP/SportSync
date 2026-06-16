import escudo from "../assets/logoinicial.png";
import "../estilos/tela-inicial.css";


export function TelaInicial(){
    return(
        <div className="tela-inicio">
            <img src={escudo} alt="logo sportsync" />
        </div>
    )
}




