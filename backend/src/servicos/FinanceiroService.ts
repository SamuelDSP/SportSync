import { GravidadeLesao } from "../modelos/GravidadeLesao.js";
import { Jogador } from "../modelos/Jogador.js";
import { PosicaoJogador } from "../modelos/PosicaoJogador.js";
import { TipoTransacao } from "../modelos/TipoTransacao.js";
import { TransacaoFinanceira } from "../modelos/TransacaoFinanceira.js";
import { FinanceiroRepositorio } from "../repositorio/FinanceiroRepositorio.js";
import { Despesa } from "../modelos/Despesa.js";
import { Receita } from "../modelos/Receita.js";

const SALARIO_MINIMO_JOGADOR = 1500;

type NovaTransacaoDTO = {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string | null;
  data: string | undefined;
  clubeId?: number;
};

type NovoClubeDTO = {
  nome: string;
  saldo: number;
  limiteDespesaMensal: number;
};

type NovoJogadorDTO = {
  nome: string;
  idade: number;
  valorMercado: number;
  salarioDesejado: number;
  posicao: PosicaoJogador;
};

type ContratacaoDTO = {
  clubeId: number;
  jogadorId: number;
  salarioAceito: number;
};

export class FinanceiroService {
  constructor(private readonly repositorio: FinanceiroRepositorio) {}

  async listarTransacoes(clubeId?: number): Promise<TransacaoFinanceira[]> {
    return this.repositorio.listarTransacoes(clubeId);
  }

  async criarTransacao(dados: NovaTransacaoDTO): Promise<TransacaoFinanceira> {
    this.validarTransacao(dados);

    const transacao =
      dados.tipo === TipoTransacao.Receita
        ? new Receita(
            undefined,
            dados.descricao,
            dados.valor,
            dados.categoria ?? null,
            dados.data ? new Date(dados.data) : new Date(),
          )
        : new Despesa(
            undefined,
            dados.descricao,
            dados.valor,
            dados.categoria ?? null,
            dados.data ? new Date(dados.data) : new Date(),
          );

    return this.repositorio.criar(transacao, dados.clubeId);
  }

  async removerTransacao(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Id da transacao invalido.");
    }

