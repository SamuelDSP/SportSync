import { TipoTransacao } from "./TipoTransacao.js";
import { TransacaoFinanceira } from "./TransacaoFinanceira.js";

export class Despesa extends TransacaoFinanceira {
  getTipo(): TipoTransacao {
    return TipoTransacao.Despesa;
  }
}
