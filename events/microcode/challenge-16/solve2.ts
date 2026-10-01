const MASK64 = (1n << 64n) - 1n;

export function solve(input: string): number {
    const parts = input.trim().split(/\s+/);
    const S0 = BigInt(parts[0]);
    const MULT = BigInt(parts[1]);
    const INC = BigInt(parts[2]);
    const T = BigInt(parts[4]);
    const P = BigInt(parts[5]);

    let curMult = MULT & MASK64;
    let curInc = INC & MASK64;
    let accMult = 1n;
    let accInc = 0n;
    let delta = T;

    while (delta > 0n) {
        if (delta & 1n) {
            accMult = (accMult * curMult) & MASK64;
            accInc = (accInc * curMult + curInc) & MASK64;
        }
        curInc = ((curMult + 1n) * curInc) & MASK64;
        curMult = (curMult * curMult) & MASK64;
        delta >>= 1n;
    }

    const stateAtT = (accMult * S0 + accInc) & MASK64;
    return Number(stateAtT % P);
}
