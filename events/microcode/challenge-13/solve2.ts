const MOD = 1000000009n;

interface Interval { min: bigint; max: bigint; evenOnly: boolean; }
interface Box { mode: number; x: Interval; y: Interval; z: Interval; }
interface RawOp { mode: number; x1: bigint; x2: bigint; y1: bigint; y2: bigint; z1: bigint; z2: bigint; alive: boolean; }

function parseInput(input: string): { ops: RawOp[]; queries: string[] } {
    const lines = input.trim().split('\n');
    const m = parseInt(lines[0], 10);
    const ops: RawOp[] = [];
    for (let i = 1; i <= m; i++) {
        const line = lines[i].trim();
        const parts = line.split(' ');
        const mode = parseInt(parts[0], 10);
        const coords = parts[1].split(',');
        const [x1, x2] = coords[0].split('..').map(BigInt);
        const [y1, y2] = coords[1].split('..').map(BigInt);
        const [z1, z2] = coords[2].split('..').map(BigInt);
        ops.push({
            mode, alive: true,
            x1: x1 < x2 ? x1 : x2, x2: x1 > x2 ? x1 : x2,
            y1: y1 < y2 ? y1 : y2, y2: y1 > y2 ? y1 : y2,
            z1: z1 < z2 ? z1 : z2, z2: z1 > z2 ? z1 : z2,
        });
    }
    const qLine = m + 1;
    const Q = parseInt(lines[qLine], 10);
    const queries: string[] = [];
    for (let i = 0; i < Q; i++) {
        queries.push(lines[qLine + 1 + i].trim());
    }
    return { ops, queries };
}

function opToBox(op: RawOp): Box {
    if (op.mode === 0) {
        return {
            mode: 0,
            x: { min: -op.y2, max: -op.y1, evenOnly: false },
            y: { min: op.x1, max: op.x2, evenOnly: false },
            z: { min: op.z1, max: op.z2, evenOnly: false }
        };
    } else if (op.mode === 1) {
        return {
            mode: 1,
            x: { min: op.x1 * 2n, max: op.x2 * 2n, evenOnly: true },
            y: { min: op.y1 * 2n, max: op.y2 * 2n, evenOnly: true },
            z: { min: op.z1 * 2n, max: op.z2 * 2n, evenOnly: true }
        };
    } else {
        return {
            mode: 2,
            x: { min: op.z1, max: op.z2, evenOnly: false },
            y: { min: op.y1, max: op.y2, evenOnly: false },
            z: { min: op.x1, max: op.x2, evenOnly: false }
        };
    }
}

function sumSquaresPositive(n: bigint): bigint {
    if (n <= 0n) return 0n;
    return (n * (n + 1n) * (2n * n + 1n)) / 6n;
}

function sumSqRange(a: bigint, b: bigint): bigint {
    if (a > b) return 0n;
    if (b <= 0n) return sumSquaresPositive(-a) - sumSquaresPositive(-b - 1n);
    if (a < 0n) return sumSquaresPositive(-a) + sumSquaresPositive(b);
    return sumSquaresPositive(b) - sumSquaresPositive(a - 1n);
}

function getIntervalStats(i: Interval): { count: bigint; sumSq: bigint } {
    if (i.min > i.max) return { count: 0n, sumSq: 0n };
    if (i.evenOnly) {
        const L = i.min / 2n;
        const R = i.max / 2n;
        return { count: R - L + 1n, sumSq: 4n * sumSqRange(L, R) };
    }
    return { count: i.max - i.min + 1n, sumSq: sumSqRange(i.min, i.max) };
}

function getBoxSum(b: Box | null): bigint {
    if (!b) return 0n;
    const sx = getIntervalStats(b.x);
    const sy = getIntervalStats(b.y);
    const sz = getIntervalStats(b.z);
    if (sx.count === 0n || sy.count === 0n || sz.count === 0n) return 0n;
    return sx.sumSq * sy.count * sz.count
         + sy.sumSq * sx.count * sz.count
         + sz.sumSq * sx.count * sy.count;
}

