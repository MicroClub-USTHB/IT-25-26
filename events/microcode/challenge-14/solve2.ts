const MOD = 1000000009n;

export function solve(input: string): number {
  const lines = input.split("\n");
  const headerParts = lines[0].split(" ");
  const R = +headerParts[0];
  const C = +headerParts[1];
  const T = BigInt(headerParts[2]);
  const I = +headerParts[3];

  const totalCells = R * C;

  const succ = new Int32Array(totalCells);
  const dr = [0, 0, 1, -1];
  const dc = [1, -1, 0, 0];

  for (let r = 0; r < R; r++) {
    const row = lines[1 + r];
    for (let c = 0; c < C; c++) {
      const ch = row[c];
      let d: number;
      if (ch === ">") d = 0;
      else if (ch === "<") d = 1;
      else if (ch === "v") d = 2;
      else d = 3;

      let nr = r + dr[d];
      let nc = c + dc[d];
      if (nr < 0) nr = R - 1;
      else if (nr >= R) nr = 0;
      if (nc < 0) nc = C - 1;
      else if (nc >= C) nc = 0;

      succ[r * C + c] = nr * C + nc;
    }
  }

  const status = new Uint8Array(totalCells);
  const rhoArr = new Int32Array(totalCells);
  const cycleIdArr = new Int32Array(totalCells);
  const entryOffsetArr = new Int32Array(totalCells);
  const cumTailSumArr = new Float64Array(totalCells);

  interface CycleInfo {
    cells: Int32Array;
    total: bigint;
    prefix: BigInt64Array;
  }

  const cycles: CycleInfo[] = [];

  for (let start = 0; start < totalCells; start++) {
    if (status[start] === 2) continue;

    const path: number[] = [];
    const pathIdx = new Map<number, number>();
    let cur = start;

    while (status[cur] === 0 && !pathIdx.has(cur)) {
      pathIdx.set(cur, path.length);
      status[cur] = 1;
      path.push(cur);
      cur = succ[cur];
    }

    if (status[cur] === 1 && pathIdx.has(cur)) {
      const cycleStart = pathIdx.get(cur)!;
      const cLen = path.length - cycleStart;
      const cycleCells = new Int32Array(cLen);
      for (let j = 0; j < cLen; j++) {
        cycleCells[j] = path[cycleStart + j];
      }

      const prefix = new BigInt64Array(cLen + 1);
      prefix[0] = 0n;
      for (let j = 0; j < cLen; j++) {
        prefix[j + 1] = prefix[j] + BigInt(cycleCells[j]);
      }
      const total = prefix[cLen];

      const cid = cycles.length;
      cycles.push({ cells: cycleCells, total, prefix });

      for (let j = 0; j < cLen; j++) {
        const cell = path[cycleStart + j];
        rhoArr[cell] = 0;
        cycleIdArr[cell] = cid;
        entryOffsetArr[cell] = j;
        cumTailSumArr[cell] = 0;
        status[cell] = 2;
      }

      let runningSum = 0;
      for (let j = cycleStart - 1; j >= 0; j--) {
        const cell = path[j];
        const nextCell = path[j + 1];
        runningSum += nextCell;

        rhoArr[cell] = cycleStart - j;
        cycleIdArr[cell] = cid;
        entryOffsetArr[cell] = 0;
        status[cell] = 2;
      }

      if (cycleStart > 0) {
        cumTailSumArr[path[cycleStart - 1]] = path[cycleStart];
        for (let j = cycleStart - 2; j >= 0; j--) {
          cumTailSumArr[path[j]] = path[j + 1] + cumTailSumArr[path[j + 1]];
        }
      }
    } else if (status[cur] === 2) {
      const baseCid = cycleIdArr[cur];
      const baseRho = rhoArr[cur];
      const baseEntryOffset = entryOffsetArr[cur];
      const baseCumTailSum = cumTailSumArr[cur];

      for (let j = path.length - 1; j >= 0; j--) {
        const cell = path[j];
        const distToCur = path.length - j;
        rhoArr[cell] = distToCur + baseRho;
        cycleIdArr[cell] = baseCid;
        entryOffsetArr[cell] = baseEntryOffset;
        status[cell] = 2;
      }

      cumTailSumArr[path[path.length - 1]] = cur + baseCumTailSum;
      for (let j = path.length - 2; j >= 0; j--) {
        cumTailSumArr[path[j]] = path[j + 1] + cumTailSumArr[path[j + 1]];
      }
    }
  }

  let answer = 0n;

  for (let i = 0; i < I; i++) {
    const parts = lines[1 + R + i].split(" ");
    const startR = +parts[0];
    const startC = +parts[1];
    const startIdx = startR * C + startC;

    const rho = rhoArr[startIdx];
    const cid = cycleIdArr[startIdx];
    const cycle = cycles[cid];
    const lambda = cycle.cells.length;

    const tailContrib = BigInt(Math.round(cumTailSumArr[startIdx]));

    const ticksInCycle = T - BigInt(rho);

    if (ticksInCycle <= 0n) {
      let partialSum = 0n;
      let pos = startIdx;
      for (let t = 0; t < Number(T); t++) {
        pos = succ[pos];
        partialSum += BigInt(pos);
      }
      answer = (answer + partialSum % MOD) % MOD;
      continue;
    }

    const K = ticksInCycle / BigInt(lambda);
    const r = Number(ticksInCycle % BigInt(lambda));

    const cyclePhaseStart = (entryOffsetArr[startIdx] + 1) % lambda;

    const fullCycleContrib = K * cycle.total;

    let partialCycleContrib: bigint;
    if (r === 0) {
      partialCycleContrib = 0n;
    } else {
      const end = cyclePhaseStart + r;
      if (end <= lambda) {
        partialCycleContrib =
          cycle.prefix[end] - cycle.prefix[cyclePhaseStart];
      } else {
        partialCycleContrib =
          (cycle.total - cycle.prefix[cyclePhaseStart]) +
          cycle.prefix[end - lambda];
      }
    }

    const itemContrib = tailContrib + fullCycleContrib + partialCycleContrib;
    answer = (answer + ((itemContrib % MOD) + MOD) % MOD) % MOD;
  }

  return Number(answer);
}
