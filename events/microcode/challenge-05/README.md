# Challenge 5 — Stellar Static

## Problem

The input is 2000 to 2500 lines. Non-blank lines look like `VALUE | MODE_S : MODE_R`:
- `VALUE` is a signed integer, possibly with leading zeros;
- `MODE_S` and `MODE_R` are single uppercase letters;
- whitespace is scattered around the `|`, the `:` and the ends of the line;
- some lines are blank.

A line is **stable** if `MODE_S == MODE_R`. Let `S` be the number of stable lines.

**Bits.** Take `|VALUE|` of each stable line. Drop the ones equal to `0`. For the rest, the bit is `1` if the absolute value is prime, else `0`. Call the resulting sequence `bits`, with length `N`.

- **Part 1 (Power Index):** let `shift = S mod 7`. For `i = 1..N`, `E = ((i + shift - 1) mod N) + 1`. If `bits[i]` is `1`, add `E * E` to the power; otherwise subtract `gcd(E, N)`.
- **Part 2 (Entropy Score):** slide a window of 5 bits across `bits`, producing a mutated sequence `M` of length `N - 4`. For the window `W = 16*b0 + 8*b1 + 4*b2 + 2*b3 + b4`: emit `1` if `W % 3 == 0`; else `0` if `W % 5 == 0`; else the parity of the number of ones in the window. Find the smallest period `L` of `M` (the smallest `L` dividing `len(M)` with `M[i] == M[i mod L]`). The answer is `L * sum(i + 1 for every i with M[i] == 1)`.

Example (part 1):

```
  42 | A : A      stable, |42| = 42 -> not prime -> bit 0
 -17 | B : C      unstable, dropped
  00007 | D : D   stable, 7 -> prime -> bit 1
  0 | E : E       stable, value 0 -> counted in S, but dropped from the bits
  3  |  F :  F    stable, 3 -> prime -> bit 1
```

`S = 4`, `shift = 4`, `bits = [0, 1, 1]`, `N = 3`.
- `i=1`: `E = 2`, bit 0, subtract `gcd(2,3) = 1`, so power `-1`.
- `i=2`: `E = 3`, bit 1, add `9`, so power `8`.
- `i=3`: `E = 1`, bit 1, add `1`, so power `9`.

Example (part 2): `M = [1, 0, 1, 0, 1, 0]` has period `L = 2`. The positions of the ones are `1, 3, 5` (1-based), the sum is `9`, and the answer is `9 * 2 = 18`.

## Part 1 — parse, filter, test primality, accumulate

There is no algorithmic difficulty. About 2,000 lines and values up to about a million make everything small. The work is in getting the details exactly right.

**Algorithm (`solve1.ts`)**
1. **Parse (`parseLine`).** `line.replace(/\s+/g, "")` removes all whitespace first, so every line becomes `-000734957|O:O` or similar. An empty result means a blank line, and it returns `null`. Then the strict regex `/^(-?\d+)\|([A-Z]):([A-Z])$/` captures the value and the two letters. `parseInt(match[1], 10)` handles the sign and the leading zeros (and the explicit radix avoids any octal reading).
2. **Filter.** For every parsed line with `modeS === modeR`, do `S++` and push `Math.abs(value)` to `stable`.
3. **Bits.** For every `v` in `stable`, skip `v === 0`, otherwise push `isPrime(v) ? 1 : 0`. `N = bits.length`. If `N === 0`, return `0`.
4. **Power.** `shift = S % 7`. For `i = 1..n`: `effectiveIndex = ((i + shift - 1) % n) + 1`. If `bits[i-1] === 1`, add `effectiveIndex * effectiveIndex`; otherwise subtract `gcd(effectiveIndex, n)`.

Helpers:
- `isPrime(n)`: `false` for `n < 2`, `true` for `2`, `false` for even numbers, then trial division by odd `i` while `i * i <= n`. For values below `999,983` that is at most about 500 divisions.
- `gcd(a, b)`: Euclid (`while (b) { t = b; b = a % b; a = t; }`).

Notes on the formula:
- `E` takes every value `1..N` exactly once as `i` goes from `1` to `N`, because `i -> ((i + shift - 1) mod N) + 1` is a cyclic shift. `shift` only decides which bit gets which `E`.
- `S % 7` uses `S` (stable count, zeros included), not `N`.

