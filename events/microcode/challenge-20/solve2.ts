interface Bid {
  price: number;
  items: number[];
  cats: number[];
  excl: number[];
  deps: number[];
  closure: number[];
}

function parse(input: string) {
  const lines = input
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  let cur = 0;

  const [N, B, C] = lines[cur++].split(/\s+/).map(Number);
  const itemCat = lines[cur++].split(/\s+/).map(Number);

  const bids: Bid[] = [];
  for (let i = 0; i < B; i++) {
    const line = lines[cur++];
    const pi = line.indexOf("|");
    const gi = line.indexOf(">");
    const lt = line.slice(0, pi).trim().split(/\s+/).map(Number);
    const exclStr = line.slice(pi + 1, gi).trim();
    const depStr = line.slice(gi + 1).trim();
    const items = lt.slice(1);
    bids.push({
      price: lt[0],
      items,
      cats: [...new Set(items.map((it) => itemCat[it]))],
      excl: exclStr === "" ? [] : exclStr.split(/\s+/).map(Number),
      deps: depStr === "" ? [] : depStr.split(/\s+/).map(Number),
      closure: [],
    });
  }

  for (let i = 0; i < B; i++) {
    const visited = new Set<number>();
    const stack = [i];
    while (stack.length) {
      const b = stack.pop()!;
      if (visited.has(b)) continue;
      visited.add(b);
      for (const d of bids[b].deps) stack.push(d);
    }
    bids[i].closure = [...visited];
  }

  const pen: number[][] = [];
  for (let a = 0; a < C; a++) pen.push(lines[cur++].split(/\s+/).map(Number));

  const bidPen = Array.from({ length: B }, () => new Int32Array(B));
  for (let i = 0; i < B; i++) {
    for (let j = i + 1; j < B; j++) {
      let p = 0;
      for (const ca of bids[i].cats)
        for (const cb of bids[j].cats) p += pen[ca][cb];
      bidPen[i][j] = bidPen[j][i] = p;
    }
  }

  const conflictOf: number[][] = Array.from({ length: B }, () => []);
  const itemSets = bids.map((b) => {
    const s = new Uint8Array(N);
    for (const it of b.items) s[it] = 1;
    return s;
  });
  for (let i = 0; i < B; i++) {
    for (let j = i + 1; j < B; j++) {
      let ov = false;
      for (let k = 0; k < N; k++)
        if (itemSets[i][k] && itemSets[j][k]) {
          ov = true;
          break;
        }
      if (ov || bids[i].excl.includes(j) || bids[j].excl.includes(i)) {
        conflictOf[i].push(j);
        conflictOf[j].push(i);
      }
    }
  }

  const Q = Number(lines[cur++]);
  const queries: string[] = [];
  for (let q = 0; q < Q; q++) queries.push(lines[cur++]);

  return { N, B, bids, bidPen, conflictOf, Q, queries };
}

