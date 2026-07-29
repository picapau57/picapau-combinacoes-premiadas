export interface MilharesOptions {
  quantity: number;
  balanceParity?: boolean;
  diverseEndings?: boolean;
  maxRepeatPerDigit?: number;
}
export function generateMilhares(opts: MilharesOptions): string[] {
  const { quantity, balanceParity = true, diverseEndings = true, maxRepeatPerDigit = 0 } = opts;
  const q = Math.min(quantity, 10000);
  const set = new Set<string>();
  const endings = new Map<number, number>();
  const digitFreq = new Map<number, number>();
  let attempts = 0;
  const maxAttempts = q * 50;
  while (set.size < q && attempts < maxAttempts) {
    attempts++;
    const n = Math.floor(Math.random() * 10000);
    const str = n.toString().padStart(4, '0');
    if (set.has(str)) continue;
    const digits = str.split('').map(Number);
    const evens = digits.filter(d => d % 2 === 0).length;
    if (balanceParity && (evens === 0 || evens === 4)) continue;
    const ending = n % 10;
    if (diverseEndings && (endings.get(ending) || 0) >= Math.ceil(q / 10) + 1) continue;
    if (maxRepeatPerDigit > 0) {
      let skip = false;
      for (const d of digits) {
        if ((digitFreq.get(d) || 0) >= maxRepeatPerDigit * q) { skip = true; break; }
      }
      if (skip) continue;
    }
    set.add(str);
    endings.set(ending, (endings.get(ending) || 0) + 1);
    for (const d of digits) digitFreq.set(d, (digitFreq.get(d) || 0) + 1);
  }
  return Array.from(set);
}

export interface DezenasOptions { quantity: number; min?: number; max?: number; balanceRange?: boolean; }
export function generateDezenas(opts: DezenasOptions): number[][] {
  const { quantity, min = 1, max = 99, balanceRange = true } = opts;
  const set = new Set<string>();
  const result: number[][] = [];
  let attempts = 0;
  const maxAttempts = quantity * 80;
  while (result.length < quantity && attempts < maxAttempts) {
    attempts++;
    const pool: number[] = [];
    while (pool.length < 3) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!pool.includes(n)) pool.push(n);
    }
    pool.sort((a, b) => a - b);
    const key = pool.join('-');
    if (set.has(key)) continue;
    if (balanceRange && pool[2] - pool[0] < 10) continue;
    set.add(key);
    result.push(pool);
  }
  return result;
}

export interface GruposOptions { quantity: number; }
export function generateGrupos(opts: GruposOptions): number[][] {
  const { quantity } = opts;
  const set = new Set<string>();
  const result: number[][] = [];
  let attempts = 0;
  const maxAttempts = quantity * 80;
  while (result.length < quantity && attempts < maxAttempts) {
    attempts++;
    const pool: number[] = [];
    while (pool.length < 3) {
      const n = Math.floor(Math.random() * 25) + 1;
      if (!pool.includes(n)) pool.push(n);
    }
    pool.sort((a, b) => a - b);
    const key = pool.join('-');
    if (set.has(key)) continue;
    set.add(key);
    result.push(pool);
  }
  return result;
}

export function computeStats(games: number[][]) {
  const freq = new Map<number, number>();
  games.forEach(g => g.forEach(n => freq.set(n, (freq.get(n) || 0) + 1)));
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return {
    total: games.length,
    unique: new Set(games.map(g => g.join('-'))).size,
    mostFrequent: sorted.slice(0, 5),
    leastFrequent: sorted.slice(-5).reverse()
  };
}
