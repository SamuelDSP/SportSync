

export interface Funcionario{
    name: string;
}

export class Jogador implements Funcionario{
    name: string;
    age: number;
    mktValue: number;
    position: string;

    constructor(nome: string, idade: number, valor: number, position: string){
        this.name=nome;
        this.age=idade;
        this.mktValue=valor;
        this.position=position;
    }
}

let neymar = new Jogador("Neymar", 34, 10, "PE");