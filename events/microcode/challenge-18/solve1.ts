export function solve(input: string): number {
    const lines = input.trim().split('\n');
    const header = lines[0].split(/\s+/).map(Number);
    const N = header[0];
    const K = header[1];
    const allValues = lines[1].split(/\s+/).map(Number);
    const values = allValues.slice(0, N);

    const prefix = new Float64Array(N + 1);
    for (let i = 0; i < N; i++) {
        prefix[i + 1] = prefix[i] + values[i];
    }

    function segCost(l: number, r: number): number {
        const s = prefix[r + 1] - prefix[l];
        return s * s;
    }

    const INF = Number.MAX_SAFE_INTEGER;

    let prev = new Float64Array(N + 1).fill(INF);
    let curr = new Float64Array(N + 1).fill(INF);

    for (let i = 1; i <= N; i++) {
        prev[i] = segCost(0, i - 1);
    }

    for (let k = 2; k <= K; k++) {
        curr.fill(INF);
        for (let i = k; i <= N; i++) {
            for (let j = k - 1; j <= i - 1; j++) {
                const cost = prev[j] + segCost(j, i - 1);
                if (cost < curr[i]) {
                    curr[i] = cost;
                }
            }
        }
        [prev, curr] = [curr, prev];
    }

    return prev[N];
}
