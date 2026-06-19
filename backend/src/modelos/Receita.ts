import { TipoTransacao } from "./TipoTransacao.js";
import { TransacaoFinanceira } from "./TransacaoFinanceira.js";

export class Receita extends TransacaoFinanceira {
  getTipo(): TipoTransacao {
    return TipoTransacao.Receita;
  }
}
