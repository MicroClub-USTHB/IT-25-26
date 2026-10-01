type Pos = [number, number];

const HEX_PAD: Record<string, Pos> = {
    '0': [0, 0], '1': [0, 1], '2': [0, 2],
    '3': [1, 0], '4': [1, 1], '5': [1, 2],
    '6': [2, 0], '7': [2, 1], '8': [2, 2],
    '9': [3, 0], 'A': [3, 1], 'B': [3, 2],
    'C': [4, 0], 'D': [4, 1], 'E': [4, 2],
    'F': [5, 1], '#': [5, 2],
};
const HEX_GAP: Pos = [5, 0];

const DIR_PAD: Record<string, Pos> = {
    '^': [0, 1], '#': [0, 2],
    '<': [1, 0], 'v': [1, 1], '>': [1, 2],
};
const DIR_GAP: Pos = [0, 0];

function allShortestPaths(from: Pos, to: Pos, gap: Pos): string[] {
    const dr = to[0] - from[0];
    const dc = to[1] - from[1];

    const vertMoves = dr > 0 ? 'v'.repeat(dr) : '^'.repeat(-dr);
    const horizMoves = dc > 0 ? '>'.repeat(dc) : '<'.repeat(-dc);

    if (dr === 0 && dc === 0) return ['#'];
    if (dr === 0) return [horizMoves + '#'];
    if (dc === 0) return [vertMoves + '#'];

    const allMoves = vertMoves + horizMoves;
    const perms = uniquePermutations(allMoves);

    const valid: string[] = [];
    for (const perm of perms) {
        if (!passesThrough(from, perm, gap)) {
            valid.push(perm + '#');
        }
    }
    return valid;
}

function passesThrough(start: Pos, moves: string, gap: Pos): boolean {
    let r = start[0], c = start[1];
    for (const ch of moves) {
        if (ch === '^') r--;
        else if (ch === 'v') r++;
        else if (ch === '<') c--;
        else if (ch === '>') c++;
        if (r === gap[0] && c === gap[1]) return true;
    }
    return false;
}

function uniquePermutations(s: string): string[] {
    const chars = s.split('').sort();
    const result: string[] = [];
    const used = new Array(chars.length).fill(false);

    function backtrack(current: string) {
        if (current.length === chars.length) {
            result.push(current);
            return;
        }
        for (let i = 0; i < chars.length; i++) {
            if (used[i]) continue;
            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;
            used[i] = true;
            backtrack(current + chars[i]);
            used[i] = false;
        }
    }
    backtrack('');
    return result;
}

function minPresses(code: string, numDirRobots: number): number {
    const memo = new Map<string, number>();

    function cost(fromKey: string, toKey: string, depth: number): number {
        const key = `${fromKey},${toKey},${depth}`;
        const cached = memo.get(key);
        if (cached !== undefined) return cached;

        const isHex = (depth === 0);
        const pad = isHex ? HEX_PAD : DIR_PAD;
        const gap = isHex ? HEX_GAP : DIR_GAP;

        const fromPos = pad[fromKey];
        const toPos = pad[toKey];
        const paths = allShortestPaths(fromPos, toPos, gap);

        let minCost: number;
        if (depth === numDirRobots) {
            minCost = paths[0].length;
        } else {
            minCost = Infinity;
            for (const path of paths) {
                let pathCost = 0;
                let prev = '#';
                for (const ch of path) {
                    pathCost += cost(prev, ch, depth + 1);
                    prev = ch;
                }
                if (pathCost < minCost) minCost = pathCost;
            }
        }

        memo.set(key, minCost);
        return minCost;
    }

    let total = 0;
    let prev = '#';
    for (const ch of code) {
        total += cost(prev, ch, 0);
        prev = ch;
    }
    return total;
}

export function solve(input: string): number {
    const codes = input.trim().split('\n').filter(line => line.length > 0);
    let totalComplexity = 0;

    for (const code of codes) {
        const hexPart = code.replace('#', '');
        const numericValue = parseInt(hexPart, 16);
        const seqLen = minPresses(code, 2);
        totalComplexity += seqLen * numericValue;
    }

    return totalComplexity;
}
