import { PrismaClient } from "@prisma/client";
import { Clube } from "../modelos/Clube.js";
import { Despesa } from "../modelos/Despesa.js";
import { GravidadeLesao } from "../modelos/GravidadeLesao.js";
import { Jogador } from "../modelos/Jogador.js";
import { PosicaoJogador } from "../modelos/PosicaoJogador.js";
import { Receita } from "../modelos/Receita.js";
import { SituacaoFisica } from "../modelos/SituacaoFisica.js";
import { StatusJogador } from "../modelos/StatusJogador.js";
import { TipoTransacao } from "../modelos/TipoTransacao.js";
import { TransacaoFinanceira } from "../modelos/TransacaoFinanceira.js";

type RegistroTransacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  categoria: string | null;
  data: Date;
};

type RegistroJogador = {
  id: number;
  nome: string;
  idade: number;
  valorMercado: number;
  salarioAtual: number | null;
  salarioDesejado: number;
  posicao: string;
  status: string;
  situacaoFisica: string;
  gravidadeLesao: string | null;
  diasLesaoRestantes: number;
  clubeId: number | null;
};

type RegistroClube = {
  id: number;
  nome: string;
  saldo: number;
  limiteDespesaMensal: number;
  jogadores: Array<{ salarioAtual: number | null; status: string }>;
};

type NovoJogador = {
  nome: string;
  idade: number;
  valorMercado: number;
  salarioDesejado: number;
  posicao: PosicaoJogador;
};

export class FinanceiroRepositorio {
  constructor(private readonly prisma: PrismaClient) {}

  async listarTransacoes(clubeId?: number): Promise<TransacaoFinanceira[]> {
    const registros = await this.prisma.transacaoFinanceira.findMany({
      ...(clubeId ? { where: { clubeId } } : {}),
      orderBy: { data: "desc" },
    });

    return registros.map((registro) => this.paraTransacaoDominio(registro));
  }

  async criar(transacao: TransacaoFinanceira): Promise<TransacaoFinanceira> {
    const registro = await this.prisma.transacaoFinanceira.create({
      data: {
        descricao: transacao.getDescricao(),
        valor: transacao.getValor(),
        tipo: transacao.getTipo(),
        categoria: transacao.getCategoria(),
        data: transacao.getData(),
      },
    });

    return this.paraTransacaoDominio(registro);
  }

  async remover(id: number): Promise<void> {
    await this.prisma.transacaoFinanceira.delete({
      where: { id },
    });
  }

  async buscarClube(clubeId: number): Promise<Clube | null> {
    const clube = await this.prisma.clube.findUnique({
      where: { id: clubeId },
      include: {
        jogadores: {
          select: { salarioAtual: true, status: true },
        },
      },
    });

    return clube ? this.paraClubeDominio(clube) : null;
  }

  async criarClube(nome: string, saldo: number, limiteDespesaMensal: number) {
    return this.prisma.clube.create({
      data: { nome, saldo, limiteDespesaMensal },
    });
  }

  async listarJogadoresMercado(): Promise<Jogador[]> {
    const jogadores = await this.prisma.jogador.findMany({
      where: { status: StatusJogador.Mercado },
      orderBy: { valorMercado: "desc" },
    });

    return jogadores.map((jogador) => this.paraJogadorDominio(jogador));
  }

  async listarElenco(clubeId: number): Promise<Jogador[]> {
    const jogadores = await this.prisma.jogador.findMany({
      where: { clubeId, status: StatusJogador.Elenco },
      orderBy: { nome: "asc" },
    });

    return jogadores.map((jogador) => this.paraJogadorDominio(jogador));
  }

  async buscarJogador(jogadorId: number): Promise<Jogador | null> {
    const jogador = await this.prisma.jogador.findUnique({
      where: { id: jogadorId },
    });

    return jogador ? this.paraJogadorDominio(jogador) : null;
  }

