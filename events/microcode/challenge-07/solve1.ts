function countOnes(seq: string): number {
  let n = 0;
  for (const ch of seq) if (ch === "1") n++;
  return n;
}

function flipBit(seq: string, idx: number): string {
  const a = seq.split("");
  a[idx] = a[idx] === "0" ? "1" : "0";
  return a.join("");
}

export function solve(input: string): number {
  const lines = input.trim().split("\n").map((l) => l.trim());
  const P = parseInt(lines[0]);
  let grandTotal = 0;

  for (let p = 0; p < P; p++) {
    let pop = lines.slice(1 + p * 4, 1 + p * 4 + 4);
    let total = 0;

    for (let g = 1; g <= 1000; g++) {
      const fitness = pop.map(countOnes);
      const ranked = [0, 1, 2, 3].sort(
        (i, j) => fitness[j] - fitness[i] || j - i
      );
      const pa = pop[ranked[0]],
        pb = pop[ranked[1]];
      const fa = fitness[ranked[0]],
        fb = fitness[ranked[1]];

      const split = ((fa + fb) % 7) + 1;
      let child1 = pa.slice(0, split) + pb.slice(split);
      let child2 = pb.slice(0, split) + pa.slice(split);

      const mutIdx = (g * 3 + fa) % 8;
      child1 = flipBit(child1, mutIdx);
      child2 = flipBit(child2, mutIdx);

      const arr = [pa, pb, child1, child2];
      const r = g % 4;
      pop =
        r === 0
          ? [...arr]
          : [...arr.slice(4 - r), ...arr.slice(0, 4 - r)];

      total += pop.reduce((sum, seq) => sum + parseInt(seq, 2), 0);
    }

    grandTotal += total;
  }

  return grandTotal;
}
