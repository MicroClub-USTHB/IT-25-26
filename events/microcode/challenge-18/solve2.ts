export function solve(input: string): number {
    const lines = input.trim().split('\n');
    const header = lines[0].split(/\s+/).map(Number);
    const N = header[2];
    const K = header[3];
    const values = lines[1].split(/\s+/).map(Number);

    const prefix = new Float64Array(N + 1);
    for (let i = 0; i < N; i++) {
        prefix[i + 1] = prefix[i] + values[i];
    }

    const INF = 1e18;

    let prev = new Float64Array(N + 1).fill(INF);
    let curr = new Float64Array(N + 1).fill(INF);

    for (let i = 1; i <= N; i++) {
        const s = prefix[i];
        prev[i] = s * s;
    }

    const stack: [number, number, number, number][] = [];

    for (let k = 2; k <= K; k++) {
        curr.fill(INF);

        stack.length = 0;
        stack.push([k, N, k - 1, N - 1]);

        while (stack.length > 0) {
            const [lo, hi, optLo, optHi] = stack.pop()!;
            if (lo > hi) continue;

            const mid = (lo + hi) >> 1;
            let bestCost = INF;
            let bestJ = optLo;

            const jEnd = Math.min(mid - 1, optHi);
            for (let j = optLo; j <= jEnd; j++) {
                const s = prefix[mid] - prefix[j];
                const cost = prev[j] + s * s;
                if (cost < bestCost) {
                    bestCost = cost;
                    bestJ = j;
                }
            }

            curr[mid] = bestCost;

            stack.push([mid + 1, hi, bestJ, optHi]);
            stack.push([lo, mid - 1, optLo, bestJ]);
        }

        const tmp = prev;
        prev = curr;
        curr = tmp;
    }

    return prev[N];
}
