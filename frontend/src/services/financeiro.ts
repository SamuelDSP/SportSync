import { API_URL } from "./api";
import type { ResumoClube } from "../modelos/financeiro";

export async function getResumoClube(clubeId: number): Promise<ResumoClube> {
  const response = await fetch(`${API_URL}/financeiro/clubes/${clubeId}/resumo`);
  if (!response.ok) throw new Error("Erro ao buscar resumo do clube");
  return response.json();
}

export async function listarTransacoes(): Promise<any[]> {
  const response = await fetch(`${API_URL}/financeiro/transacoes`);
  if (!response.ok) throw new Error("Erro ao listar transações");
  return response.json();
}

export async function criarTransacao(dados: {
  descricao: string;
  valor: number;
  tipo: string;
  clubeId: number;
}): Promise<any> {
  const response = await fetch(`${API_URL}/financeiro/transacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error("Erro ao criar transação");
  return response.json();
}

export async function deletarTransacao(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/financeiro/transacoes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar transação");
}

export async function registrarLesao(jogadorId: number): Promise<void> {
  const response = await fetch(`${API_URL}/financeiro/jogadores/${jogadorId}/lesao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error("Erro ao registrar lesão");
}
export async function recuperarJogador(jogadorId: number): Promise<void> {
  const response = await fetch(`${API_URL}/financeiro/jogadores/${jogadorId}/recuperar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error("Erro ao recuperar jogador");
}

export async function getElencoClube(clubeId: number): Promise<any[]> {
  const response = await fetch(`${API_URL}/financeiro/clubes/${clubeId}/elenco`);
  if (!response.ok) throw new Error("Erro ao buscar elenco");
  return response.json();
}

export async function getMercado(): Promise<any[]> {
  const response = await fetch(`${API_URL}/financeiro/jogadores/mercado`);
  if (!response.ok) throw new Error("Erro ao buscar mercado");
  return response.json();
}

export async function contratarJogador(clubeId: number, jogadorId: number): Promise<any> {
  const response = await fetch(`${API_URL}/financeiro/clubes/${clubeId}/contratar/${jogadorId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Erro ao contratar jogador");
  return response.json();
}

export async function demitirJogador(clubeId: number, jogadorId: number): Promise<any> {
  const response = await fetch(`${API_URL}/financeiro/clubes/${clubeId}/demitir/${jogadorId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Erro ao demitir jogador");
  return response.json();
}