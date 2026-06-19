export class Clube {
  constructor(
    private readonly id: number,
    private readonly nome: string,
    private readonly saldo: number,
    private readonly limiteDespesaMensal: number,
    private readonly despesaMensalAtual: number,
  ) {}

  getId(): number {
    return this.id;
  }

  getSaldo(): number {
    return this.saldo;
  }

  getDespesaMensalAtual(): number {
    return this.despesaMensalAtual;
  }

  getLimiteDespesaMensal(): number {
    return this.limiteDespesaMensal;
  }

  podeComprar(valorCompra: number): boolean {
    return this.saldo >= valorCompra;
  }

  podeAssumirSalario(salario: number): boolean {
    return this.despesaMensalAtual + salario <= this.limiteDespesaMensal;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      saldo: this.saldo,
      limiteDespesaMensal: this.limiteDespesaMensal,
      despesaMensalAtual: this.despesaMensalAtual,
      margemDespesaMensal: this.limiteDespesaMensal - this.despesaMensalAtual,
    };
  }
}
