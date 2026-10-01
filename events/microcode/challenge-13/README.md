# Challenge 13 — Constellation Cuboids

## Problem

```text
M
MODE x1..x2,y1..y2,z1..z2      (M lines, M <= 100,000)
Q
D idx | R idx x1..x2,y1..y2,z1..z2      (Q lines, Q <= 100; Part 2 only)
```

Each operation takes the integer lattice points of an axis-aligned cuboid (ranges are inclusive and read as `[min, max]`, coordinates in `[0, 999999]`) and transforms every point:

| MODE | Transformation |
| --- | --- |
| 0 | rotate: `(x, y, z) -> (-y, x, z)` |
| 1 | scale: `(x, y, z) -> (2x, 2y, 2z)` |
| 2 | swap: `(x, y, z) -> (z, y, x)` |

Operations are independent. The energy of a point is `x^2 + y^2 + z^2`.

- **Part 1:** sum the energy of all transformed points of all operations; a point produced by several operations is counted once per operation. Output `mod 10^9 + 9`.
- **Part 2:** process the `Q` cumulative queries (`D` deletes an operation, `R` replaces its ranges, keeping its MODE). After each query compute the energy of the **unique** points (each point counted once). Output the sum of the `Q` results `mod 10^9 + 9`.

Example (Part 1): ops contribute `4 + 16 + 23 = 43`. Example (Part 2): after `D 1` the energy is `27`, after the `R` it is `4`, answer `31`.

## Part 1

**Observations**

