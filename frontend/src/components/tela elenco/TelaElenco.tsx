import { PlayerCard } from "../PlayerCard"

import"../../estilos/tela-elenco.css"

import { Campo } from "./Campo";
import { Banco } from "./Banco";
import { Elenco } from "./Elenco"


export function TelaElenco() {
  return (
    <>
    <h1>Tela Elenco</h1>
    <main className="campo-elenco">
      <Campo />
    </main>
    <div className="banco">
      <Banco />
      <Elenco />
    </div>
    </>
  );
}