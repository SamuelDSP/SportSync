export interface Clube {
  id: number;
  nome: string;
  saldo: number;
  limiteDespesaMensal: number;
  despesaMensalAtual: number;
  margemDespesaMensal: number;
}

export interface ResumoClube {
  clube: Clube;
  receitas: number;
  despesas: number;
  saldoCalculadoPorTransacoes: number;
  quantidadeTransacoes: number;
}