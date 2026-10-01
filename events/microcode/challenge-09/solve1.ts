interface Puzzle {
    word: string;
    target: number;
    rows: number;
    cols: number;
    matrix1: string[];
}

export function parse(input: string): Puzzle {
    const lines = input.split(/\r?\n/);

    let word = "";
    let target: number | null = null;
    let matrixStart = -1;

    for (let i = 0; i < lines.length; i++) {
        const l = lines[i].trim();
        if (l.startsWith("WORD:")) word = l.slice(5).trim();
        else if (l.startsWith("TARGET:")) target = parseInt(l.slice(7).trim(), 10);
        else if (l.startsWith("MATRIX:")) {
            matrixStart = i + 1;
            break;
        }
    }

    if (!word || target === null || matrixStart === -1) {
        throw new Error("Could not parse puzzle input");
    }
    if (!Number.isSafeInteger(target)) {
        throw new Error("Invalid header values");
    }

    const matrix1 = lines.slice(matrixStart).filter(l => l.length > 0);
    const rows = matrix1.length;
    const cols = matrix1[0]?.length ?? 0;

    if (rows === 0 || cols === 0) throw new Error("Empty matrix");
    for (let r = 0; r < rows; r++) {
        if (matrix1[r].length !== cols) throw new Error(`Matrix col length mismatch at row ${r}`);
    }

    return { word, target, rows, cols, matrix1 };
}

function computeHash(solution: Array<[number, number]>): number {
    let sum = 0;
    for (const [r, c] of solution) sum += (r + 1) * (c + 1);
    return sum;
}

function solveCore(word: string, matrix: string[], target: number, rows: number, cols: number): Array<[number, number]> | null {
    const n = word.length;

    const uniqueChars = new Set(word.split(""));
    const charPositions = new Map<string, Array<[number, number]>>();
    for (const ch of uniqueChars) charPositions.set(ch, []);

    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const ch = matrix[r][c];
            const list = charPositions.get(ch);
            if (list) list.push([r, c]);
        }
    }

    const candidates: Array<Array<[number, number]>> = new Array(n);
    for (let i = 0; i < n; i++) {
        const list = charPositions.get(word[i]);
        if (!list || list.length === 0) return null;
        candidates[i] = list;
    }

    const minS = new Array(n + 1).fill(0);
    const maxS = new Array(n + 1).fill(0);

    for (let i = n - 1; i >= 0; i--) {
        let minDiff = Infinity;
        let maxDiff = -Infinity;
        for (const [r, c] of candidates[i]) {
            const d = r - c;
            if (d < minDiff) minDiff = d;
            if (d > maxDiff) maxDiff = d;
        }
        if (!Number.isFinite(minDiff) || !Number.isFinite(maxDiff)) return null;
        minS[i] = minDiff + minS[i + 1];
        maxS[i] = maxDiff + maxS[i + 1];
    }

    const result: Array<[number, number]> = new Array(n);

    function bt(i: number, sumSoFar: number, prevCol: number): boolean {
        if (i === n) return sumSoFar === target;

        const need = target - sumSoFar;
        if (need < minS[i] || need > maxS[i]) return false;

        const cand = candidates[i];
        let lo = 0, hi = cand.length - 1;
        let start = cand.length;
        while (lo <= hi) {
            const mid = (lo + hi) >>> 1;
            if (cand[mid][1] > prevCol) { start = mid; hi = mid - 1; }
            else lo = mid + 1;
        }

        for (let j = start; j < cand.length; j++) {
            const [r, c] = cand[j];
            result[i] = [r, c];
            if (bt(i + 1, sumSoFar + (r - c), c)) return true;
        }
        return false;
    }

    return bt(0, 0, -1) ? result : null;
}

export function solve(input: string): number {
    const { word, target, rows, cols, matrix1 } = parse(input);
    const sol = solveCore(word, matrix1, target, rows, cols);
    if (!sol) throw new Error("No solution found");
    return computeHash(sol);
}
