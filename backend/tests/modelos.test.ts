import assert from "node:assert/strict";
import test from "node:test";
import { Clube } from "../src/modelos/Clube.js";
import { GravidadeLesao } from "../src/modelos/GravidadeLesao.js";
import { Jogador } from "../src/modelos/Jogador.js";
import { PosicaoJogador } from "../src/modelos/PosicaoJogador.js";
import { SituacaoFisica } from "../src/modelos/SituacaoFisica.js";
import { StatusJogador } from "../src/modelos/StatusJogador.js";

test("clube valida saldo de compra e limite de despesa mensal", () => {
  const clube = new Clube(1, "SportSync FC", 100000, 20000, 15000);

  assert.equal(clube.podeComprar(90000), true);
  assert.equal(clube.podeComprar(120000), false);
  assert.equal(clube.podeAssumirSalario(5000), true);
  assert.equal(clube.podeAssumirSalario(6000), false);
});

test("jogador lesionado nao pode ser contratado e gravidade define dias", () => {
  const jogador = new Jogador(
    1,
    "Atacante Teste",
    22,
    500000,
    null,
    5000,
    PosicaoJogador.Atacante,
    StatusJogador.Mercado,
    null,
    SituacaoFisica.Lesionado,
    GravidadeLesao.Grave,
    60,
    null,
  );

  assert.equal(jogador.podeSerContratado(), false);
  assert.equal(jogador.calcularDiasLesao(GravidadeLesao.Leve), 7);
  assert.equal(jogador.calcularDiasLesao(GravidadeLesao.Moderada), 21);
  assert.equal(jogador.calcularDiasLesao(GravidadeLesao.Grave), 60);
});
