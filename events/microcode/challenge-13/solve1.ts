const MOD = 1000000009n;

interface Interval { min: bigint; max: bigint; evenOnly: boolean; }
interface Box { mode: number; x: Interval; y: Interval; z: Interval; }
interface Op { mode: number; x1: bigint; x2: bigint; y1: bigint; y2: bigint; z1: bigint; z2: bigint; }

function parseOps(input: string): Op[] {
    const lines = input.trim().split('\n');
    const m = parseInt(lines[0], 10);
    const ops: Op[] = [];
    for (let i = 1; i <= m && i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(' ');
        const mode = parseInt(parts[0], 10);
        const coords = parts[1].split(',');
        const [x1, x2] = coords[0].split('..').map(BigInt);
        const [y1, y2] = coords[1].split('..').map(BigInt);
        const [z1, z2] = coords[2].split('..').map(BigInt);
        ops.push({
            mode,
            x1: x1 < x2 ? x1 : x2, x2: x1 > x2 ? x1 : x2,
            y1: y1 < y2 ? y1 : y2, y2: y1 > y2 ? y1 : y2,
            z1: z1 < z2 ? z1 : z2, z2: z1 > z2 ? z1 : z2,
        });
    }
    return ops;
}

function opToBox(op: Op): Box {
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

function getBoxSum(b: Box): bigint {
    const sx = getIntervalStats(b.x);
    const sy = getIntervalStats(b.y);
    const sz = getIntervalStats(b.z);
    if (sx.count === 0n || sy.count === 0n || sz.count === 0n) return 0n;
    return sx.sumSq * sy.count * sz.count
         + sy.sumSq * sx.count * sz.count
         + sz.sumSq * sx.count * sy.count;
}

export function solve(input: string): number {
    const ops = parseOps(input);
    const boxes = ops.map(opToBox);
    let total = 0n;
    for (const b of boxes) total += getBoxSum(b);
    total = ((total % MOD) + MOD) % MOD;
    return Number(total);
}
