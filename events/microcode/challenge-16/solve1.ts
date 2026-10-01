const MASK64 = (1n << 64n) - 1n;

function pcgOutput(state: bigint): number {
    const xorshifted = Number(((state >> 18n) ^ state) >> 27n);
    const rot = Number(state >> 59n);
    return ((xorshifted >>> rot) | (xorshifted << ((-rot) & 31))) >>> 0;
}

export function solve(input: string): number {
    const parts = input.trim().split(/\s+/);
    const S0 = BigInt(parts[0]);
    const MULT = BigInt(parts[1]);
    const INC = BigInt(parts[2]);
    const N = Number(parts[3]);

    let state = S0;
    let sum = 0;

    for (let i = 0; i < N; i++) {
        state = (state * MULT + INC) & MASK64;

        const output = pcgOutput(state);

        sum += output >>> 16;
    }

    return sum;
}
