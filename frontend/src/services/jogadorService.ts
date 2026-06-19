

const API_URL = "http://localhost:8080";


export async function atualizarStatus(
  id: number,
  status: string
) {
  const response = await fetch(
    `${API_URL}/jogadores/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  return response.json();
}