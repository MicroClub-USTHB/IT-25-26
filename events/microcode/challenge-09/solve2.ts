import { parse } from "./solve1";

function toroidalDist(r1: number, c1: number, r2: number, c2: number, rows: number, cols: number): number {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return Math.min(dr, rows - dr) + Math.min(dc, cols - dc);
}

function weightedASCII(str: string): number {
    let sum = 0;
    for (let k = 0; k < str.length; k++) sum += str.charCodeAt(k) * (k + 1);
    return sum;
}

export function solve(input: string): number {
    const { word, target, rows, cols, matrix1 } = parse(input);

    const n = word.length;
    const uniqueChars = new Set(word.split(""));
    const charPositions = new Map<string, Array<[number, number]>>();
    for (const ch of uniqueChars) charPositions.set(ch, []);

    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const ch = matrix1[r][c];
            const list = charPositions.get(ch);
            if (list) list.push([r, c]);
        }
    }

    const candidates: Array<Array<[number, number]>> = new Array(n);
    for (let i = 0; i < n; i++) {
        const list = charPositions.get(word[i]);
        if (!list || list.length === 0) throw new Error("No solution found");
        candidates[i] = list;
    }

    const minS = new Array(n + 1).fill(0);
    const maxS = new Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let minDiff = Infinity, maxDiff = -Infinity;
        for (const [r, c] of candidates[i]) {
            const d = r - c;
            if (d < minDiff) minDiff = d;
            if (d > maxDiff) maxDiff = d;
        }
        if (!Number.isFinite(minDiff) || !Number.isFinite(maxDiff)) throw new Error("No solution found");
        minS[i] = minDiff + minS[i + 1];
        maxS[i] = maxDiff + maxS[i + 1];
    }

    const coords: Array<[number, number]> = new Array(n);
    function bt(i: number, sumSoFar: number, prevCol: number): boolean {
        if (i === n) return sumSoFar === target;
        const need = target - sumSoFar;
        if (need < minS[i] || need > maxS[i]) return false;

        const cand = candidates[i];
        let lo = 0, hi = cand.length - 1, start = cand.length;
        while (lo <= hi) {
            const mid = (lo + hi) >>> 1;
            if (cand[mid][1] > prevCol) { start = mid; hi = mid - 1; }
            else lo = mid + 1;
        }

        for (let j = start; j < cand.length; j++) {
            const [r, c] = cand[j];
            coords[i] = [r, c];
            if (bt(i + 1, sumSoFar + (r - c), c)) return true;
        }
        return false;
    }

    if (!bt(0, 0, -1)) throw new Error("No solution found");

    const occ = new Map<string, Array<[number, number]>>();
    for (let r = 0; r < rows; r++) {
        const row = matrix1[r];
        for (let c = 0; c < cols; c++) {
            const ch = row[c];
            let list = occ.get(ch);
            if (!list) { list = []; occ.set(ch, list); }
            list.push([r, c]);
        }
    }

    let payload = "";

    for (let i = 0; i < n; i++) {
        const X = word[i];
        const [sr, sc] = coords[i];

        const list = occ.get(X) || [];
        let bestDist = Infinity;
        let bestR = -1;
        let bestC = -1;

        for (const [r, c] of list) {
            if (r === sr && c === sc) continue;
            if (c === 0 || c === cols - 1) continue;

            const d = toroidalDist(sr, sc, r, c, rows, cols);
            if (d < bestDist) {
                bestDist = d; bestR = r; bestC = c;
            } else if (d === bestDist) {
                if (r < bestR || (r === bestR && c < bestC)) { bestR = r; bestC = c; }
            }
        }

        if (bestR === -1) throw new Error(`No valid twin found for '${X}' at step ${i}`);
        payload += matrix1[bestR][bestC - 1] + matrix1[bestR][bestC + 1];
    }

    return weightedASCII(payload);
}
