interface Edge {
    a: number;
    b: number;
    w: number;
}

function parse(input: string): { N: number; M: number; edges: Edge[] } {
    const tok = input.trim().split(/\s+/);
    let p = 0;
    const N = Number(tok[p++]);
    const M = Number(tok[p++]);
    const edges: Edge[] = new Array(M);
    for (let i = 0; i < M; i++) {
        const a = Number(tok[p++]);
        const b = Number(tok[p++]);
        const w = Number(tok[p++]);
        edges[i] = { a, b, w };
    }
    return { N, M, edges };
}

const INF = 0x3fffffff;

class MinHeap {
    private d: number[] = [];
    private n: number[] = [];
    size = 0;

    clear() {
        this.d.length = 0;
        this.n.length = 0;
        this.size = 0;
    }

    push(dist: number, node: number) {
        let i = this.size++;
        this.d[i] = dist;
        this.n[i] = node;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.d[p] <= dist) break;
            this.d[i] = this.d[p];
            this.n[i] = this.n[p];
            i = p;
        }
        this.d[i] = dist;
        this.n[i] = node;
    }

    pop(): [number, number] {
        const dist = this.d[0];
        const node = this.n[0];
        const lastD = this.d[--this.size];
        const lastN = this.n[this.size];
        if (this.size > 0) {
            let i = 0;
            while (true) {
                let l = i * 2 + 1;
                if (l >= this.size) break;
                let r = l + 1;
                let c = r < this.size && this.d[r] < this.d[l] ? r : l;
                if (this.d[c] >= lastD) break;
                this.d[i] = this.d[c];
                this.n[i] = this.n[c];
                i = c;
            }
            this.d[i] = lastD;
            this.n[i] = lastN;
        }
        return [dist, node];
    }
}

function kosarajuSCC(N: number, adj: number[][], radj: number[][]): { sccId: Int32Array; sccCount: number } {
    const order: number[] = [];
    const seen = new Uint8Array(N);

    for (let i = 0; i < N; i++) {
        if (seen[i]) continue;
        const stack: number[] = [i];
        const itStack: number[] = [0];
        seen[i] = 1;

        while (stack.length > 0) {
            const u = stack[stack.length - 1];
            let it = itStack[itStack.length - 1];

            if (it >= adj[u].length) {
                stack.pop();
                itStack.pop();
                order.push(u);
                continue;
            }

            const v = adj[u][it];
            itStack[itStack.length - 1] = it + 1;
            if (!seen[v]) {
                seen[v] = 1;
                stack.push(v);
                itStack.push(0);
            }
        }
    }

    const sccId = new Int32Array(N).fill(-1);
    let sccCount = 0;

    for (let idx = order.length - 1; idx >= 0; idx--) {
        const start = order[idx];
        if (sccId[start] !== -1) continue;

        const q: number[] = [start];
        sccId[start] = sccCount;

        for (let qi = 0; qi < q.length; qi++) {
            const u = q[qi];
            for (const v of radj[u]) {
                if (sccId[v] === -1) {
                    sccId[v] = sccCount;
                    q.push(v);
                }
            }
        }

        sccCount++;
    }

    return { sccId, sccCount };
}

function minCycleInSCC(nodes: number[], sccId: Int32Array, adjW: { to: number; w: number }[][]): number {
    if (nodes.length < 2) return 0;

    const heap = new MinHeap();
    const dist = new Int32Array(sccId.length);
    const seen = new Int32Array(sccId.length);
    let stamp = 1;

    function get(u: number): number {
        return seen[u] === stamp ? dist[u] : INF;
    }
    function set(u: number, val: number) {
        seen[u] = stamp;
        dist[u] = val;
    }

    const scc = sccId[nodes[0]];
    let best = INF;

    for (const s of nodes) {
        stamp++;
        heap.clear();
        set(s, 0);
        heap.push(0, s);

        while (heap.size > 0) {
            const [d, u] = heap.pop();
            if (d !== get(u)) continue;

            for (const e of adjW[u]) {
                if (sccId[e.to] !== scc) continue;
                const nd = d + e.w;
                if (e.to === s) {
                    if (nd < best) best = nd;
                } else if (nd < get(e.to)) {
                    set(e.to, nd);
                    heap.push(nd, e.to);
                }
            }
        }
    }

    return best >= INF ? 0 : best;
}

export function solve(input: string): number {
    const { N, M, edges } = parse(input);

    const adj: number[][] = Array.from({ length: N }, () => []);
    const radj: number[][] = Array.from({ length: N }, () => []);
    const adjW: { to: number; w: number }[][] = Array.from({ length: N }, () => []);

    for (const { a, b, w } of edges) {
        adj[a].push(b);
        radj[b].push(a);
        adjW[a].push({ to: b, w });
    }

    const { sccId, sccCount: S } = kosarajuSCC(N, adj, radj);

    const sccNodes: number[][] = Array.from({ length: S }, () => []);
    for (let u = 0; u < N; u++) sccNodes[sccId[u]].push(u);

    const weight = new Int32Array(S);
    for (let s = 0; s < S; s++) {
        weight[s] = minCycleInSCC(sccNodes[s], sccId, adjW);
    }

    const condSets: Set<number>[] = Array.from({ length: S }, () => new Set<number>());
    for (const { a, b } of edges) {
        const sa = sccId[a], sb = sccId[b];
        if (sa !== sb) condSets[sa].add(sb);
    }
    const condAdj: number[][] = Array.from({ length: S }, (_, i) => Array.from(condSets[i]).sort((x, y) => x - y));

    const inDeg = new Int32Array(S);
    for (let u = 0; u < S; u++) {
        for (const v of condAdj[u]) inDeg[v]++;
    }
    const queue: number[] = [];
    for (let u = 0; u < S; u++) if (inDeg[u] === 0) queue.push(u);

    const topo: number[] = [];
    for (let qi = 0; qi < queue.length; qi++) {
        const u = queue[qi];
        topo.push(u);
        for (const v of condAdj[u]) {
            if (--inDeg[v] === 0) queue.push(v);
        }
    }

    const bestLen = new Int32Array(S).fill(1);
    const bestSum = new Int32Array(S);
    for (let s = 0; s < S; s++) bestSum[s] = weight[s];

    for (const u of topo) {
        for (const v of condAdj[u]) {
            const candLen = bestLen[u] + 1;
            const candSum = bestSum[u] + weight[v];
            if (candLen > bestLen[v] || (candLen === bestLen[v] && candSum > bestSum[v])) {
                bestLen[v] = candLen;
                bestSum[v] = candSum;
            }
        }
    }

    let maxLen = 0;
    for (let s = 0; s < S; s++) if (bestLen[s] > maxLen) maxLen = bestLen[s];

    let ans = 0;
    for (let s = 0; s < S; s++) {
        if (bestLen[s] === maxLen && bestSum[s] > ans) ans = bestSum[s];
    }

    if (!Number.isSafeInteger(ans) || ans < 0) {
        throw new Error(`Invalid Part 2 answer: ${ans}`);
    }
    return ans;
}