function solveCore(
  N: number,
  B: number,
  bids: Bid[],
  bidPen: Int32Array[],
  conflictOf: number[][],
  available: boolean[],
  forcedSet: Set<number>,
  prices: number[],
  topK = 1,
): number | number[] {
  const forcedList = [...forcedSet];
  const forbidden = new Uint8Array(B);
  const forcedItems = new Uint8Array(N);
  let baseScore = 0;

  for (const fi of forcedList) {
    baseScore += prices[fi];
    for (const it of bids[fi].items) forcedItems[it] = 1;
    forbidden[fi] = 1;
  }
  for (let a = 0; a < forcedList.length; a++) {
    for (let b2 = a + 1; b2 < forcedList.length; b2++) {
      baseScore -= bidPen[forcedList[a]][forcedList[b2]];
    }
  }
  for (let i = 0; i < B; i++) {
    if (!available[i] || forcedSet.has(i)) forbidden[i] = 1;
  }

  const cands = Array.from({ length: B }, (_, i) => i)
    .filter((i) => !forbidden[i])
    .sort((a, b) => prices[b] - prices[a]);

  const M = cands.length;
  if (M === 0) return topK === 1 ? baseScore : [baseScore];

  const pos = new Int32Array(B).fill(-1);
  for (let ci = 0; ci < M; ci++) pos[cands[ci]] = ci;

  const sufSum = new Float64Array(M + 1);
  for (let i = M - 1; i >= 0; i--) sufSum[i] = sufSum[i + 1] + prices[cands[i]];

  const density = new Float64Array(M);
  for (let ci = 0; ci < M; ci++) {
    density[ci] = prices[cands[ci]] / bids[cands[ci]].items.length;
  }

  const itemCands: number[][] = Array.from({ length: N }, () => []);
  for (let ci = 0; ci < M; ci++) {
    for (const it of bids[cands[ci]].items) itemCands[it].push(ci);
  }
  for (let it = 0; it < N; it++) {
    itemCands[it].sort((a, b) => density[b] - density[a]);
  }

  const forb2 = new Uint8Array(M);
  const freeItems = new Uint8Array(N);
  const freeWinners: number[] = [];
  let freeScore = 0;
  const scoreSet = topK > 1 ? new Set<number>([baseScore]) : null;
  let cachedKthBest = -Infinity;
  function updateKthBest() {
    if (!scoreSet || scoreSet.size < topK) {
      cachedKthBest = -Infinity;
    } else {
      cachedKthBest = [...scoreSet].sort((a, b) => b - a)[topK - 1];
    }
  }
  updateKthBest();

  function lpRelaxUB(idx: number): number {
    let ub = 0;
    for (let it = 0; it < N; it++) {
      if (forcedItems[it] || freeItems[it]) continue;
      const cs = itemCands[it];
      for (let k = 0; k < cs.length; k++) {
        const ci = cs[k];
        if (ci < idx || forb2[ci]) continue;
        ub += density[ci];
        break;
      }
    }
    return baseScore + freeScore + ub;
  }

  function greedySeed(): number {
    let score = baseScore;
    const tempUsed = new Uint8Array(N);
    for (let k = 0; k < N; k++) if (forcedItems[k]) tempUsed[k] = 1;
    const tempWinners = [...forcedList];

    for (let ci = 0; ci < M; ci++) {
      const bid = cands[ci];
      let ok = true;
      for (const it of bids[bid].items)
        if (tempUsed[it]) {
          ok = false;
          break;
        }
      if (!ok) continue;
      let exclConflict = false;
      for (const w of tempWinners) {
        if (bids[bid].excl.includes(w) || bids[w].excl.includes(bid)) {
          exclConflict = true;
          break;
        }
      }
      if (exclConflict) continue;
      let depOk = true;
      for (const d of bids[bid].closure) {
        if (d === bid) continue;
        if (!tempWinners.includes(d)) {
          depOk = false;
          break;
        }
      }
      if (!depOk) continue;

      score += prices[bid];
      for (const w of tempWinners) score -= bidPen[bid][w];
      for (const it of bids[bid].items) tempUsed[it] = 1;
      tempWinners.push(bid);
    }
    return score;
  }

  let best = greedySeed();
  if (best < baseScore) best = baseScore;

  function bb(idx: number): void {
    const loose = baseScore + freeScore + sufSum[idx];
    if (topK === 1) {
      if (loose <= best) return;
    } else {
      if (scoreSet!.size >= topK && loose <= cachedKthBest) return;
    }
    const ub = lpRelaxUB(idx);
    if (topK === 1) {
      if (ub <= best) return;
    } else {
      if (scoreSet!.size >= topK && ub <= cachedKthBest) return;
    }

    if (idx === M) {
      const s = baseScore + freeScore;
      if (s > best) best = s;
      if (scoreSet && !scoreSet.has(s)) {
        scoreSet.add(s);
        updateKthBest();
      }
      return;
    }

    const ci = idx;
    const bid = cands[ci];

    if (!forb2[ci]) {
      let valid = true;
      const toInc: number[] = [ci];

      for (const dep of bids[bid].closure) {
        if (dep === bid) continue;
        if (forcedSet.has(dep)) continue;

        const dci = pos[dep];
        if (dci === -1 || forb2[dci]) {
          valid = false;
          break;
        }
        for (const it of bids[dep].items) {
          if (forcedItems[it] || freeItems[it]) {
            valid = false;
            break;
          }
        }
        if (!valid) break;
        toInc.push(dci);
      }
      for (const it of bids[bid].items) {
        if (forcedItems[it] || freeItems[it]) {
          valid = false;
          break;
        }
      }

      if (valid) {
        const savedForb: number[] = [];
        let penAdded = 0;

        for (const tci of toInc) {
          const tb = cands[tci];
          for (const f of forcedList) penAdded += bidPen[tb][f];
          for (const w of freeWinners) penAdded += bidPen[tb][w];
          freeScore += prices[tb];
          for (const it of bids[tb].items) freeItems[it] = 1;
          freeWinners.push(tb);
          forb2[tci] = 1;
          for (const cj of conflictOf[tb]) {
            const cjci = pos[cj];
            if (cjci >= 0 && !forb2[cjci]) {
              forb2[cjci] = 1;
              savedForb.push(cjci);
            }
          }
        }

        freeScore -= penAdded;
        bb(idx + 1);
        freeScore += penAdded;

        for (let k = toInc.length - 1; k >= 0; k--) {
          const tci = toInc[k];
          const tb = cands[tci];
          freeWinners.pop();
          freeScore -= prices[tb];
          for (const it of bids[tb].items) freeItems[it] = 0;
          forb2[tci] = 0;
        }
        for (const cjci of savedForb) forb2[cjci] = 0;
      }
    }

    bb(idx + 1);
  }

  bb(0);

  if (topK === 1) return best;
  return [...scoreSet!].sort((a, b) => b - a).slice(0, topK);
}

