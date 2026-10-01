function gcd(a: number, b: number): number {
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

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

export function solve(input: string): number {
  const lines = input.split("\n");

  const stable: number[] = [];
  let S = 0;

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;
    if (parsed.modeS === parsed.modeR) {
      S++;
      stable.push(Math.abs(parsed.value));
    }
  }

  const bits: number[] = [];
  for (const v of stable) {
    if (v === 0) continue;
    bits.push(isPrime(v) ? 1 : 0);
  }

  const n = bits.length;
  if (n === 0) return 0;

  const shift = S % 7;
  let power = 0;

  for (let i = 1; i <= n; i++) {
    const effectiveIndex = ((i + shift - 1) % n) + 1;
    if (bits[i - 1] === 1) {
      power += effectiveIndex * effectiveIndex;
    } else {
      power -= gcd(effectiveIndex, n);
    }
  }

  return power;
}
