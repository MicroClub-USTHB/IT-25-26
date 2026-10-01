export function solve(input: string): number {
  const lines = input.split("\n");
  const headerParts = lines[0].split(" ");
  const R = +headerParts[0];
  const C = +headerParts[1];
  const T = BigInt(headerParts[2]);
  const I = +headerParts[3];

  const totalCells = R * C;
  const LOST = -1;
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

      const nr = r + dr[d];
      const nc = c + dc[d];
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) {
        succ[r * C + c] = LOST;
      } else {
        succ[r * C + c] = nr * C + nc;
      }
    }
  }

  const status = new Uint8Array(totalCells);
  const rhoArr = new Int32Array(totalCells);
  const cycleLenArr = new Int32Array(totalCells);
  const cycleIdArr = new Int32Array(totalCells);
  const entryOffsetArr = new Int32Array(totalCells);

  const cycles: Int32Array[] = [];

  for (let start = 0; start < totalCells; start++) {
    if (status[start] === 2) continue;

    const path: number[] = [];
    const pathIdx = new Map<number, number>();
    let cur = start;

    while (cur !== LOST && status[cur] === 0 && !pathIdx.has(cur)) {
      pathIdx.set(cur, path.length);
      status[cur] = 1;
      path.push(cur);
      cur = succ[cur];
    }

    if (cur === LOST) {
      for (let j = path.length - 1; j >= 0; j--) {
        const cell = path[j];
        rhoArr[cell] = path.length - j;
        cycleLenArr[cell] = 0;
        status[cell] = 2;
      }
    } else if (status[cur] === 1 && pathIdx.has(cur)) {
      const cycleStart = pathIdx.get(cur)!;
      const cLen = path.length - cycleStart;
      const cycleCells = new Int32Array(cLen);
      for (let j = 0; j < cLen; j++) {
        cycleCells[j] = path[cycleStart + j];
      }

      const cid = cycles.length;
      cycles.push(cycleCells);

      for (let j = 0; j < cLen; j++) {
        const cell = path[cycleStart + j];
        rhoArr[cell] = 0;
        cycleLenArr[cell] = cLen;
        cycleIdArr[cell] = cid;
        entryOffsetArr[cell] = j;
        status[cell] = 2;
      }

      for (let j = cycleStart - 1; j >= 0; j--) {
        const cell = path[j];
        rhoArr[cell] = cycleStart - j;
        cycleLenArr[cell] = cLen;
        cycleIdArr[cell] = cid;
        entryOffsetArr[cell] = 0;
        status[cell] = 2;
      }
    } else if (status[cur] === 2) {
      if (cycleLenArr[cur] === 0) {
        const baseRho = rhoArr[cur];
        for (let j = path.length - 1; j >= 0; j--) {
          const cell = path[j];
          rhoArr[cell] = (path.length - j) + baseRho;
          cycleLenArr[cell] = 0;
          status[cell] = 2;
        }
      } else {
        const baseRho = rhoArr[cur];
        const baseCid = cycleIdArr[cur];
        const baseEntryOffset = entryOffsetArr[cur];
        const baseCLen = cycleLenArr[cur];

        for (let j = path.length - 1; j >= 0; j--) {
          const cell = path[j];
          rhoArr[cell] = (path.length - j) + baseRho;
          cycleLenArr[cell] = baseCLen;
          cycleIdArr[cell] = baseCid;
          entryOffsetArr[cell] = baseEntryOffset;
          status[cell] = 2;
        }
      }
    }
  }

  let checksum = 0;
  for (let i = 0; i < I; i++) {
    const parts = lines[1 + R + i].split(" ");
    const startR = +parts[0];
    const startC = +parts[1];
    const startIdx = startR * C + startC;

    const cl = cycleLenArr[startIdx];
    const rho = rhoArr[startIdx];

    if (cl === 0) {
      if (T < BigInt(rho)) {
        let pos = startIdx;
        const steps = Number(T);
        for (let s = 0; s < steps; s++) pos = succ[pos];
        checksum += pos;
      }
    } else {
      if (T < BigInt(rho)) {
        let pos = startIdx;
        const steps = Number(T);
        for (let s = 0; s < steps; s++) pos = succ[pos];
        checksum += pos;
      } else {
        const remaining = Number((T - BigInt(rho)) % BigInt(cl));
        const finalOffset = (entryOffsetArr[startIdx] + remaining) % cl;
        checksum += cycles[cycleIdArr[startIdx]][finalOffset];
      }
    }
  }

  return checksum;
}
