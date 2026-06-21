export type StatusUI = "titular" | "MERCADO" | "reserva" | "lesionado";
 
export type StatusAPI = "MERCADO" | "ELENCO" | "DEMITIDO";
 
export interface Jogador {
  id: number;
  nome: string;
  idade: number;
  valorMercado: number;
  posicao: string;
  status: StatusUI;
 
  // Campos vindos do backend (opcionais pra não quebrar dados mock)
  salarioMinimo?: number;
  salarioDesejado?: number;
  salarioAtual?: number;
  disponivel?: boolean;
}