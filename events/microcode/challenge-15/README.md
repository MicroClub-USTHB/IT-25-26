# Challenge 15 — Palindrome Protocol

## Problem

```text
N Q K
S                (lowercase string of length N)
Ai Bi            (Q lines, encrypted endpoints)
```

The statement allows `N, Q <= 1,000,000`; the generator uses `N` up to 260,000 and `Q` up to 320,000. Positions are 1-indexed. For query `i = 1..Q`:

1. `LastAns` is 1 if the previous query was a palindrome, else 0 (0 for the first query).
2. `L_raw = Ai XOR (LastAns * K)`, `R_raw = Bi XOR (LastAns * K)`.
3. `L = min(L_raw, R_raw)`, `R = max(...)`, both clamped to `[1, N]`.
4. If `(L + R) % 3 == 0`: `t = floor((R - L) / 4)`, `L += t`, `R -= t`.
5. `ans_i = 1` if `S[L..R]` is a palindrome, else 0.

Checksum: `sum of ans_i * 31^i`, modulo `10^9 + 9`.

**Part 2 changes:**

- After every query, mutate `S` using the post-shrink `L`, `R`: palindrome -> `S[L]` advances one letter (`z -> a`); not a palindrome -> `S[R]` retreats one letter (`a -> z`).
- Every 1000 queries, `p = smallest prime strictly greater than (number of palindromes in those 1000 queries)` and `K = K * p mod (10^9 + 7)`, used from the next block on.

Example (Part 1): `aabaa`, `K = 3`, answers `1, 0, 1, 1`, checksum `31 + 31^3 + 31^4 = 953343`. Example (Part 2): the mutation after query 1 breaks the palindrome of query 4, giving `29822`.

## Part 1

**Observations**

- Queries are online: the decoding of query `i` needs `ans_{i-1}`, so there is no reordering or batching. Each query must be answered quickly.
- A direct check of `S[L..R]` costs `O(R - L)`, so `Q` queries cost `O(Q * N)`, which is up to `10^11` to `10^12`. Too slow.
- In Part 1 the string never changes, so a one-time precomputation can answer every query in `O(1)`.

**Key insight: Manacher's algorithm**

`buildPalRadii` computes, in `O(N)`, for every center the longest palindrome around it:

- `odd[i]` = `k` such that `s[i-k+1 .. i+k-1]` is a palindrome (length `2k - 1`, center at character `i`).
- `even[i]` = `k` such that `s[i-k .. i+k-1]` is a palindrome (length `2k`, center between `i-1` and `i`).

Both use the usual mirror trick with the current rightmost palindrome `[l, r]`: start `k` at `min(mirror value, r - i + 1)` instead of recomputing from scratch, then extend, then update `[l, r]`.

**Answering a query (`isPalindrome`, 0-indexed `l`, `r`)**

```text
len = r - l + 1
odd length : c = (l + r) >> 1,       palindrome iff odd[c]  >= (len + 1) >> 1
even length: c = (l + r + 1) >> 1,   palindrome iff even[c] >= len >> 1
```

**Main loop (`solve1.ts`)**

1. Parse integers by hand with `readInt` (character codes) instead of `split`: with up to a million lines this avoids huge temporary arrays.
2. `key = lastAns ? K : 0`; `lRaw = a ^ key`, `rRaw = b ^ key`; order them; clamp both to `[1, N]`.
3. If `(L + R) % 3 === 0`: `t = ((R - L) / 4) | 0` and shrink.
4. `ans = isPalindrome(L - 1, R - 1, odd, even)`.
5. Checksum: keep `pow31` as `31^i mod (10^9 + 9)` and add it when `ans` is 1.

**Complexity**: `O(N + Q)`.

## Part 2

**What changes**

The string is mutated after every query (one character per query). Manacher's arrays are static; after a mutation they could change over a long range, and recomputing them costs `O(N)` per query, `O(Q * N)` overall. Same total as the naive check. We need a structure that supports a point update and a substring palindrome test, both in `O(log N)`.

**Key insight: polynomial hashing in Fenwick trees**

A substring is a palindrome iff it equals its reverse, and equality can be tested through a hash of the substring and of its reverse.

- Each character is mapped to `chars[i] + 1` (so `a = 1`, never 0).
- Forward trees `fw1`, `fw2` store `v_i * B^(i-1)` at position `i`, for two bases `BASE1 = 911_382_323` and `BASE2 = 972_663_749`.
- Reverse trees `rv1`, `rv2` store the same values at the mirrored position `ri = N - i + 1`, i.e. they index the reversed string.
- All arithmetic is modulo `2^32`: `mul32(a, b) = Math.imul(a, b) >>> 0`, and the `Uint32Array` Fenwick (`Fenwick32`) adds with `>>> 0`. No explicit modulus is needed; unsigned wrap-around is the modulus.

