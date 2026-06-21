import { API_URL } from "./api";
import type { ResumoClube } from "../modelos/financeiro";
 
export async function getResumoClube(clubeId: number): Promise<ResumoClube> {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeId}/resumo`,
  );
 
  if (!response.ok) {
    throw new Error("Erro ao buscar resumo do clube");
  }
 
  return response.json();
}
 