export function solve(input: string): number {
  const { N, B, bids, bidPen, conflictOf, Q, queries } = parse(input);

  const prices = bids.map((b) => b.price);
  const banned = new Set<number>();
  const forced = new Set<number>();
  const forcedItems = new Set<number>();
  const disq = new Set<number>();

  function getAvailable(): boolean[] {
    const av = new Array(B).fill(false);
    for (let i = 0; i < B; i++)
      if (!banned.has(i) && !disq.has(i)) av[i] = true;
    return av;
  }

  function rebuildForcedState(): void {
    forcedItems.clear();
    disq.clear();

    for (const f of forced) {
      for (const it of bids[f].items) forcedItems.add(it);
    }

    for (let j = 0; j < B; j++) {
      if (banned.has(j) || forced.has(j)) continue;
      for (const it of bids[j].items) {
        if (forcedItems.has(it)) {
          disq.add(j);
          break;
        }
      }
    }

    for (let j = 0; j < B; j++) {
      if (banned.has(j) || forced.has(j) || disq.has(j)) continue;
      for (const f of forced) {
        if (bids[j].excl.includes(f)) {
          disq.add(j);
          break;
        }
      }
    }

    for (const f of forced) {
      for (const e of bids[f].excl) {
        if (!forced.has(e)) disq.add(e);
      }
    }
  }

  function applyForce(bid: number): boolean {
    const closure = bids[bid].closure;
    const closureSet = new Set<number>(closure);

    for (const b of closure) {
      if (banned.has(b) || disq.has(b)) return false;
      for (const it of bids[b].items) if (forcedItems.has(it)) return false;
    }

    for (const f of forced) {
      if (bids[f].excl.includes(bid)) return false;
      for (const b of closure) {
        if (bids[f].excl.includes(b) || bids[b].excl.includes(f)) return false;
      }
    }

    const seenItems = new Set<number>();
    for (const b of closure) {
      for (const it of bids[b].items) {
        if (seenItems.has(it)) return false;
        seenItems.add(it);
      }
      for (const e of bids[b].excl) {
        if (closureSet.has(e)) return false;
      }
    }

    for (const b of closure) {
      forced.add(b);
    }
    rebuildForcedState();
    return true;
  }

  let total = 0;

  for (let q = 0; q < Q; q++) {
    const parts = queries[q].split(/\s+/);
    const qt = parts[0];

    if (qt === "A") {
      const bid = Number(parts[1]);
      if (!applyForce(bid)) {
        total += 0;
      } else {
        total += solveCore(
          N,
          B,
          bids,
          bidPen,
          conflictOf,
          getAvailable(),
          new Set(forced),
          prices,
          1,
        ) as number;
      }
    } else if (qt === "B") {
      const bid = Number(parts[1]);
      banned.add(bid);

      for (const f of [...forced]) {
        if (bids[f].closure.includes(bid)) {
          forced.delete(f);
          banned.add(f);
        }
      }
      rebuildForcedState();

      total += solveCore(
        N,
        B,
        bids,
        bidPen,
        conflictOf,
        getAvailable(),
        new Set(forced),
        prices,
        1,
      ) as number;
    } else if (qt === "C") {
      prices[Number(parts[1])] = Number(parts[2]);
      total += solveCore(
        N,
        B,
        bids,
        bidPen,
        conflictOf,
        getAvailable(),
        new Set(forced),
        prices,
        1,
      ) as number;
    } else {
      const k = Number(parts[1]);
      const topK = solveCore(
        N,
        B,
        bids,
        bidPen,
        conflictOf,
        getAvailable(),
        new Set(forced),
        prices,
        k,
      ) as number[];

      total += topK.length > 0 ? topK[topK.length - 1] : 0;
    }
  }

  return total;
}
