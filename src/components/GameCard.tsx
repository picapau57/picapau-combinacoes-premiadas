export default function GameCard({ index, values }: { index: number; values: string | number[] }) {
  const display = Array.isArray(values) ? values.map(v => v.toString().padStart(2, '0')).join(' - ') : values;
  return (
    <div className="game-card">
      <span className="game-index">#{index.toString().padStart(3, '0')}</span>
      <span className="game-values">{display}</span>
    </div>
  );
}