**Extracting a substring hash (`normHash`)**

`tree.range(l, r)` returns `sum of v_i * B^(i-1)` for `i` in `[l, r]`, which equals `B^(l-1) * H(S[l..r])`. Multiply by `invPow[l-1]` (the inverse of `B^(l-1)`) to normalise to the position-independent `H = sum_k s_{l+k} * B^k`.

- Inverses modulo `2^32` exist because the bases are odd. `invOdd32(a)` uses Newton's iteration `x = x * (2 - a * x)`, which doubles the number of correct bits each round (starting from `x = a`, correct to 3 bits; 5 rounds are more than enough for 32 bits).
- `pow1`, `pow2`, `invPow1`, `invPow2` are precomputed for `0..N`.

**Palindrome test (`isPalindromeRange(L, R)`)**

```text
forward  hash of S[L..R]                  -> fw trees,  range [L, R]
backward hash (= hash of reversed S[L..R]) -> rv trees, range [N - R + 1, N - L + 1]
palindrome iff both bases agree on both hashes
```

**Mutation (`setChar`)**

When a character changes from `oldVal` to `newVal`, `delta = newVal - oldVal` (may be negative; `Math.imul` handles it as a wrapped integer). Add `delta * B^(pos-1)` to `fw1`, `fw2` at `pos`, and `delta * B^(ri-1)` to `rv1`, `rv2` at `ri = N - pos + 1`. Four Fenwick updates.

**Per query order (matters)**

1. Decode with the current `K` and `lastAns`, clamp, shrink, test `ans`.
2. Update `palCountBlock` and the checksum (`pow31`).
3. Mutate: `ans` true -> `chars[L]` becomes `(c + 1) mod 26` (`cur === 25 ? 0 : cur + 1`); false -> `chars[R]` becomes `(c - 1) mod 26` (`cur === 0 ? 25 : cur - 1`).
4. If `i % 1000 === 0`: `prime = nextPrimeStrictlyGreater(palCountBlock)` (trial division is fine, the count is at most 1000), `K = (K * prime) % 1_000_000_007`, reset `palCountBlock`.

**Complexity**: build `O(N log N)`; each query costs 8 Fenwick prefix sums (4 range queries, 2 prefix sums each) plus 4 updates, `O(log N)`. Total `O((N + Q) log N)`.

## Pitfalls / traps

- **Two different moduli.** The checksum is modulo `10^9 + 9`; `K` is updated modulo `10^9 + 7`. Mixing them gives wrong decoding after the first block.
- **XOR decoding.** The key is `LastAns * K` with no reduction, and it is applied before ordering and clamping. In JavaScript `^` works on signed 32-bit integers, which is fine here because `K < 2^30`.
- **Clamping decoys.** The generator emits many raw values up to `2^20 - 1` (far above `N`) and some pre-XORed with the initial `K`. They only land on sensible ranges if the decoding is exactly right.
- **Shrink on every query**, using the clamped `L`, `R`; and note `floor((R - L) / 4)` is `0` for short ranges, so single characters and very short ranges are unchanged.
- **Mutate with post-shrink `L`, `R`**, not the raw ones, and before the next query (including the `K` update boundary: the mutation of query 1000 happens before `K` changes).
- **"Strictly greater" prime**: a count of 2 gives 3, a count of 0 gives 2.
- **Wrapping letters**: `z -> a` on advance and `a -> z` on retreat, with letters stored as `0..25`.
- **Hash weakness.** A mod `2^32` polynomial hash is not adversarially safe (Thue-Morse style strings break it, even with two bases). The generated data is random plus planted palindromes, so it works; the organizers' "no collisions" claim is probabilistic.
- **Performance traps.** Rebuilding Manacher per query, or checking naively, is `O(Q * N)`. Use fast input parsing (`readInt`), and typed arrays for powers and trees.
- **Planted palindromes** (blocks of up to 384 characters, about 60% real palindromes, the rest with one corrupted character) make near-miss comparisons common, so a sloppy hash or off-by-one on `even`/`odd` centers shows up quickly.

## Files

- `solve1.ts` — Manacher (`odd` / `even` radii) plus O(1) palindrome checks, fast integer reader, chained XOR decoding, shrink rule and `31^i` checksum.
- `solve2.ts` — double polynomial hash mod `2^32` over four Fenwick trees (forward and reversed) for O(log N) palindrome tests and character updates, with per-query mutation and the block-wise `K = K * nextPrime mod (10^9 + 7)` update.
