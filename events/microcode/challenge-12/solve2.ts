import { solve as solvePart1 } from "./solve1";

export function solve(input: string): number {
  const part1Size = solvePart1(input);

  const lines = input.split("\n");
  const [N, , K] = lines[0].split(" ").map(Number);
  const rootIds = lines[1].split(" ").map(Number);

  const alive = new Uint8Array(N);
  const sz = new Int32Array(N);
  const outgoing: Set<number>[] = new Array(N);
  const roots = new Map<number, number>();
  for (const id of rootIds) roots.set(id, (roots.get(id) ?? 0) + 1);

  let nonAllocCount = 0;

  function gc(): void {
    const marked = new Uint8Array(N);
    const queue: number[] = [];
    for (const [id] of roots) {
      if (alive[id] && !marked[id]) {
        marked[id] = 1;
        queue.push(id);
      }
    }
    let head = 0;
    while (head < queue.length) {
      const cur = queue[head++];
      for (const next of outgoing[cur]) {
        if (alive[next] && !marked[next]) {
          marked[next] = 1;
          queue.push(next);
        }
      }
    }
    for (let i = 0; i < N; i++) {
      if (alive[i] && !marked[i]) {
        alive[i] = 0;
        outgoing[i].clear();
      }
    }
  }

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(" ");
    const op = parts[0];

    if (op === "ALLOC") {
      const id = +parts[1];
      const size = +parts[2];
      alive[id] = 1;
      sz[id] = size;
      outgoing[id] = new Set();
    } else if (op === "REF") {
      const src = +parts[1],
        dst = +parts[2];
      if (!alive[src] || !alive[dst]) {
        nonAllocCount++;
        if (nonAllocCount % K === 0) gc();
        continue;
      }
      outgoing[src].add(dst);
      nonAllocCount++;
      if (nonAllocCount % K === 0) gc();
    } else if (op === "DELREF") {
      const src = +parts[1],
        dst = +parts[2];
      if (!alive[src] || !alive[dst]) {
        nonAllocCount++;
        if (nonAllocCount % K === 0) gc();
        continue;
      }
      outgoing[src].delete(dst);
      nonAllocCount++;
      if (nonAllocCount % K === 0) gc();
    } else if (op === "ADDROOT") {
      const id = +parts[1];
      if (alive[id]) {
        roots.set(id, (roots.get(id) ?? 0) + 1);
      }
      nonAllocCount++;
      if (nonAllocCount % K === 0) gc();
    } else if (op === "DELROOT") {
      const id = +parts[1];
      if (alive[id]) {
        const cnt = roots.get(id) ?? 0;
        if (cnt > 1) roots.set(id, cnt - 1);
        else roots.delete(id);
      }
      nonAllocCount++;
      if (nonAllocCount % K === 0) gc();
    }
  }

  let part2Size = 0;
  for (let i = 0; i < N; i++) {
    if (alive[i]) part2Size += sz[i];
  }

  const D = Math.abs(part2Size - part1Size);
  return part2Size * 1_000_000 + D;
}
