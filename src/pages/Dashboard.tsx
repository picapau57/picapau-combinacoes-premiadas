import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGames } from '../hooks/useGames';
import Header from '../components/Header';
import GameCard from '../components/GameCard';
import StatsPanel from '../components/StatsPanel';
import { Copy, Download, Printer, RefreshCw, Sparkles, Dice5, Layers } from 'lucide-react';
type Tab = 'milhares' | 'dezenas' | 'grupos' | 'info';
export default function Dashboard() {
  const { profile } = useAuth();
  const { games, stats, genMilhares, genDezenas, genGrupos, copyAll, exportTxt, printAll } = useGames();
  const [tab, setTab] = useState<Tab>('milhares');
  const [qty, setQty] = useState(20);
  const [toast, setToast] = useState('');
  function notify(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2000); }
  function handleGenerate() {
    if (tab === 'milhares') genMilhares({ quantity: qty, balanceParity: true, diverseEndings: true });
    else if (tab === 'dezenas') genDezenas({ quantity: qty, balanceRange: true });
    else if (tab === 'grupos') genGrupos({ quantity: qty });
    notify('Jogos gerados com sucesso!');
  }
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'milhares', label: 'Milhares Inteligentes', icon: Sparkles },
    { id: 'dezenas', label: 'Ternos de Dezenas', icon: Dice5 },
    { id: 'grupos', label: 'Ternos de Grupos', icon: Layers },
    { id: 'info', label: 'Análise e Diversificação', icon: null }
  ];
  return (
    <div className="dashboard">
      <Header />
      {toast && <div className="toast">{toast}</div>}
      <div className="dashboard-inner">
        <section className="welcome-panel">
          <div><h2>Olá, {profile?.full_name?.split(' ')[0]} 👋</h2><p>Acesso: <span className="status-liberado">Liberado</span></p></div>
          <div className="quick-stats">
            <div className="qs"><strong>{games.length}</strong><span>Jogos gerados</span></div>
            <div className="qs"><strong>3</strong><span>Modalidades</span></div>
            <div className="qs"><strong>∞</strong><span>Combinações</span></div>
          </div>
        </section>
        <nav className="tabs">
          {tabs.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon && <t.icon size={18} />} {t.label}
            </button>
          ))}
        </nav>
        {tab === 'info' ? (
          <section className="info-section">
            <h3>📌 Análise e Diversificação</h3>
            <p className="disclaimer"><strong>Aviso importante:</strong> Este sistema <u>não prevê resultados</u>, <u>não garante acertos</u> e <u>não promete ganhos</u>. Utiliza apenas métodos de organização para distribuir números de forma equilibrada.</p>
            <ul className="method-list">
              <li>✅ Evita jogos duplicados no mesmo lote</li>
              <li>✅ Evita repetição da mesma dezena/grupo dentro do mesmo jogo</li>
              <li>✅ Distribui números de forma equilibrada</li>
              <li>✅ Controla a frequência de cada número no conjunto</li>
              <li>✅ Evita concentração excessiva em poucos números</li>
              <li>✅ Ordenação automática para facilitar leitura</li>
            </ul>
            <p>As estatísticas de cada geração aparecem logo abaixo dos jogos gerados.</p>
          </section>
        ) : (
          <>
            <section className="generator-panel">
              <div className="gen-controls">
                <label>Quantidade de jogos</label>
                <div className="qty-row">
                  <input type="number" min={1} max={500} value={qty} onChange={e => setQty(Number(e.target.value))} />
                  {tab === 'grupos' && (
                    <div className="quick-qty">{[10, 20, 30, 40, 50].map(n => <button key={n} onClick={() => setQty(n)}>{n}</button>)}</div>
                  )}
                </div>
                <button className="btn-primary big" onClick={handleGenerate}><RefreshCw size={18} /> Gerar combinações</button>
              </div>
            </section>
            {games.length > 0 && (
              <>
                <section className="actions-bar">
                  <button className="btn-secondary" onClick={() => { copyAll(); notify('Copiado!'); }}><Copy size={16} /> Copiar todos</button>
                  <button className="btn-secondary" onClick={printAll}><Printer size={16} /> Imprimir</button>
                  <button className="btn-secondary" onClick={exportTxt}><Download size={16} /> Exportar TXT</button>
                  <button className="btn-secondary" onClick={handleGenerate}><RefreshCw size={16} /> Gerar novamente</button>
                </section>
                <section className="games-grid">{games.map((g, i) => <GameCard key={i} index={i + 1} values={g as any} />)}</section>
                {stats && <StatsPanel stats={stats} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
