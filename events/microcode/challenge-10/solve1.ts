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

const INF = 0x3fffffff;

export function solve(input: string): number {
    const { N, M, edges } = parse(input);

    const head = new Int32Array(N).fill(-1);
    const to = new Int32Array(M);
    const w = new Int32Array(M);
    const next = new Int32Array(M);
    const src = new Int32Array(M);

    for (let i = 0; i < M; i++) {
        src[i] = edges[i].a;
        to[i] = edges[i].b;
        w[i] = edges[i].w;
        next[i] = head[src[i]];
        head[src[i]] = i;
    }

    const distAll = new Int32Array(N * N);
    distAll.fill(INF);

    const heap = new MinHeap();
    const distTmp = new Int32Array(N);
    const seen = new Int32Array(N);
    let stamp = 1;

    function getDist(u: number): number {
        return seen[u] === stamp ? distTmp[u] : INF;
    }
    function setDist(u: number, val: number) {
        seen[u] = stamp;
        distTmp[u] = val;
    }

    for (let s = 0; s < N; s++) {
        stamp++;
        heap.clear();
        setDist(s, 0);
        heap.push(0, s);

        while (heap.size > 0) {
            const [d, u] = heap.pop();
            if (d !== getDist(u)) continue;
            for (let ei = head[u]; ei !== -1; ei = next[ei]) {
                const v = to[ei];
                const nd = d + w[ei];
                if (nd < getDist(v)) {
                    setDist(v, nd);
                    heap.push(nd, v);
                }
            }
        }

        const base = s * N;
        for (let v = 0; v < N; v++) {
            const dv = getDist(v);
            if (dv < INF) distAll[base + v] = dv;
        }
    }

    const dist2 = new Int32Array(N);
    const seen2 = new Int32Array(N);
    let stamp2 = 1;

    function get2(u: number): number {
        return seen2[u] === stamp2 ? dist2[u] : INF;
    }
    function set2(u: number, val: number) {
        seen2[u] = stamp2;
        dist2[u] = val;
    }

    function dijkstraSkipEdge(s: number, t: number, skipEi: number): number {
        stamp2++;
        heap.clear();
        set2(s, 0);
        heap.push(0, s);

        while (heap.size > 0) {
            const [d, u] = heap.pop();
            if (d !== get2(u)) continue;
            if (u === t) return d;
            for (let ei = head[u]; ei !== -1; ei = next[ei]) {
                if (ei === skipEi) continue;
                const v = to[ei];
                const nd = d + w[ei];
                if (nd < get2(v)) {
                    set2(v, nd);
                    heap.push(nd, v);
                }
            }
        }
        return INF;
    }

    let best = INF;

    for (let ei = 0; ei < M; ei++) {
        const u = src[ei];
        const v = to[ei];
        const ww = w[ei];

        const back = distAll[v * N + u];
        if (back < INF) {
            const cand = ww + back;
            if (cand < best) best = cand;
        }

        const d0 = distAll[u * N + v];
        if (d0 >= INF) continue;

        let dNoEdge = d0;

        if (d0 === ww) {
            dNoEdge = dijkstraSkipEdge(u, v, ei);
        }

        if (dNoEdge < INF) {
            const cand = ww + dNoEdge;
            if (cand < best) best = cand;
        }
    }

    if (best >= INF) throw new Error("No directed cycle found (even with one reversal)");

    if (!Number.isSafeInteger(best) || best <= 0) {
        throw new Error(`Invalid Part 1 answer: ${best}`);
    }
    return best;
}
