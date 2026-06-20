import assert from "node:assert/strict";
import test from "node:test";
import { Clube } from "../src/modelos/Clube.js";
import { Jogador } from "../src/modelos/Jogador.js";
import { PosicaoJogador } from "../src/modelos/PosicaoJogador.js";
import { SituacaoFisica } from "../src/modelos/SituacaoFisica.js";
import { StatusJogador } from "../src/modelos/StatusJogador.js";
import type { FinanceiroRepositorio } from "../src/repositorio/FinanceiroRepositorio.js";
import { FinanceiroService } from "../src/servicos/FinanceiroService.js";

function criarJogadorMercado() {
  return new Jogador(
    1,
    "Meia Teste",
    24,
    10000,
    null,
    2000,
    PosicaoJogador.MeioCampo,
    StatusJogador.Mercado,
    SituacaoFisica.Disponivel,
    null,
    0,
    null,
  );
}

test("contratacao bloqueia limite de despesa mensal antes de persistir", async () => {
  let persistiuContratacao = false;
  const repositorio = {
    buscarClube: async () => new Clube(1, "SportSync FC", 50000, 3000, 2500),
    buscarJogador: async () => criarJogadorMercado(),
    contratarJogador: async () => {
      persistiuContratacao = true;
      return criarJogadorMercado();
    },
  } as unknown as FinanceiroRepositorio;

  const service = new FinanceiroService(repositorio);

  await assert.rejects(
    () =>
      service.contratarJogador({
        clubeId: 1,
        jogadorId: 1,
        salarioAceito: 2000,
      }),
    /limite de despesa mensal/,
  );

  assert.equal(persistiuContratacao, false);
});

test("contratacao valida orcamento e persiste quando as regras passam", async () => {
  let salarioPersistido = 0;
  const jogadorContratado = new Jogador(
    1,
    "Meia Teste",
    24,
    10000,
    2500,
    2000,
    PosicaoJogador.MeioCampo,
    StatusJogador.Elenco,
    SituacaoFisica.Disponivel,
    null,
    0,
    1,
  );

  const repositorio = {
    buscarClube: async () => new Clube(1, "SportSync FC", 50000, 10000, 1000),
    buscarJogador: async () => criarJogadorMercado(),
    contratarJogador: async (
      _clubeId: number,
      _jogadorId: number,
      salarioAceito: number,
    ) => {
      salarioPersistido = salarioAceito;
      return jogadorContratado;
    },
  } as unknown as FinanceiroRepositorio;

  const service = new FinanceiroService(repositorio);
  const resultado = await service.contratarJogador({
    clubeId: 1,
    jogadorId: 1,
    salarioAceito: 2500,
  });

  assert.equal(salarioPersistido, 2500);
  assert.equal(resultado.getStatus(), StatusJogador.Elenco);
});
