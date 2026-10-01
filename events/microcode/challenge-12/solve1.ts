export function solve(input: string): number {
  const lines = input.split("\n");
  const [N] = lines[0].split(" ").map(Number);
  const rootIds = lines[1].split(" ").map(Number);
  const rootSet = new Set(rootIds);

  const alive = new Uint8Array(N);
  const rc = new Int32Array(N);
  const sz = new Int32Array(N);
  const outgoing: Set<number>[] = new Array(N);

  function freeObj(id: number): void {
    alive[id] = 0;
    for (const target of outgoing[id]) {
      if (!alive[target]) continue;
      rc[target]--;
      if (rc[target] === 0) freeObj(target);
    }
    outgoing[id].clear();
  }

  for (let i = 2; i < 2 + N + (lines.length - 2 - N); i++) {
    const line = lines[i];
    const parts = line.split(" ");
    const op = parts[0];

    if (op === "ALLOC") {
      const id = +parts[1];
      const size = +parts[2];
      alive[id] = 1;
      sz[id] = size;
      rc[id] = rootSet.has(id) ? 1 : 0;
      outgoing[id] = new Set();
    } else if (op === "REF") {
      const src = +parts[1],
        dst = +parts[2];
      if (!alive[src] || !alive[dst]) continue;
      if (outgoing[src].has(dst)) continue;
      outgoing[src].add(dst);
      rc[dst]++;
    } else if (op === "DELREF") {
      const src = +parts[1],
        dst = +parts[2];
      if (!alive[src] || !alive[dst]) continue;
      if (!outgoing[src].has(dst)) continue;
      outgoing[src].delete(dst);
      rc[dst]--;
      if (rc[dst] === 0) freeObj(dst);
    } else if (op === "ADDROOT") {
      const id = +parts[1];
      if (!alive[id]) continue;
      rc[id]++;
    } else if (op === "DELROOT") {
      const id = +parts[1];
      if (!alive[id]) continue;
      rc[id]--;
      if (rc[id] === 0) freeObj(id);
    }
  }

  let total = 0;
  for (let i = 0; i < N; i++) {
    if (alive[i]) total += sz[i];
  }
  return total;
}
