
const API_URL = "http://localhost:3000";

export async function demitirJogador(clubeId: number, jogadorId: number) {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeId}/demitir/${jogadorId}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Erro na API");
  }

  return response.json();
}

export async function contratarJogador(clubeId: number, jogadorId: number) {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeId}/contratar/${jogadorId}`,
    {
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error("Erro na API");
  }

  return response.json();
}
