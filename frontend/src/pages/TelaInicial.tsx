import '../estilos/tela-inicial.css'

interface TelaInicialProps {
  setAbaAtual: (aba: string) => void
}

export function TelaInicial({ setAbaAtual }: TelaInicialProps) {
  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow fade-up delay-1" style={{ alignSelf: 'flex-start' }}>
          Software de gestão esportiva</p>
        <h1 className="hero-title fade-up delay-2">
          <img src="/src/assets/logo.png" alt="logo" className="hero-logo" />
            SPORTSYNC
        </h1>
        <p className="hero-sub fade-up delay-3">
          Controle jogadores, times, elenco e finanças em um único lugar.
          Pensado para clubes que levam o esporte a sério.
        </p>
      </section>

      <section className="modulos">
        <p className="modulos-label fade-up">O que você quer gerenciar?</p>

        <div className="modulos-grid fade-up delay-1">
          <button className="modulo-card" onClick={() => setAbaAtual('jogadores')}>
            <h2 className="modulo-titulo">Jogadores</h2>
            <p className="modulo-desc">
              Cadastre e acompanhe cada atleta do clube. Histórico, posição e dados pessoais centralizados.
            </p>
            <span className="modulo-cta">Acessar →</span>
          </button>

          <button className="modulo-card" onClick={() => setAbaAtual('times')}>
            <h2 className="modulo-titulo">Times</h2>
            <p className="modulo-desc">
              Organize as equipes da instituição. Categorias, comissões técnicas e escalações em um clique.
            </p>
            <span className="modulo-cta">Acessar →</span>
          </button>

          <button className="modulo-card" onClick={() => setAbaAtual('financeiro')}>
            <h2 className="modulo-titulo">Financeiro</h2>
            <p className="modulo-desc">
              Controle entradas, saídas e contratos. Visibilidade financeira completa para a diretoria.
            </p>
            <span className="modulo-cta">Acessar →</span>
          </button>

          <button className="modulo-card" onClick={() => setAbaAtual('elenco')}>
            <h2 className="modulo-titulo">Elenco</h2>
            <p className="modulo-desc">
              Visualize o plantel completo. Relacione jogadores, posições e disponibilidades com facilidade.
            </p>
            <span className="modulo-cta">Acessar →</span>
          </button>
        </div>
      </section>

      <footer className="rodape">
        <p>© 2026 SportSync — Software de Gestão para Clubes de Futebol</p>
        <p>Projeto POO</p>
      </footer>
    </>
  )
}
