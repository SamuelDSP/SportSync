const API_URL = "http://localhost:3000";


export async function getJogadoresMercado() {
  const response = await fetch(`${API_URL}/financeiro/jogadores/mercado`);

  if (!response.ok) {
    throw new Error("Erro na API");
  }

  return response.json();
}

export async function getJogadoresElenco(clubeId: number) {
  const response = await fetch(
    `${API_URL}/financeiro/clubes/${clubeId}/elenco`
  );

  if (!response.ok) {
    throw new Error("Erro na API");
  }

  return response.json();

}

