export default function StatsPanel({ stats }: { stats: any }) {
  if (!stats) return null;
  return (
    <div className="stats-panel">
      <h3>📊 Estatísticas da Geração</h3>
      <div className="stats-grid">
        <div className="stat-card"><span className="stat-label">Total gerado</span><span className="stat-value">{stats.total}</span></div>
        <div className="stat-card"><span className="stat-label">Combinações únicas</span><span className="stat-value">{stats.unique}</span></div>
      </div>
      <div className="freq-section">
        <div><strong>Mais frequentes:</strong>
          <ul>{stats.mostFrequent.map(([n, c]: any) => <li key={n}>{n}: {c}x</li>)}</ul></div>
        <div><strong>Menos frequentes:</strong>
          <ul>{stats.leastFrequent.map(([n, c]: any) => <li key={n}>{n}: {c}x</li>)}</ul></div>
      </div>
    </div>
  );
}