- A box can contain up to millions of points, and there can be 100k boxes. Enumerating points is hopeless (the generator's boxes hold on the order of 10^4 points each, so about 10^9 points in total).
- Duplicates count, so there is no global set: every operation is independent and the answer is a plain sum.

**Key insight: closed forms per box**

1. Apply the transformation to the *bounds*, not to the points. Each operation becomes a `Box` with three `Interval`s (`opToBox`):
   - MODE 0: `x = [-y2, -y1]`, `y = [x1, x2]`, `z = [z1, z2]` (negation flips the order of the bounds).
   - MODE 1: every bound is doubled, and each interval gets `evenOnly = true`. The scaled box only contains even coordinates, not every integer in between.
   - MODE 2: `x = [z1, z2]`, `y = [y1, y2]`, `z = [x1, x2]`.
2. For an interval `[a, b]` we need its `count` and the sum of squares `sumSq` of its integer points (`getIntervalStats`).
   - Dense interval: `count = b - a + 1`, `sumSq = sumSqRange(a, b)`.
   - Even-only interval: points are `2t` for `t` in `[min/2, max/2]`, so `count = R - L + 1` and `sumSq = 4 * sumSqRange(L, R)`.
3. `sumSquaresPositive(n) = n(n+1)(2n+1)/6`. `sumSqRange` handles the three sign cases because mode 0 produces negative coordinates: entirely negative (mirror it), straddling zero (`sumSq(-a) + sumSq(b)`, zero adds nothing), or non-negative (`f(b) - f(a-1)`).
4. Expanding `sum over the box of (x^2 + y^2 + z^2)` gives (`getBoxSum`):

```text
sx.sumSq * sy.count * sz.count
+ sy.sumSq * sx.count * sz.count
+ sz.sumSq * sx.count * sy.count
```

Each axis's sum of squares is multiplied by the number of combinations of the other two axes.

**Algorithm**: parse (`parseOps` normalises each range to `[min, max]`), map every op to a box, add `getBoxSum` into a `BigInt` total, reduce modulo `10^9 + 9` at the end.

**Complexity**: `O(M)` big-integer operations.

## Part 2

**What changes**

Duplicates must now be removed. After a `D` or `R` query we need the energy of the **union** of all transformed boxes. Re-running the closed form per box is no longer enough: overlapping regions would be counted twice.

**Key insight: inclusion-exclusion over the three MODE groups**

Let `A`, `B`, `C` be the sets of points produced by the MODE 0, 1 and 2 operations. Then

```text
Energy(A u B u C) = E(A) + E(B) + E(C) - E(A n B) - E(A n C) - E(B n C) + E(A n B n C)
```

This only works cheaply because, in the generated data, the boxes *inside* one group are pairwise disjoint (their z ranges after transformation are disjoint, by construction):

- MODE 0 uses disjoint z slices of `[0, 900000]`.
- MODE 1 uses disjoint z slices (doubled after the transform).
- MODE 2 uses disjoint x slices, and after the swap x becomes z.

So `E(A)` is just the sum of its box energies, and `E(A n B)` is the sum over **pairs** `(a, b)` of `E(a n b)`. The statement does not promise this; the solution relies on it.

**Cross-group intersections with a sweep (`solveUnique`)**

1. Keep alive ops, convert to boxes, split into `A`, `B`, `C` by mode, and sort each by `z.min`. Within a group the intervals are disjoint, so sorting by `z.min` also sorts by `z.max`.
2. `total` starts as the sum of all box energies.
3. `getPairs(arr1, arr2)` is a merge-style two-pointer walk on the z intervals:
   - `arr1[i].z.max < arr2[j].z.min` -> `i++`; symmetric case -> `j++`.
   - Otherwise the z ranges overlap: add `getBoxSum(intersectBox(...))` (zero if x or y do not overlap), then advance the pointer whose `z.max` is smaller.
   - It subtracts the three pairwise terms `A,B`, `A,C`, `B,C`.
4. The triple term uses three pointers `i, j, k`: compute `maxMin` (largest `z.min`) and `minMax` (smallest `z.max`). If `maxMin <= minMax` add the energy of `intersectBox3`. Advance the pointer whose `z.max === minMax` (A first, then B, else C).
5. `intersectInterval` takes `max(min)`, `min(max)`; if either side is even-only, it rounds `min` up and `max` down to even numbers (this works for negatives too, e.g. `-3n % 2n` is `-1n`), and returns `null` when empty.
6. Each query is applied (`applyQuery` flips `alive` for `D`; for `R` it overwrites and re-normalises the ranges, keeping the MODE), then `solveUnique` is re-run from scratch. Only the `Q` post-query values are added (the initial state is not counted).

**Complexity**: per query `O(M log M)` for sorting plus `O(M)` for sweeps and box sums, times `Q` (30 to 50 in the generator, at most 100).

## Pitfalls / traps

- **Overflow.** One box's `sumSq * count * count` is around `10^18 * 10^12`, far beyond `2^53` and even `2^64`. The solutions use `BigInt` throughout and reduce modulo only at the end of Part 1 and per query in Part 2. Normalise with `((x % MOD) + MOD) % MOD` since `BigInt %` can be negative.
- **Scale is a lattice, not a box.** Treating a scaled box as dense would overcount by about 8x and give wrong intersections with MODE 2 boxes. That is why intervals carry `evenOnly`.
- **Negative coordinates.** MODE 0 maps into negatives, so the sum of squares needs the signed `sumSqRange`.
- **Reversed ranges.** `a..b` may be given with `a > b`; both `parseOps` and `applyQuery` normalise.
- **Forced overlaps.** The generator injects 1,500 to 2,000 MODE 1 / MODE 2 pairs that overlap after transformation (MODE 1 points are the even points of the MODE 2 box). A solver that ignores intersections gets Part 2 wrong; one that compares all pairs does `O(M^2)`.
- **Critical axis kept by `R` queries.** `R` on those ops keeps the z range (MODE 1) or x range (MODE 2), so the within-group disjointness the sweeps depend on survives updates.
- **Decoys.** MODE 0 boxes live in `x <= 0`, so they almost never intersect the others; the triple intersection is almost always empty, but must still be implemented.
- **Duplicates differ per part.** Part 1 counts duplicates; Part 2 does not. Do not reuse the plain sum.

## Files

- `solve1.ts` — transforms each op into a box of intervals, computes its energy by closed-form sums of squares (BigInt), sums everything with duplicates.
- `solve2.ts` — for each query, rebuilds boxes of alive ops and computes the unique energy by inclusion-exclusion over MODE groups with z-sorted two-pointer and three-pointer sweeps.
