import { API_URL } from "./api";
import {clubeID} from "./api";
  
export async function contratarJogador(
  jogadorId: number,
  salarioAceito: number,
) {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeID}/contratar/${jogadorId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ salarioAceito }),
    },
  );
 
  if (!response.ok) {
    // Tenta pegar a mensagem de erro do backend (ex: "Salário abaixo do mínimo")
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.message ?? "Erro ao contratar jogador");
  }
 
  return response.json();
}
 
export async function demitirJogador( jogadorId: number) {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeID}/demitir/${jogadorId}`,
    {
      method: "POST",
    },
  );
 
  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.message ?? "Erro ao demitir jogador");
  }
 
  return response.json();
}