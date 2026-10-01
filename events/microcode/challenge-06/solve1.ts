const MOD = 1_000_000_007n;

export function solve(input: string): number {
  const lines = input.trim().split("\n");
  let idx = 0;

  const N = parseInt(lines[idx++]);

  if (N === 1) {
    return 0;
  }

  const parent: number[] = new Array<number>(N).fill(-1);

  for (let i = 0; i < N - 1; i++) {
    const [p, c] = lines[idx++].trim().split(" ").map(Number);
    parent[c] = p;
  }

  let result = 0n;

  for (let j = 1; j < N; j++) {
    let anc = parent[j];
    while (anc !== -1) {
      const diff = BigInt(j - anc);
      result = (result + diff * diff) % MOD;
      anc = parent[anc];
    }
  }

  return Number(result);
}
