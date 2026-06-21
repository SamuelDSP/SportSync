export type StatusUI = "ELENCO" |"MERCADO";

export type TipoElenco = "TITULAR" | "RESERVA";



export interface Jogador {
    id: number;
    nome: string;
    idade: number;
    valorMercado: number;
    posicao: string;
    status: StatusUI;
    tipoElenco?: TipoElenco;
}