    await this.repositorio.remover(id);
  }

  async criarClube(dados: NovoClubeDTO) {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error("Nome do clube precisa ter pelo menos 2 caracteres.");
    }

    if (dados.saldo < 0 || dados.limiteDespesaMensal <= 0) {
      throw new Error("Saldo e limite mensal precisam ser valores validos.");
    }

    return this.repositorio.criarClube(
      dados.nome,
      dados.saldo,
      dados.limiteDespesaMensal,
    );
  }

  async gerarResumo(clubeId: number) {
    const clube = await this.buscarClubeObrigatorio(clubeId);
    const transacoes = await this.repositorio.listarTransacoes(clubeId);
    const receitas = this.calcularTotalPorTipo(transacoes, TipoTransacao.Receita);
    const despesas = this.calcularTotalPorTipo(transacoes, TipoTransacao.Despesa);

    return {
      clube,
      receitas,
      despesas,
      saldoCalculadoPorTransacoes: receitas - despesas,
      quantidadeTransacoes: transacoes.length,
    };
  }

  async listarJogadoresMercado(): Promise<Jogador[]> {
    return this.repositorio.listarJogadoresMercado();
  }

  async listarElenco(clubeId: number): Promise<Jogador[]> {
    await this.buscarClubeObrigatorio(clubeId);
    return this.repositorio.listarElenco(clubeId);
  }

  async cadastrarJogadorMercado(dados: NovoJogadorDTO): Promise<Jogador> {
    this.validarJogador(dados);
    return this.repositorio.cadastrarJogadorMercado(dados);
  }

  async contratarJogador(dados: ContratacaoDTO): Promise<Jogador> {
    const clube = await this.buscarClubeObrigatorio(dados.clubeId);
    const jogador = await this.buscarJogadorObrigatorio(dados.jogadorId);

    if (!jogador.podeSerContratado()) {
      throw new Error("Jogador precisa estar no mercado e disponivel fisicamente.");
    }

    if (dados.salarioAceito < SALARIO_MINIMO_JOGADOR) {
      throw new Error(`Salario minimo do jogador e ${SALARIO_MINIMO_JOGADOR}.`);
    }

    if (dados.salarioAceito < jogador.getSalarioDesejado()) {
      throw new Error("Salario aceito nao pode ser menor que o salario desejado.");
    }

    if (!clube.podeComprar(jogador.getValorMercado())) {
      throw new Error("Saldo insuficiente para contratar esse jogador.");
    }

    if (!clube.podeAssumirSalario(dados.salarioAceito)) {
      throw new Error("Contratacao ultrapassa o limite de despesa mensal.");
    }

    return this.repositorio.contratarJogador(
      dados.clubeId,
      dados.jogadorId,
      dados.salarioAceito,
    );
  }

  async demitirJogador(clubeId: number, jogadorId: number): Promise<Jogador> {
    await this.buscarClubeObrigatorio(clubeId);
    const jogador = await this.buscarJogadorObrigatorio(jogadorId);

    if (jogador.getSalarioAtual() === null) {
      throw new Error("Apenas jogadores do elenco podem ser demitidos.");
    }

    return this.repositorio.demitirJogador(clubeId, jogadorId);
  }

  async registrarLesao(
    jogadorId: number,
    gravidade: GravidadeLesao,
  ): Promise<Jogador> {
    const jogador = await this.buscarJogadorObrigatorio(jogadorId);

    if (!Object.values(GravidadeLesao).includes(gravidade)) {
      throw new Error("Gravidade invalida. Use LEVE, MODERADA ou GRAVE.");
    }

    const diasLesao = jogador.calcularDiasLesao(gravidade);
    return this.repositorio.registrarLesao(jogadorId, gravidade, diasLesao);
  }

  async recuperarJogador(jogadorId: number): Promise<Jogador> {
    await this.buscarJogadorObrigatorio(jogadorId);
    return this.repositorio.recuperarJogador(jogadorId);
  }

  private async buscarClubeObrigatorio(clubeId: number) {
    if (!Number.isInteger(clubeId) || clubeId <= 0) {
      throw new Error("Id do clube invalido.");
    }

    const clube = await this.repositorio.buscarClube(clubeId);

    if (!clube) {
      throw new Error("Clube nao encontrado.");
    }

    return clube;
  }

  private async buscarJogadorObrigatorio(jogadorId: number): Promise<Jogador> {
    if (!Number.isInteger(jogadorId) || jogadorId <= 0) {
      throw new Error("Id do jogador invalido.");
    }

    const jogador = await this.repositorio.buscarJogador(jogadorId);

    if (!jogador) {
      throw new Error("Jogador nao encontrado.");
    }

    return jogador;
  }

  private calcularTotalPorTipo(
    transacoes: TransacaoFinanceira[],
    tipo: TipoTransacao,
  ): number {
    return transacoes
      .filter((transacao) => transacao.getTipo() === tipo)
      .reduce((total, transacao) => total + transacao.getValor(), 0);
  }

  private validarTransacao(dados: NovaTransacaoDTO): void {
    if (!dados.descricao || dados.descricao.trim().length < 3) {
      throw new Error("A descricao precisa ter pelo menos 3 caracteres.");
    }

    if (!Number.isFinite(dados.valor) || dados.valor <= 0) {
      throw new Error("O valor precisa ser maior que zero.");
    }

    if (!Object.values(TipoTransacao).includes(dados.tipo)) {
      throw new Error("Tipo de transacao invalido. Use RECEITA ou DESPESA.");
    }

    if (dados.data && Number.isNaN(new Date(dados.data).getTime())) {
      throw new Error("Data invalida.");
    }
  }

  private validarJogador(dados: NovoJogadorDTO): void {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error("Nome do jogador precisa ter pelo menos 2 caracteres.");
    }

    if (!Number.isInteger(dados.idade) || dados.idade < 16) {
      throw new Error("Jogador precisa ter pelo menos 16 anos.");
    }

    if (dados.valorMercado <= 0) {
      throw new Error("Valor de mercado precisa ser maior que zero.");
    }

    if (dados.salarioDesejado < SALARIO_MINIMO_JOGADOR) {
      throw new Error(`Salario desejado minimo e ${SALARIO_MINIMO_JOGADOR}.`);
    }

    if (!Object.values(PosicaoJogador).includes(dados.posicao)) {
      throw new Error("Posicao invalida.");
    }
  }
}
