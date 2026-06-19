import { TipoTransacao } from "./TipoTransacao.js";

export abstract class TransacaoFinanceira {
  constructor(
    private readonly id: number | undefined,
    private readonly descricao: string,
    private readonly valor: number,
    private readonly categoria: string | null,
    private readonly data: Date,
  ) {}

  getId(): number | undefined {
    return this.id;
  }

  getDescricao(): string {
    return this.descricao;
  }

  getValor(): number {
    return this.valor;
  }

  getCategoria(): string | null {
    return this.categoria;
  }

  getData(): Date {
    return this.data;
  }

  abstract getTipo(): TipoTransacao;

  toJSON() {
    return {
      id: this.id,
      descricao: this.descricao,
      valor: this.valor,
      tipo: this.getTipo(),
      categoria: this.categoria,
      data: this.data,
    };
  }
}
