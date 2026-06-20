import { useEffect, useState } from "react";
import { getResumoClube } from "../services/financeiro";
import type { ResumoClube } from "../modelos/financeiro";

export function TelaFinanceiro() {
  const [resumo, setResumo] = useState<ResumoClube>({
    clube: {
      id: 1,
      nome: "Clube Teste",
      saldo: 1000000,
      limiteDespesaMensal: 500000,
      despesaMensalAtual: 200000,
      margemDespesaMensal: 300000,
    },
    receitas: 800000,
    despesas: 300000,
    saldoCalculadoPorTransacoes: 500000,
    quantidadeTransacoes: 12,
  });

  /*useEffect(() => {
    async function load() {
      try {
        const data = await getResumoClube(1);
        setResumo(data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);*/

  if (!resumo) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Tela Financeiro</h1>

      <h2>{resumo.clube.nome}</h2>
      <p>Saldo: {resumo.clube.saldo}</p>
      <p>Receitas: {resumo.receitas}</p>
      <p>Despesas: {resumo.despesas}</p>
      <p>Transações: {resumo.quantidadeTransacoes}</p>
      <p>Saldo calculado: {resumo.saldoCalculadoPorTransacoes}</p>
    </div>
  );
}
