# Challenge 1 — Crescent Calibration

## Problem

The input has `T` on the first line, then 50,000 readings (positive integers, each smaller than `T`), one per line.

- **Part 1:** find the two readings (on different lines) that sum to `T`. Output `A * B`.
- **Part 2:** find the three readings (on different lines) that sum to `T` and satisfy `max - min >= 1000`. Output `A * B * C`.

Each part has exactly one valid answer, and the real entries sit near the end of the list.

Example for part 1 (`T = 10000`, readings `1200 4500 3300 5500`): `4500 + 5500 = 10000`, so the answer is `24750000`.

Example for part 2 (same data): `1200 + 3300 + 5500 = 10000` and the spread is `5500 - 1200 = 4300 >= 1000`, so the answer is `21780000000`.

## Part 1 — 2-Sum

**Observations**

- `N = 50,000`, so there are about `1.25e9` pairs. Checking every pair is too slow.
- Every reading is smaller than `T`, and `T <= 200,000` (the generator draws it from `100,000..200,000`).

**Key insight.** For each value `v` you only need to know whether the complement `T - v` was seen earlier. That is a membership test. Because the values are small and bounded by `T`, you don't need a hash set. A flat array indexed by value does the job.

**Algorithm (`solve1.ts`)**

1. Parse `T` from the first line by hand (`T = T * 10 + charCode - 48`). Then parse each following line the same way. No `split`, so nothing is allocated.
2. `seen = new Uint8Array(T + 1)` is a direct-address table. `seen[x] = 1` means "x appeared on an earlier line".
3. For every parsed `v`, compute `c = T - v`. If `seen[c]` is set, return `v * c`. Otherwise set `seen[v] = 1`.

The order of the two steps matters. The check comes before the mark, so a reading can never pair with itself. If `T/2` appears once, it does not match. If the same value appears on two lines, the second occurrence finds the first one and matches. That is exactly the rule from the statement.

**Complexity:** `O(N)` time and `O(T)` memory (about 200 KB).

## Part 2 — 3-Sum with a spread condition

**Observations**

- Brute force is `O(N^3)`, about `2e13` steps. Hashing the third element gives `O(N^2)`, about `1.25e9` pair lookups. That is still heavy.
- Sorting turns the problem into the classic "fix one element, scan for a pair" shape.

**Key insight.** Sort the array. Fix the smallest element at index `a`. Then look for two elements to its right whose sum is `target = T - sorted[a]`, using two pointers:

```
sorted:  [ ... sorted[a] | left -->            <-- right ]
sum = sorted[left] + sorted[right]
sum <  target  -> left++     (need a bigger sum)
sum >  target  -> right--    (need a smaller sum)
sum == target  -> candidate triple
```

Each pivot costs `O(N)`.

**Algorithm (`solve2.ts`)**

1. Parse the readings into `values = new Int32Array(50001)`. `sorted = values.subarray(0, count)` is a view on the filled part, and `sorted.sort()` sorts it in place.
2. For `a = 0 .. count-3`:
   - `if (a > 0 && sorted[a] === sorted[a-1]) continue;` skips a pivot value already tried.
   - `if (sorted[a+1] + sorted[a+2] > target) break;` stops the whole loop. The two smallest remaining values are already too big, and later pivots only get bigger.
   - `if (sorted[count-2] + sorted[count-1] < target) continue;` skips this pivot. Even the two largest values cannot reach `target`.
   - Run the two-pointer scan with `left = a + 1` and `right = count - 1`.
3. On `sum === target`, check the spread. `a` is the minimum and `right` is the maximum of the triple, so the condition is `sorted[right] - sorted[a] >= 1000`.
   - If it holds, return `sorted[a] * sorted[left] * sorted[right]`.
   - If it fails, do `left++` and keep scanning.

**What changes vs part 1.** Part 1 only asks whether a pair exists, and one pass with a lookup table answers that. Part 2 adds a third element and an extra condition on the triple. A hash table cannot check the condition cheaply, because it forgets order and positions. Sorting gives the min and max of any triple for free (the leftmost and rightmost indices), so the spread check is a single subtraction.

**Why the duplicate skip matters.** Worst-case 3-Sum with two pointers is `O(N^2)`. That is `50,000` pivots times up to `50,000` steps, about `1e9`. Here the filler values are drawn from `1..1000`, so the sorted array has only about 1,000 distinct small values plus 8 special ones. With the duplicate skip, only about 1,001 pivots are scanned. On a sample seed I measured about `2.5e7` inner steps and roughly 15 ms in total.

The skip is safe. Only the later copies of a value are skipped. The first copy's scan starts at `a + 1`, so it can still pair with the other copies. A triple like `(x, x, y)` is therefore still found.

**Complexity:** `O(N log N)` for the sort, plus `O(D * N)` for the scans, where `D` is the number of distinct pivot values tried (about 1,000 here). In general it is `O(N^2)`.

## Pitfalls / traps

- **The decoy triplet.** The generator inserts `decoyA, decoyB, decoyC` before the real triplet. They sum to `T`, but their spread is about 400. A solver that returns the first triple summing to `T` gives the wrong answer. In this sorted solver, the real triple's smallest value (`0.30T..0.33T`) sorts before the decoy's (`T/3 - 200`), so on my sample the check never rejected anything. The `>= 1000` test is still required by the statement, and any solver that scans in input order or uses a hash will hit the decoy first.
- **Fillers cannot interfere.** The noise values are in `1..1000` and `T >= 100,000`, so no 2 or 3 fillers can sum to `T`. The true answer always uses special values.
- **Overflow.** The part 1 product is about `(T/2)^2 = 1e10`, which is larger than `2^32`. The part 2 product is about `(T/3)^3 = 2e14`. In JavaScript the multiplication is done in doubles, which is exact up to `2^53`. In C, C++ or Java you must use 64-bit integers. Storing the readings in an `Int32Array` is fine, because only the product can overflow.
- **Typed-array sort.** `Int32Array.prototype.sort()` with no comparator sorts numerically. A plain `Array` would sort as strings (`"10000" < "9"`), which breaks the two-pointer scan.
- **Line endings.** The hand-written parser splits only on `\n`. A `\r` would be read as a digit and corrupt the numbers. `input.trim()` strips only the outer whitespace.

## Files

- `solve1.ts` — one pass over the readings, with a `Uint8Array(T + 1)` "seen" table.
- `solve2.ts` — sort, pivot with duplicate skipping and pruning, two-pointer scan, and the spread check.
