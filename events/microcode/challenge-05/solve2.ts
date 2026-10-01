function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function parseLine(line: string): { value: number; modeS: string; modeR: string } | null {
  const stripped = line.replace(/\s+/g, "");
  if (!stripped) return null;
  const match = stripped.match(/^(-?\d+)\|([A-Z]):([A-Z])$/);
  if (!match) return null;
  return {
    value: parseInt(match[1], 10),
    modeS: match[2],
    modeR: match[3],
  };
}

function smallestPeriod(seq: number[]): number {
  const n = seq.length;
  for (let L = 1; L <= n; L++) {
    if (n % L !== 0) continue;
    let valid = true;
    for (let i = 0; i < n; i++) {
      if (seq[i] !== seq[i % L]) { valid = false; break; }
    }
    if (valid) return L;
  }
  return n;
}

export function solve(input: string): number {
  const lines = input.split("\n");

  const stable: number[] = [];

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;
    if (parsed.modeS === parsed.modeR) {
      stable.push(Math.abs(parsed.value));
    }
  }

  const bits: number[] = [];
  for (const v of stable) {
    if (v === 0) continue;
    bits.push(isPrime(v) ? 1 : 0);
  }

  const n = bits.length;
  if (n < 5) return 0;

  const mutated: number[] = [];
  for (let i = 0; i <= n - 5; i++) {
    const w = (bits[i] << 4) | (bits[i+1] << 3) | (bits[i+2] << 2) | (bits[i+3] << 1) | bits[i+4];
    let emit: number;
    if (w % 3 === 0) {
      emit = 1;
    } else if (w % 5 === 0) {
      emit = 0;
    } else {
      emit = (bits[i] + bits[i+1] + bits[i+2] + bits[i+3] + bits[i+4]) % 2;
    }
    mutated.push(emit);
  }

  const L = smallestPeriod(mutated);

  let posSum = 0;
  for (let i = 0; i < mutated.length; i++) {
    if (mutated[i] === 1) posSum += (i + 1);
  }

  return posSum * L;
}
