export type Status = "titular" |"mercado" |"reserva"| "lesionado"


export interface Jogador {
    id: number;
    name: string;
    age: number;
    mktValue: number;
    position: string;
    status: Status;
}