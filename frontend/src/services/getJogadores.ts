import { API_URL } from "./api";
import { clubeID } from "./api";
 
export async function getJogadoresMercado() {
  const response = await fetch(`${API_URL}/financeiro/jogadores/mercado`);
 
  if (!response.ok) {
    throw new Error("Erro ao buscar jogadores do mercado");
  }
 
  return response.json();
}
 
export async function getJogadoresElenco() {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeID}/elenco`,
  );
 
  if (!response.ok) {
    throw new Error("Erro ao buscar elenco do clube");
  }
 
  return response.json();
}
 
