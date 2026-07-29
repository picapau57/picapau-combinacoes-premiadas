import { useState } from 'react';
import { generateMilhares, generateDezenas, generateGrupos, computeStats,
  MilharesOptions, DezenasOptions, GruposOptions } from '../lib/generators';
export type GameType = 'milhares' | 'dezenas' | 'grupos';

export function useGames() {
  const [games, setGames] = useState<number[][] | string[]>([]);
  const [type, setType] = useState<GameType | null>(null);
  const genMilhares = (o: MilharesOptions) => { setGames(generateMilhares(o)); setType('milhares'); };
  const genDezenas = (o: DezenasOptions) => { setGames(generateDezenas(o)); setType('dezenas'); };
  const genGrupos = (o: GruposOptions) => { setGames(generateGrupos(o)); setType('grupos'); };
  const stats = Array.isArray(games) && games.length > 0 && typeof games[0] !== 'string'
    ? computeStats(games as number[][]) : null;
  const copyAll = () => {
    const text = games.map((g, i) => `${i + 1}. ${Array.isArray(g) ? g.join(' - ') : g}`).join('\n');
    navigator.clipboard.writeText(text);
  };
  const exportTxt = () => {
    const text = games.map((g, i) => `${i + 1}. ${Array.isArray(g) ? g.join(' - ') : g}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `picapau-${type}-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
  };
  const printAll = () => window.print();
  return { games, type, stats, genMilhares, genDezenas, genGrupos, copyAll, exportTxt, printAll };
}
