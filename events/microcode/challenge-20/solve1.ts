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

  const rawBids: Bid[] = [];
  for (let i = 0; i < B; i++) {
    const line = lines[cur++];
    const pi = line.indexOf("|");
    const gi = line.indexOf(">");
    const lt = line.slice(0, pi).trim().split(/\s+/).map(Number);
    const price = lt[0];
    const items = lt.slice(1);
    const exclStr = line.slice(pi + 1, gi).trim();
    const depStr = line.slice(gi + 1).trim();
    const excl = exclStr === "" ? [] : exclStr.split(/\s+/).map(Number);
    const deps = depStr === "" ? [] : depStr.split(/\s+/).map(Number);
    const cats = [...new Set(items.map((it) => itemCat[it]))];
    rawBids.push({ price, items, cats, excl, deps, closure: [] });
  }

  for (let i = 0; i < B; i++) {
    const visited = new Set<number>();
    const stack = [i];
    while (stack.length) {
      const b = stack.pop()!;
      if (visited.has(b)) continue;
      visited.add(b);
      for (const d of rawBids[b].deps) stack.push(d);
    }
    rawBids[i].closure = [...visited];
  }

  const pen: number[][] = [];
  for (let a = 0; a < C; a++) {
    pen.push(lines[cur++].split(/\s+/).map(Number));
  }

  const bidPen = Array.from({ length: B }, () => new Int32Array(B));
  for (let i = 0; i < B; i++) {
    for (let j = i + 1; j < B; j++) {
      let p = 0;
      for (const ca of rawBids[i].cats)
        for (const cb of rawBids[j].cats) p += pen[ca][cb];
      bidPen[i][j] = bidPen[j][i] = p;
    }
  }

  const conflictOf: number[][] = Array.from({ length: B }, () => []);
  const itemSets = rawBids.map((b) => {
    const s = new Uint8Array(N);
    for (const it of b.items) s[it] = 1;
    return s;
  });
  for (let i = 0; i < B; i++) {
    for (let j = i + 1; j < B; j++) {
      let overlap = false;
      for (let k = 0; k < N; k++)
        if (itemSets[i][k] && itemSets[j][k]) {
          overlap = true;
          break;
        }
      if (
        overlap ||
        rawBids[i].excl.includes(j) ||
        rawBids[j].excl.includes(i)
      ) {
        conflictOf[i].push(j);
        conflictOf[j].push(i);
      }
    }
  }

  const Q = Number(lines[cur++]);
  const queries: string[] = [];
  for (let q = 0; q < Q; q++) queries.push(lines[cur++]);

  return {
    N,
    B,
    C,
    bids: rawBids,
    bidPen,
    conflictOf,
    itemSets,
    pen,
    itemCat,
    Q,
    queries,
  };
}

