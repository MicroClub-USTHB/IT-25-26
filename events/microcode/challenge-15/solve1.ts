const MOD = 1_000_000_009;

function buildPalRadii(s: string): { odd: Int32Array; even: Int32Array } {
    const n = s.length;
    const a = new Uint16Array(n);
    for (let i = 0; i < n; i++) a[i] = s.charCodeAt(i);

    const odd = new Int32Array(n);
    const even = new Int32Array(n);

    let l = 0;
    let r = -1;
    for (let i = 0; i < n; i++) {
        let k = i > r ? 1 : Math.min(odd[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && a[i - k] === a[i + k]) k++;
        odd[i] = k;
        if (i + k - 1 > r) {
            l = i - k + 1;
            r = i + k - 1;
        }
    }

    l = 0;
    r = -1;
    for (let i = 0; i < n; i++) {
        let k = i > r ? 0 : Math.min(even[l + r - i + 1], r - i + 1);
        while (i - k - 1 >= 0 && i + k < n && a[i - k - 1] === a[i + k]) k++;
        even[i] = k;
        if (i + k - 1 > r) {
            l = i - k;
            r = i + k - 1;
        }
    }

    return { odd, even };
}

function isPalindrome(l: number, r: number, odd: Int32Array, even: Int32Array): boolean {
    const len = r - l + 1;
    if (len & 1) {
        const c = (l + r) >> 1;
        return odd[c] >= ((len + 1) >> 1);
    }
    const c = (l + r + 1) >> 1;
    return even[c] >= (len >> 1);
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
    const K = readInt();

    while (p < nInput) {
        const c = input.charCodeAt(p);
        if (c > 32) break;
        p++;
    }

    const s = input.slice(p, p + N);
    p += N;

    const { odd, even } = buildPalRadii(s);

    let lastAns = 0;
    let checksum = 0;
    let pow31 = 31;

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

        const ans = isPalindrome(L - 1, R - 1, odd, even) ? 1 : 0;
        lastAns = ans;

        if (ans) {
            checksum += pow31;
            if (checksum >= MOD) checksum -= MOD;
        }
        pow31 = (pow31 * 31) % MOD;
    }

    return checksum;
}