**Complexity:** `O(L + N * sqrt(V) + N log N)`, where `L` is the number of lines and `V <= 10^6`. In practice that is a few million operations.

## Part 2 — a sliding window, a mutation filter and a period search

**What changes vs part 1.** The first half is identical: same parsing, same stable filtering, same `bits` (`solve2.ts` repeats it). Two things differ:
- `S` and `shift` are no longer needed. The windows run over the unshifted bit sequence, so there is no rotating index, no `gcd`, and no `E * E`.
- The output is derived from a derived sequence `M`, not directly from the bits.

**Algorithm (`solve2.ts`)**
1. Build `bits` as in part 1. If `n < 5` there are no windows, so return `0` (this also covers the tiny statement example).
2. For `i = 0 .. n-5`, pack the window with shifts: `w = (bits[i] << 4) | (bits[i+1] << 3) | (bits[i+2] << 2) | (bits[i+3] << 1) | bits[i+4]`. This is the same number as `16*b0 + ... + b4`, between `0` and `31`.
3. Emit by the first rule that matches:

| `w`                                  | Emitted bit      |
| :----------------------------------- | :--------------- |
| multiple of 3: `0 3 6 9 12 15 18 21 24 27 30` | `1`             |
| else multiple of 5: `5 10 20 25`     | `0`              |
| anything else                        | parity of the five bits (`% 2`) |

4. `smallestPeriod(mutated)`: for `L = 1 .. n`, skip `L` if `n % L !== 0`; otherwise check `seq[i] === seq[i % L]` for every `i`, stopping at the first mismatch. The first `L` that survives is the answer. If none does, it returns `n` (the full length is always a valid period).
5. `posSum` is the sum of `i + 1` over every index with `mutated[i] === 1`. Return `posSum * L`.

**Complexity:** the window pass is `O(N)`. The period search is `O(N * d(N))` in the worst case (`d(N)` is the number of divisors of the length), and most candidates fail on an early mismatch. An alternative is the KMP failure function: `L = n - fail[n-1]` if that divides `n`, otherwise `L = n`.

## Pitfalls / traps

- **Zero is counted, but not a bit.** `S` is incremented for every stable line, including those with value `0`. Only afterwards are zeros removed from the bit list. That is why `S = 4` but `N = 3` in the example. Using `N` for `shift` is wrong.
- **`1` and `-1` are real bits.** The generator injects `0`, `1` and `-1`. `|-1| = 1` is not prime, so it gives bit `0` and is kept. It is only `0` that is discarded. A primality test that doesn't reject `n < 2` would call 1 prime.
- **Absolute value before primality.** Negative numbers are tested by their absolute value (about 20% of the values are negative).
- **Leading zeros.** Up to 6 extra zeros, such as `-000000734957`. Parse as decimal. In C or C++, `strtol(s, 0, ...)` or `scanf("%i")` reads a leading `0` as octal.
- **Whitespace and blank lines.** Any amount of spaces around `|` and `:`, and lines that are empty or only spaces. Stripping all whitespace before matching handles all of them (and also stray `\r` from CRLF files).
- **All-zero windows emit `1`.** `W = 0` is divisible by `3`, so the first rule wins and emits `1`, not `0`. Because primes are rare (about 8% of the values), most windows are `00000`. On the seed I checked, `M` was almost entirely ones (1,300 of 1,312). If you test divisibility by `5` first, or treat `0` as "not divisible", you get a wrong sequence.
- **Rule order.** The three rules are "first match wins". `15` and `30` are multiples of both `3` and `5`, so they emit `1`, not `0`.
- **The period is usually the whole length.** With a handful of zeros scattered in `M`, no shorter period fits, so `L` equals `len(M)` (1,312 on my sample). Don't assume `L` is small, and don't skip the period search.
- **Magnitudes.** `posSum * L` is about `1e9` and can exceed `2^31` (signed 32-bit) on other seeds. Use 64-bit integers outside JavaScript. The part 1 power can be negative.

## Files

- `solve1.ts` — parse and filter the lines, build the prime bits, then compute the rotating-index Power Index with `isPrime` and `gcd`.
- `solve2.ts` — same parsing and bits, then the 5-bit mutation filter, `smallestPeriod`, and `posSum * L`.