export function solveAuction(
  B: number,
  N: number,
  bids: Bid[],
  bidPen: Int32Array[],
  conflictOf: number[][],
  itemSets: Uint8Array[],
  available: boolean[],
  forced: boolean[],
): number {
  const forcedList = Array.from({ length: B }, (_, i) => i).filter(
    (i) => forced[i],
  );

  const forbidden = new Uint8Array(B);
  const usedItems = new Uint8Array(N);
  let baseScore = 0;

  for (const fi of forcedList) {
    baseScore += bids[fi].price;
    for (const it of bids[fi].items) usedItems[it] = 1;
    forbidden[fi] = 1;
  }

  for (let a = 0; a < forcedList.length; a++) {
    for (let b2 = a + 1; b2 < forcedList.length; b2++) {
      baseScore -= bidPen[forcedList[a]][forcedList[b2]];
    }
  }

  for (let i = 0; i < B; i++) {
    if (!available[i] || forced[i]) forbidden[i] = 1;
  }

  const candidates = Array.from({ length: B }, (_, i) => i)
    .filter((i) => !forbidden[i])
    .sort((a, b2) => bids[b2].price - bids[a].price);

  if (candidates.length === 0) return baseScore;

  const candPos = new Int32Array(B).fill(-1);
  for (let ci = 0; ci < candidates.length; ci++) candPos[candidates[ci]] = ci;

  const M = candidates.length;

  const density = new Float64Array(M);
  for (let ci = 0; ci < M; ci++) {
    density[ci] =
      bids[candidates[ci]].price / bids[candidates[ci]].items.length;
  }

  const itemCands: number[][] = Array.from({ length: N }, () => []);
  for (let ci = 0; ci < M; ci++) {
    for (const it of bids[candidates[ci]].items) {
      itemCands[it].push(ci);
    }
  }
  for (let it = 0; it < N; it++) {
    itemCands[it].sort((a, b2) => density[b2] - density[a]);
  }

  const sufSum = new Float64Array(M + 1);
  for (let i = M - 1; i >= 0; i--)
    sufSum[i] = sufSum[i + 1] + bids[candidates[i]].price;

  const forb2 = new Uint8Array(M);
  const usedItems2 = new Uint8Array(N);
  const freeWinners: number[] = [];
  let freeScore = 0;

  function lpRelaxUB(idx: number): number {
    let ub = 0;
    for (let it = 0; it < N; it++) {
      if (usedItems[it] || usedItems2[it]) continue;
      const cands = itemCands[it];
      for (let k = 0; k < cands.length; k++) {
        const ci = cands[k];
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
    for (let k = 0; k < N; k++) if (usedItems[k]) tempUsed[k] = 1;
    const tempWinners: number[] = [...forcedList];

    for (let ci = 0; ci < M; ci++) {
      const bid = candidates[ci];
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

      score += bids[bid].price;
      for (const w of tempWinners) score -= bidPen[bid][w];
      for (const it of bids[bid].items) tempUsed[it] = 1;
      tempWinners.push(bid);
    }
    return score;
  }

  let best = greedySeed();
  if (best < baseScore) best = baseScore;

  function bb(idx: number): void {
    if (baseScore + freeScore + sufSum[idx] <= best) return;
    if (lpRelaxUB(idx) <= best) return;

    if (idx === M) {
      const score = baseScore + freeScore;
      if (score > best) best = score;
      return;
    }

    const ci = idx;
    const bid = candidates[ci];

    if (!forb2[ci]) {
      const closureInFree: number[] = [];
      let closureValid = true;

      for (const dep of bids[bid].closure) {
        if (dep === bid) continue;
        if (forced[dep]) continue;

        const dci = candPos[dep];
        if (dci === -1 || forb2[dci]) {
          closureValid = false;
          break;
        }
        for (const it of bids[dep].items) {
          if (usedItems[it] || usedItems2[it]) {
            closureValid = false;
            break;
          }
        }
        if (!closureValid) break;
        closureInFree.push(dci);
      }

      for (const it of bids[bid].items) {
        if (usedItems[it] || usedItems2[it]) {
          closureValid = false;
          break;
        }
      }

      if (closureValid) {
        const toInclude = [ci, ...closureInFree];
        const savedForbidden: number[] = [];
        let penaltyAdded = 0;

        for (const tci of toInclude) {
          const tb = candidates[tci];
          for (const fw of forcedList) penaltyAdded += bidPen[tb][fw];
          for (const fw of freeWinners) penaltyAdded += bidPen[tb][fw];

          freeScore += bids[tb].price;
          for (const it of bids[tb].items) usedItems2[it] = 1;
          freeWinners.push(tb);
          forb2[tci] = 1;

          for (const cj of conflictOf[tb]) {
            const cjci = candPos[cj];
            if (cjci !== -1 && !forb2[cjci]) {
              forb2[cjci] = 1;
              savedForbidden.push(cjci);
            }
          }
        }

        freeScore -= penaltyAdded;
        bb(idx + 1);

        freeScore += penaltyAdded;
        for (let k = toInclude.length - 1; k >= 0; k--) {
          const tci2 = toInclude[k];
          const tb = candidates[tci2];
          freeWinners.pop();
          freeScore -= bids[tb].price;
          for (const it of bids[tb].items) usedItems2[it] = 0;
          forb2[tci2] = 0;
        }
        for (const cjci of savedForbidden) forb2[cjci] = 0;
      }
    }

    bb(idx + 1);
  }

  bb(0);
  return best;
}

export function solve(input: string): number {
  const { B, N, bids, bidPen, conflictOf, itemSets } = parse(input);

  const available = new Array(B).fill(true);
  const forced = new Array(B).fill(false);

  return solveAuction(
    B,
    N,
    bids,
    bidPen,
    conflictOf,
    itemSets,
    available,
    forced,
  );
}
