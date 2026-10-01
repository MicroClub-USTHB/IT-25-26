# Challenge 16 — Shield Sequence

## Problem

A 64-bit pseudo-random generator (a PCG-XSH-RR) protects the shields. One input line:

```
S0 MULT INC N T P
```

| Name   | Meaning                                         | Size                |
| ------ | ----------------------------------------------- | ------------------- |
| `S0`   | initial seed                                    | unsigned 64-bit     |
| `MULT` | LCG multiplier (odd)                            | ~2^43               |
| `INC`  | LCG increment (odd)                             | ~2^41               |
| `N`    | number of steps for part 1                      | 5 000 - 15 000      |
| `T`    | step index for part 2                           | up to ~10^18        |
| `P`    | prime modulus for part 2                        | ~10^9               |

Two stages per step `k = 1, 2, ...`:

1. **State update (LCG)**: `S(k) = (S(k-1) * MULT + INC) mod 2^64`, with `S(0) = S0`.
2. **Output permutation (PCG-XSH-RR)** applied to the **new** state `S(k)`:

```
xorshifted = ((state >> 18) ^ state) >> 27      (kept as 32 bits)
rot        = state >> 59                        (5 bits, 0..31)
output     = (xorshifted >> rot) | (xorshifted << ((-rot) & 31))   (32-bit rotate right)
```

- **Part 1**: run `N` steps, take `output >> 16` (the top 16 bits, 0..65535) at every step and print the **sum**.
- **Part 2**: print `S(T) mod P`, the raw 64-bit state after `T` steps, reduced modulo `P`.

Sample: `7392142408732208350 8796093023223 2199023257957 14334 300323046467736761 1000027013`

| Step | Output (32-bit) | `output >> 16` |
| ---- | --------------- | -------------- |
| 1    | 3782789370      | 57720          |
| 2    | 503438468       | 7681           |
| 3    | 3460728793      | 52806          |

Part 1 answer `474629084`, part 2 answer `163010823`.

## Part 1 - simulate N steps exactly

**Observations**

- `N <= 15 000`, so plain simulation is trivially fast. There is no algorithmic difficulty, only *arithmetic* difficulty.
- `S0` is a full 64-bit value and `state * MULT` reaches about 2^64 * 2^43 = 2^107. JavaScript `number` is a double: exact only up to 2^53. Any `Number` arithmetic on the state silently loses low bits and the whole sequence diverges.

**Key idea**: use `BigInt` for the 64-bit state and emulate unsigned wrap-around by masking with `MASK64 = (1n << 64n) - 1n` after the multiply-add. `& MASK64` on a non-negative BigInt is exactly `mod 2^64`.

**Algorithm** (`solve1.ts`)

1. Parse `S0`, `MULT`, `INC` as `BigInt`, `N` as `Number`.
2. Loop `N` times:
   - `state = (state * MULT + INC) & MASK64` (advance first, then output: the output uses `S(k)`, not `S(k-1)`).
   - `output = pcgOutput(state)`.
   - `sum += output >>> 16`.

`pcgOutput` is where the types change:

```
xorshifted = Number(((state >> 18n) ^ state) >> 27n)   // BigInt ops, then drop to Number
rot        = Number(state >> 59n)                      // 0..31
return ((xorshifted >>> rot) | (xorshifted << ((-rot) & 31))) >>> 0
```

- `((state >> 18n) ^ state) >> 27n` is still a ~37-bit number. The spec says `xorshifted` is 32-bit, and the truncation happens **implicitly**: JS's `>>>` and `<<` apply `ToUint32` / `ToInt32` to their left operand, which keeps only the low 32 bits. If you stayed in BigInt you would have to write `& 0xFFFFFFFFn` yourself.
- `(xorshifted >>> rot) | (xorshifted << ((-rot) & 31))` is a 32-bit rotate right by `rot`. The `& 31` makes `rot = 0` safe (shift by 0, not 32).
- `|` returns a *signed* int32, so the final `>>> 0` converts back to unsigned before `output >>> 16` takes the top 16 bits.
- `sum` is a plain `Number`: at most `15 000 * 65 535 ~ 9.8e8`, far below 2^53.

**Complexity**: `O(N)` BigInt operations (about 15 000), negligible.

## Part 2 - jump ahead T steps (affine exponentiation)

**What changes**: `T` is up to ~10^18, so iterating `T` times is impossible (that would be ~31 years at 10^9 steps/s). We also no longer need outputs, only the raw state `S(T)`. Note `T` and `S0` do not fit in a `Number` either (> 2^53), so `T` must be parsed with `BigInt` as well.

**Key idea**: one LCG step is an affine map `f(x) = a*x + c (mod 2^64)` with `(a, c) = (MULT, INC)`. Affine maps compose into affine maps, so `f^T` is again `x -> A*x + C` and can be built by **binary exponentiation** (square-and-multiply) on the pair `(a, c)`.

Two formulas are all that is needed:

```
f^m ∘ f^m  :  (a, c)  ->  (a*a,  (a + 1) * c)        // squaring: a(ax + c) + c = a²x + (a+1)c
acc ∘ cur  :  accMult = accMult * curMult
              accInc  = accInc  * curMult + curInc    // apply acc first, then cur
```

**Algorithm** (`solve2.ts`)

- `curMult, curInc` hold the map `f^(2^i)` (start at `MULT, INC`, i.e. `i = 0`).
- `accMult, accInc` hold the part of `f^T` assembled so far (start at the identity `1, 0`).
- `delta = T`; while `delta > 0`:
  - if the lowest bit of `delta` is set, fold `cur` into `acc` (formula above);
  - square `cur`: `curInc = ((curMult + 1n) * curInc) & MASK64`, then `curMult = (curMult * curMult) & MASK64`. The order matters: `curInc` uses the **old** `curMult`;
  - `delta >>= 1n`.
- Final: `stateAtT = (accMult * S0 + accInc) & MASK64`, answer `Number(stateAtT % P)`.

All the maps involved are powers of the same `f`, so they commute and the composition order cannot change the result.

**Complexity**: `O(log T)`, about 60 iterations with a couple of BigInt multiplications each.

## Pitfalls / traps

- **Precision**: seed, multiplier products and `T` all exceed 2^53. Use `BigInt` for every state-related quantity. `Number(parts[4])` for `T` would be silently wrong.
- **Wrap-around**: unsigned 64-bit overflow must be emulated with `& MASK64` after every multiply/add (also on `curMult`, `curInc`, `accMult`, `accInc` in part 2). Forgetting it in the squaring step is the classic bug.
- **Reduce modulo P only at the very end**. `S(T)` lives in Z/2^64; reducing by `P` in the middle is not a ring homomorphism and gives garbage. The prime `P` is only a "display" modulus.
- **Order of stages**: advance the LCG, *then* apply PCG to the new state. Part 1's first output is `PCG(S(1))`.
- **32-bit truncation of `xorshifted`** and the **rotate amount** `rot = state >> 59` (top 5 bits, not low bits).
- **Signed bitwise results in JS**: finish with `>>> 0` before extracting `>> 16`.
- Using the PCG output of part 1 for part 2 is wrong: part 2 wants the raw 64-bit state, not the permuted 32-bit output.
- `MULT` and `INC` are forced odd by the generator (Hull-Dobell), so the period is the full 2^64 and no cycle shortcut is available.

## Files

- `solve1.ts`: BigInt LCG loop plus `pcgOutput`; returns the sum of the top 16 bits over the first `N` outputs.
- `solve2.ts`: `O(log T)` affine leap-ahead modulo 2^64, then `% P`.
