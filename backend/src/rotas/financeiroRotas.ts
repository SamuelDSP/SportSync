import { Router } from "express";
import { FinanceiroControlador } from "../controladores/FinanceiroControlador.js";
import { prisma } from "../prismaCliente.js";
import { FinanceiroRepositorio } from "../repositorio/FinanceiroRepositorio.js";
import { FinanceiroService } from "../servicos/FinanceiroService.js";

const router = Router();
const repositorio = new FinanceiroRepositorio(prisma);
const service = new FinanceiroService(repositorio);
const controlador = new FinanceiroControlador(service);

router.get("/transacoes", controlador.listarTransacoes);
router.post("/transacoes", controlador.criarTransacao);
router.delete("/transacoes/:id", controlador.removerTransacao);

router.post("/clubes", controlador.criarClube);
router.get("/clubes/:clubeId/resumo", controlador.resumo);
router.get("/clubes/:clubeId/elenco", controlador.listarElenco);
router.post(
  "/clubes/:clubeId/contratar/:jogadorId",
  controlador.contratarJogador,
);
router.post("/clubes/:clubeId/demitir/:jogadorId", controlador.demitirJogador);

router.get("/jogadores/mercado", controlador.listarMercado);
router.post("/jogadores/mercado", controlador.cadastrarJogadorMercado);
router.post("/jogadores/:jogadorId/lesao", controlador.registrarLesao);
router.post("/jogadores/:jogadorId/recuperar", controlador.recuperarJogador);

export default router;
