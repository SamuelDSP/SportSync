
export type StatusUI = "ELENCO" | "MERCADO"|"DEMITIDO";

export type TipoElenco = "TITULAR" | "RESERVA";

 
export interface Jogador {
  id: number;
  nome: string;
  idade: number;
  valorMercado: number;
  posicao: string;
  status: StatusUI;
  tipoElenco?: TipoElenco;
 
  // Campos vindos do backend (opcionais pra não quebrar dados mock)
  salarioMinimo?: number;
  salarioDesejado?: number;
  salarioAtual?: number;
  disponivel?: boolean;
}