function intersectInterval(a: Interval, b: Interval): Interval | null {
    let min = a.min > b.min ? a.min : b.min;
    let max = a.max < b.max ? a.max : b.max;
    const evenOnly = a.evenOnly || b.evenOnly;
    if (evenOnly) {
        if (min % 2n !== 0n) min += 1n;
        if (max % 2n !== 0n) max -= 1n;
    }
    if (min > max) return null;
    return { min, max, evenOnly };
}

function intersectBox(a: Box, b: Box): Box | null {
    const x = intersectInterval(a.x, b.x);
    const y = intersectInterval(a.y, b.y);
    const z = intersectInterval(a.z, b.z);
    if (!x || !y || !z) return null;
    return { mode: -1, x, y, z };
}

function intersectBox3(a: Box, b: Box, c: Box): Box | null {
    const ab = intersectBox(a, b);
    if (!ab) return null;
    return intersectBox(ab, c);
}

function solveUnique(ops: RawOp[]): bigint {
    const alive = ops.filter(o => o.alive);
    const boxes = alive.map(opToBox);

    const A = boxes.filter(b => b.mode === 0).sort((a, b) => Number(a.z.min - b.z.min));
    const B = boxes.filter(b => b.mode === 1).sort((a, b) => Number(a.z.min - b.z.min));
    const C = boxes.filter(b => b.mode === 2).sort((a, b) => Number(a.z.min - b.z.min));

    let total = 0n;
    for (const b of boxes) total += getBoxSum(b);

    const getPairs = (arr1: Box[], arr2: Box[]) => {
        let sum = 0n;
        let i = 0, j = 0;
        while (i < arr1.length && j < arr2.length) {
            if (arr1[i].z.max < arr2[j].z.min) { i++; }
            else if (arr2[j].z.max < arr1[i].z.min) { j++; }
            else {
                sum += getBoxSum(intersectBox(arr1[i], arr2[j]));
                if (arr1[i].z.max < arr2[j].z.max) i++; else j++;
            }
        }
        return sum;
    };

    total -= getPairs(A, B);
    total -= getPairs(A, C);
    total -= getPairs(B, C);

    let i = 0, j = 0, k = 0;
    while (i < A.length && j < B.length && k < C.length) {
        let maxMin = A[i].z.min;
        if (B[j].z.min > maxMin) maxMin = B[j].z.min;
        if (C[k].z.min > maxMin) maxMin = C[k].z.min;

        let minMax = A[i].z.max;
        if (B[j].z.max < minMax) minMax = B[j].z.max;
        if (C[k].z.max < minMax) minMax = C[k].z.max;

        if (maxMin <= minMax) {
            total += getBoxSum(intersectBox3(A[i], B[j], C[k]));
        }

        if (A[i].z.max === minMax) i++;
        else if (B[j].z.max === minMax) j++;
        else k++;
    }

    return total;
}

function applyQuery(ops: RawOp[], query: string): void {
    const parts = query.split(' ');
    const type = parts[0];
    const idx = parseInt(parts[1], 10);

    if (type === 'D') {
        ops[idx].alive = false;
    } else if (type === 'R') {
        const coords = parts[2].split(',');
        const [x1, x2] = coords[0].split('..').map(BigInt);
        const [y1, y2] = coords[1].split('..').map(BigInt);
        const [z1, z2] = coords[2].split('..').map(BigInt);
        ops[idx].x1 = x1 < x2 ? x1 : x2;
        ops[idx].x2 = x1 > x2 ? x1 : x2;
        ops[idx].y1 = y1 < y2 ? y1 : y2;
        ops[idx].y2 = y1 > y2 ? y1 : y2;
        ops[idx].z1 = z1 < z2 ? z1 : z2;
        ops[idx].z2 = z1 > z2 ? z1 : z2;
    }
}

export function solve(input: string): number {
    const { ops, queries } = parseInput(input);
    let sum = 0n;

    for (const query of queries) {
        applyQuery(ops, query);
        const energy = solveUnique(ops);
        sum += ((energy % MOD) + MOD) % MOD;
    }

    sum = ((sum % MOD) + MOD) % MOD;
    return Number(sum);
}
