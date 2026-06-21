import { GravidadeLesao, diasPorGravidade } from "./GravidadeLesao.js";
import { PosicaoJogador } from "./PosicaoJogador.js";
import { SituacaoFisica } from "./SituacaoFisica.js";
import { StatusJogador } from "./StatusJogador.js";
import { TipoElenco } from "./TipoElenco.js";

export class Jogador {
  constructor(
    private readonly id: number | undefined,
    private readonly nome: string,
    private readonly idade: number,
    private readonly valorMercado: number,
    private readonly salarioAtual: number | null,
    private readonly salarioDesejado: number,
    private readonly posicao: PosicaoJogador,
    private readonly status: StatusJogador,
    private readonly tipoElenco: TipoElenco | null,
    private readonly situacaoFisica: SituacaoFisica,
    private readonly gravidadeLesao: GravidadeLesao | null,
    private readonly diasLesaoRestantes: number,
    private readonly clubeId: number | null,
  ) {}

  getId(): number | undefined {
    return this.id;
  }

  getNome(): string {
    return this.nome;
  }

  getValorMercado(): number {
    return this.valorMercado;
  }

  getSalarioAtual(): number | null {
    return this.salarioAtual;
  }

  getSalarioDesejado(): number {
    return this.salarioDesejado;
  }

  getStatus(): StatusJogador {
    return this.status;
  }

  getTipoElenco(): TipoElenco | null {
    return this.tipoElenco;
  }

  podeSerContratado(): boolean {
    return (
      this.status === StatusJogador.Mercado &&
      this.situacaoFisica === SituacaoFisica.Disponivel
    );
  }

  calcularDiasLesao(gravidade: GravidadeLesao): number {
    return diasPorGravidade[gravidade];
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      idade: this.idade,
      valorMercado: this.valorMercado,
      salarioAtual: this.salarioAtual,
      salarioDesejado: this.salarioDesejado,
      posicao: this.posicao,
      status: this.status,
      tipoElenco: this.tipoElenco,
      situacaoFisica: this.situacaoFisica,
      gravidadeLesao: this.gravidadeLesao,
      diasLesaoRestantes: this.diasLesaoRestantes,
      clubeId: this.clubeId,
    };
  }
}