  async cadastrarJogadorMercado(dados: NovoJogador): Promise<Jogador> {
    const jogador = await this.prisma.jogador.create({
      data: {
        nome: dados.nome,
        idade: dados.idade,
        valorMercado: dados.valorMercado,
        salarioDesejado: dados.salarioDesejado,
        posicao: dados.posicao,
      },
    });

    return this.paraJogadorDominio(jogador);
  }

  async contratarJogador(
    clubeId: number,
    jogadorId: number,
    salarioAceito: number,
  ): Promise<Jogador> {
    const jogador = await this.prisma.$transaction(async (tx) => {
      const jogadorContratado = await tx.jogador.update({
        where: { id: jogadorId },
        data: {
          clubeId,
          salarioAtual: salarioAceito,
          status: StatusJogador.Elenco,
        },
      });

      await tx.clube.update({
        where: { id: clubeId },
        data: {
          saldo: { decrement: jogadorContratado.valorMercado },
        },
      });

      await tx.transacaoFinanceira.create({
        data: {
          clubeId,
          jogadorId,
          descricao: `Contratacao de ${jogadorContratado.nome}`,
          valor: jogadorContratado.valorMercado,
          tipo: TipoTransacao.Despesa,
          categoria: "CONTRATACAO",
        },
      });

      return jogadorContratado;
    });

    return this.paraJogadorDominio(jogador);
  }

  async demitirJogador(clubeId: number, jogadorId: number): Promise<Jogador> {
    const jogador = await this.prisma.$transaction(async (tx) => {
      const jogadorDemitido = await tx.jogador.update({
        where: { id: jogadorId },
        data: {
          clubeId: null,
          salarioAtual: null,
          status: StatusJogador.Demitido,
        },
      });

      await tx.transacaoFinanceira.create({
        data: {
          clubeId,
          jogadorId,
          descricao: `Demissao de ${jogadorDemitido.nome}`,
          valor: 0,
          tipo: TipoTransacao.Despesa,
          categoria: "DEMISSAO",
        },
      });

      return jogadorDemitido;
    });

    return this.paraJogadorDominio(jogador);
  }

  async registrarLesao(
    jogadorId: number,
    gravidade: GravidadeLesao,
    diasLesaoRestantes: number,
  ): Promise<Jogador> {
    const jogador = await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: {
        situacaoFisica: SituacaoFisica.Lesionado,
        gravidadeLesao: gravidade,
        diasLesaoRestantes,
      },
    });

    return this.paraJogadorDominio(jogador);
  }

  async recuperarJogador(jogadorId: number): Promise<Jogador> {
    const jogador = await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: {
        situacaoFisica: SituacaoFisica.Disponivel,
        gravidadeLesao: null,
        diasLesaoRestantes: 0,
      },
    });

    return this.paraJogadorDominio(jogador);
  }

  private paraTransacaoDominio(registro: RegistroTransacao): TransacaoFinanceira {
    const dados = [
      registro.id,
      registro.descricao,
      registro.valor,
      registro.categoria,
      registro.data,
    ] as const;

    if (registro.tipo === TipoTransacao.Receita) {
      return new Receita(...dados);
    }

    return new Despesa(...dados);
  }

  private paraJogadorDominio(registro: RegistroJogador): Jogador {
    return new Jogador(
      registro.id,
      registro.nome,
      registro.idade,
      registro.valorMercado,
      registro.salarioAtual,
      registro.salarioDesejado,
      registro.posicao as PosicaoJogador,
      registro.status as StatusJogador,
      registro.situacaoFisica as SituacaoFisica,
      registro.gravidadeLesao as GravidadeLesao | null,
      registro.diasLesaoRestantes,
      registro.clubeId,
    );
  }

  private paraClubeDominio(registro: RegistroClube): Clube {
    const despesaMensalAtual = registro.jogadores
      .filter((jogador) => jogador.status === StatusJogador.Elenco)
      .reduce((total, jogador) => total + (jogador.salarioAtual ?? 0), 0);

    return new Clube(
      registro.id,
      registro.nome,
      registro.saldo,
      registro.limiteDespesaMensal,
      despesaMensalAtual,
    );
  }
}
