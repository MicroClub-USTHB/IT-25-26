const MOD = 10_000_027n;

function encode(cols: number[], n: number, C: number): bigint {
  const bigC = BigInt(C);
  let result = 0n;
  let power = 1n;
  for (let i = 0; i < n; i++) {
    result += BigInt(cols[i]) * power;
    if (i === 0) power = bigC * bigC;
    else power *= bigC;
  }
  return result;
}

function hungarian(cost: number[][], n: number): number {
  const u = new Int32Array(n + 1);
  const v = new Int32Array(n + 1);
  const p = new Int32Array(n + 1);
  const way = new Int32Array(n + 1);
  const minv = new Int32Array(n + 1);
  const used = new Uint8Array(n + 1);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    minv.fill(0x7fffffff);
    used.fill(0);

    do {
      used[j0] = 1;
      const i0 = p[j0];
      let delta = 0x7fffffff;
      let j1 = 0;

      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }

      j0 = j1;
    } while (p[j0] !== 0);

    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0);
  }

  let total = 0;
  for (let j = 1; j <= n; j++) {
    total += cost[p[j] - 1][j - 1];
  }
  return total;
}

export function solve(input: string): number {
  const lines = input.trim().split("\n");
  const n = lines.length;
  const qc = new Array(n);
  for (let r = 0; r < n; r++) qc[r] = lines[r].indexOf("o");

  const limit = (1 << n) - 1;
  const solution = new Array(n);
  const costMatrix: number[][] = Array.from({ length: n }, () => new Array(n));
  let bestCost = 0x7fffffff;
  let bestEncoded = -1n;

  function processSolution() {
    let lb = 0;
    for (let i = 0; i < n; i++) {
      let rowMin = 0x7fffffff;
      for (let j = 0; j < n; j++) {
        const c = Math.abs(i - j) + Math.abs(qc[i] - solution[j]);
        costMatrix[i][j] = c;
        if (c < rowMin) rowMin = c;
      }
      lb += rowMin;
      if (lb > bestCost) return;
    }

    const cost = hungarian(costMatrix, n);
    if (cost < bestCost) {
      bestCost = cost;
      bestEncoded = encode(solution, n, cost);
    } else if (cost === bestCost) {
      const enc = encode(solution, n, cost);
      if (enc < bestEncoded) bestEncoded = enc;
    }
  }

  function backtrack(
    row: number,
    cols: number,
    diags: number,
    antiDiags: number,
  ) {
    if (row === n) {
      processSolution();
      return;
    }

    let available = ~(cols | diags | antiDiags) & limit;

    const preferredBit = 1 << qc[row];
    if (available & preferredBit) {
      solution[row] = qc[row];
      backtrack(
        row + 1,
        cols | preferredBit,
        (diags | preferredBit) << 1,
        (antiDiags | preferredBit) >> 1,
      );
      available &= ~preferredBit;
    }

    while (available) {
      const bit = available & -available;
      available ^= bit;
      solution[row] = 31 - Math.clz32(bit);
      backtrack(
        row + 1,
        cols | bit,
        (diags | bit) << 1,
        (antiDiags | bit) >> 1,
      );
    }
  }

  backtrack(0, 0, 0, 0);
  return Number(bestEncoded % MOD);
}
