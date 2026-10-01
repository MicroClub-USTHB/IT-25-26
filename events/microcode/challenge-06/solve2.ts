const MOD = 1_000_000_007n;

export function solve(input: string): number {
  const lines = input.trim().split('\n');
  let idx = 0;

  const N = parseInt(lines[idx++]);

  if (N === 1) {
    return 0;
  }

  const children: number[][] = Array.from({ length: N }, () => []);
  const parent: number[] = new Array<number>(N).fill(-1);
  const depth: number[] = new Array<number>(N).fill(0);

  for (let i = 0; i < N - 1; i++) {
    const [p, c] = lines[idx++].trim().split(' ').map(Number);
    children[p].push(c);
    parent[c] = p;
  }

  const queue: number[] = [0];
  let qi = 0;
  const bfsOrder: number[] = [];
  while (qi < queue.length) {
    const node = queue[qi++];
    bfsOrder.push(node);
    for (const ch of children[node]) {
      depth[ch] = depth[node] + 1;
      queue.push(ch);
    }
  }

  const sz: number[] = new Array<number>(N).fill(1);
  for (let i = bfsOrder.length - 1; i >= 0; i--) {
    const v = bfsOrder[i];
    if (parent[v] !== -1) {
      sz[parent[v]] += sz[v];
    }
  }

  function C2(n: number): bigint {
    return BigInt(n) * BigInt(n - 1) / 2n;
  }

  let result = 0n;

  for (let v = 0; v < N; v++) {
    let subtracted = 0n;
    for (const ch of children[v]) {
      subtracted += C2(sz[ch]);
    }
    const pairsAtV = C2(sz[v]) - subtracted;
    result = (result + pairsAtV * BigInt(depth[v])) % MOD;
  }

  return Number(result);
}
