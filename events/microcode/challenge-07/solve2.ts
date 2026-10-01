function hammingDistance(a: string, b: string): number {
  let d = 0;
  for (let i = 0; i < 8; i++) if (a[i] !== b[i]) d++;
  return d;
}

function flipBit(seq: string, idx: number): string {
  const a = seq.split("");
  a[idx] = a[idx] === "0" ? "1" : "0";
  return a.join("");
}

function evolveTarget(target: string, g: number): string {
  if (g % 100 === 0) {
    target = target.slice(1) + target[0];
    const a = target.split("");
    a[2] = a[2] === "0" ? "1" : "0";
    a[5] = a[5] === "0" ? "1" : "0";
    target = a.join("");
  }
  if (g % 250 === 0) {
    target = target.split("").reverse().join("");
  }
  return target;
}

export function solve(input: string): number {
  const lines = input.trim().split("\n").map((l) => l.trim());
  const P = parseInt(lines[0]);
  let grandTotal = 0;

  for (let p = 0; p < P; p++) {
    let pop = lines.slice(1 + p * 4, 1 + p * 4 + 4);
    let target = "11010110";
    let total = 0;

    for (let g = 1; g <= 1000; g++) {
      target = evolveTarget(target, g);
      const fitness = pop.map((seq) => 8 - hammingDistance(seq, target));
      const ranked = [0, 1, 2, 3].sort(
        (i, j) => fitness[j] - fitness[i] || j - i
      );
      const pa = pop[ranked[0]],
        pb = pop[ranked[1]];
      const fa = fitness[ranked[0]],
        fb = fitness[ranked[1]];

      const keyOnes = target.split("").filter((b) => b === "1").length;
      const splitSum = keyOnes > 4 ? fa + fb + 2 : fa + fb;
      const split = (splitSum % 7) + 1;
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
