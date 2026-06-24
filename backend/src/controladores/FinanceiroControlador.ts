import type { Request, Response } from "express";
import { GravidadeLesao } from "../modelos/GravidadeLesao.js";
import { PosicaoJogador } from "../modelos/PosicaoJogador.js";
import { TipoTransacao } from "../modelos/TipoTransacao.js";
import { FinanceiroService } from "../servicos/FinanceiroService.js";

type CorpoTransacao = {
  descricao?: string;
  valor?: number;
  tipo?: string;
  categoria?: string | null;
  data?: string;
  clubeId?: number;
};

export class FinanceiroControlador {
  constructor(private readonly financeiroService: FinanceiroService) {}

  listarTransacoes = async (req: Request, res: Response) => {
    const clubeId = req.query.clubeId ? Number(req.query.clubeId) : undefined;
    const transacoes = await this.financeiroService.listarTransacoes(clubeId);
    res.json(transacoes);
  };

  resumo = async (req: Request, res: Response) => {
    try {
      const resumo = await this.financeiroService.gerarResumo(Number(req.params.clubeId));
      res.json(resumo);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  criarTransacao = async (req: Request, res: Response) => {
    try {
      const body = req.body as CorpoTransacao;
      const dadosTransacao = {
        descricao: body.descricao ?? "",
        valor: Number(body.valor),
        tipo: body.tipo as TipoTransacao,
        categoria: body.categoria ?? null,
        data: body.data,
        ...(body.clubeId ? { clubeId: Number(body.clubeId) } : {}),
      };
      const transacao =
        await this.financeiroService.criarTransacao(dadosTransacao);

      res.status(201).json(transacao);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  removerTransacao = async (req: Request, res: Response) => {
    try {
      await this.financeiroService.removerTransacao(Number(req.params.id));
      res.status(204).send();
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  criarClube = async (req: Request, res: Response) => {
    try {
      const clube = await this.financeiroService.criarClube({
        nome: String(req.body.nome ?? ""),
        saldo: Number(req.body.saldo),
        limiteDespesaMensal: Number(req.body.limiteDespesaMensal),
      });

      res.status(201).json(clube);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  listarMercado = async (_req: Request, res: Response) => {
    const jogadores = await this.financeiroService.listarJogadoresMercado();
    res.json(jogadores);
  };

  listarElenco = async (req: Request, res: Response) => {
    try {
      const jogadores = await this.financeiroService.listarElenco(
        Number(req.params.clubeId),
      );
      res.json(jogadores);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  cadastrarJogadorMercado = async (req: Request, res: Response) => {
    try {
      const jogador = await this.financeiroService.cadastrarJogadorMercado({
        nome: String(req.body.nome ?? ""),
        idade: Number(req.body.idade),
        valorMercado: Number(req.body.valorMercado),
        salarioDesejado: Number(req.body.salarioDesejado),
        posicao: req.body.posicao as PosicaoJogador,
      });

      res.status(201).json(jogador);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  contratarJogador = async (req: Request, res: Response) => {
    try {
      const jogador = await this.financeiroService.contratarJogador({
        clubeId: Number(req.params.clubeId),
        jogadorId: Number(req.params.jogadorId),
        salarioAceito: Number(req.body.salarioAceito),
      });

      res.json(jogador);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  demitirJogador = async (req: Request, res: Response) => {
    try {
      const jogador = await this.financeiroService.demitirJogador(
        Number(req.params.clubeId),
        Number(req.params.jogadorId),
      );

      res.json(jogador);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  registrarLesao = async (req: Request, res: Response) => {
    try {
      const jogador = await this.financeiroService.registrarLesao(
        Number(req.params.jogadorId),
        req.body.gravidade as GravidadeLesao,
      );

      res.json(jogador);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  recuperarJogador = async (req: Request, res: Response) => {
    try {
      const jogador = await this.financeiroService.recuperarJogador(
        Number(req.params.jogadorId),
      );

      res.json(jogador);
    } catch (erro) {
      this.responderErro(res, erro);
    }
  };

  private responderErro(res: Response, erro: unknown): void {
    res.status(400).json({
      erro: erro instanceof Error ? erro.message : "Erro na operacao.",
    });
  }
}
