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

export function solve(input: string): number {
  const lines = input.trim().split("\n");
  const n = lines.length;
  const qc = new Array(n);
  for (let r = 0; r < n; r++) qc[r] = lines[r].indexOf("o");

  const limit = (1 << n) - 1;
  const solution = new Array(n);
  let bestCost = n + 1;
  let bestEncoded = -1n;

  function backtrack(
    row: number,
    cols: number,
    diags: number,
    antiDiags: number,
    mismatches: number,
  ) {
    if (mismatches > bestCost) return;

    if (row === n) {
      const enc = encode(solution, n, mismatches);
      if (mismatches < bestCost || enc < bestEncoded) {
        bestCost = mismatches;
        bestEncoded = enc;
      }
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
        mismatches,
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
        mismatches + 1,
      );
    }
  }

  backtrack(0, 0, 0, 0, 0);
  return Number(bestEncoded % MOD);
}
