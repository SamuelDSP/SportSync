const API_URL = "http://localhost:8080";

export async function getJogadores() {
  const response = await fetch(`${API_URL}/jogadores`);

  if (!response.ok) {
    throw new Error("Erro ao buscar jogadores");
  }

  return response.json();
}