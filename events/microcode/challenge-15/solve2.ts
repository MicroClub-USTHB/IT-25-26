const MOD_CHECKSUM = 1_000_000_009;
const MOD_K = 1_000_000_007;

const BASE1 = 911_382_323;
const BASE2 = 972_663_749;

function mul32(a: number, b: number): number {
    return Math.imul(a, b) >>> 0;
}

function invOdd32(a: number): number {
    let x = a >>> 0;
    for (let i = 0; i < 5; i++) {
        x = mul32(x, (2 - mul32(a, x)) >>> 0);
    }
    return x >>> 0;
}

class Fenwick32 {
    private n: number;
    private bit: Uint32Array;

    constructor(n: number) {
        this.n = n;
        this.bit = new Uint32Array(n + 2);
    }

    add(idx: number, delta: number): void {
        const n = this.n;
        const bit = this.bit;
        while (idx <= n) {
            bit[idx] = (bit[idx] + delta) >>> 0;
            idx += idx & -idx;
        }
    }

    sum(idx: number): number {
        const bit = this.bit;
        let res = 0;
        while (idx > 0) {
            res = (res + bit[idx]) >>> 0;
            idx -= idx & -idx;
        }
        return res >>> 0;
    }

    range(l: number, r: number): number {
        return (this.sum(r) - this.sum(l - 1)) >>> 0;
    }
}

function isPrime(x: number): boolean {
    if (x < 2) return false;
    if ((x & 1) === 0) return x === 2;
    for (let d = 3; d * d <= x; d += 2) {
        if (x % d === 0) return false;
    }
    return true;
}

function nextPrimeStrictlyGreater(x: number): number {
    let p = x + 1;
    while (!isPrime(p)) p++;
    return p;
}

export function solve(input: string): number {
    const nInput = input.length;
    let p = 0;

    function readInt(): number {
        while (p < nInput) {
            const c = input.charCodeAt(p);
            if (c > 32) break;
            p++;
        }

        let sign = 1;
        if (input.charCodeAt(p) === 45) {
            sign = -1;
            p++;
        }

        let v = 0;
        while (p < nInput) {
            const c = input.charCodeAt(p);
            if (c < 48 || c > 57) break;
            v = v * 10 + (c - 48);
            p++;
        }
        return sign * v;
    }

    const N = readInt();
    const Q = readInt();
    let K = readInt();

    while (p < nInput) {
        const c = input.charCodeAt(p);
        if (c > 32) break;
        p++;
    }

    const sLine = input.slice(p, p + N);
    p += N;

    const chars = new Uint8Array(N + 1);
    for (let i = 1; i <= N; i++) chars[i] = sLine.charCodeAt(i - 1) - 97;

    const pow1 = new Uint32Array(N + 1);
    const pow2 = new Uint32Array(N + 1);
    const invPow1 = new Uint32Array(N + 1);
    const invPow2 = new Uint32Array(N + 1);

    pow1[0] = 1;
    pow2[0] = 1;
    for (let i = 1; i <= N; i++) {
        pow1[i] = mul32(pow1[i - 1], BASE1);
        pow2[i] = mul32(pow2[i - 1], BASE2);
    }

    const invBase1 = invOdd32(BASE1);
    const invBase2 = invOdd32(BASE2);
    invPow1[0] = 1;
    invPow2[0] = 1;
    for (let i = 1; i <= N; i++) {
        invPow1[i] = mul32(invPow1[i - 1], invBase1);
        invPow2[i] = mul32(invPow2[i - 1], invBase2);
    }

    const fw1 = new Fenwick32(N);
    const fw2 = new Fenwick32(N);
    const rv1 = new Fenwick32(N);
    const rv2 = new Fenwick32(N);

    for (let i = 1; i <= N; i++) {
        const v = chars[i] + 1;
        fw1.add(i, mul32(v, pow1[i - 1]));
        fw2.add(i, mul32(v, pow2[i - 1]));
        const ri = N - i + 1;
        rv1.add(ri, mul32(v, pow1[ri - 1]));
        rv2.add(ri, mul32(v, pow2[ri - 1]));
    }

    function normHash(tree: Fenwick32, l: number, r: number, invPow: Uint32Array): number {
        return mul32(tree.range(l, r), invPow[l - 1]);
    }

    function isPalindromeRange(l: number, r: number): boolean {
        const f1 = normHash(fw1, l, r, invPow1);
        const f2 = normHash(fw2, l, r, invPow2);
        const rl = N - r + 1;
        const rr = N - l + 1;
        const b1 = normHash(rv1, rl, rr, invPow1);
        const b2 = normHash(rv2, rl, rr, invPow2);
        return f1 === b1 && f2 === b2;
    }

    function setChar(pos: number, newVal: number): void {
        const oldVal = chars[pos];
        if (oldVal === newVal) return;
        chars[pos] = newVal;

        const delta = newVal - oldVal;
        fw1.add(pos, mul32(delta, pow1[pos - 1]));
        fw2.add(pos, mul32(delta, pow2[pos - 1]));

        const ri = N - pos + 1;
        rv1.add(ri, mul32(delta, pow1[ri - 1]));
        rv2.add(ri, mul32(delta, pow2[ri - 1]));
    }

    let lastAns = 0;
    let checksum = 0;
    let pow31 = 31;
    let palCountBlock = 0;

    for (let i = 1; i <= Q; i++) {
        const a = readInt();
        const b = readInt();

        const key = lastAns ? K : 0;
        const lRaw = a ^ key;
        const rRaw = b ^ key;

        let L = lRaw < rRaw ? lRaw : rRaw;
        let R = lRaw < rRaw ? rRaw : lRaw;

        if (L < 1) L = 1;
        else if (L > N) L = N;
        if (R < 1) R = 1;
        else if (R > N) R = N;

        if ((L + R) % 3 === 0) {
            const t = ((R - L) / 4) | 0;
            L += t;
            R -= t;
        }

        const ans = isPalindromeRange(L, R) ? 1 : 0;
        lastAns = ans;
        if (ans) palCountBlock++;

        if (ans) {
            checksum += pow31;
            if (checksum >= MOD_CHECKSUM) checksum -= MOD_CHECKSUM;
        }
        pow31 = (pow31 * 31) % MOD_CHECKSUM;

        if (ans) {
            const cur = chars[L];
            setChar(L, cur === 25 ? 0 : cur + 1);
        } else {
            const cur = chars[R];
            setChar(R, cur === 0 ? 25 : cur - 1);
        }

        if (i % 1000 === 0) {
            const prime = nextPrimeStrictlyGreater(palCountBlock);
            K = (K * prime) % MOD_K;
            palCountBlock = 0;
        }
    }

    return checksum;
}
