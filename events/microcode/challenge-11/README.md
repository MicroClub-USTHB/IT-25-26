# Challenge 11 — Magnetic Moves

## Problem

You get an `N x N` board (`N <= 16` in the statement, `N = 14` in the generated inputs). Each row contains exactly one queen (`o`), everything else is `.`.

```text
....o.        row 0 -> col 4
.o....        row 1 -> col 1
...o..        row 2 -> col 3
.....o        row 3 -> col 5
...o..        row 4 -> col 3
..o...        row 5 -> col 2
```

You must move the queens to a valid N-Queens arrangement (no two queens share a row, column or diagonal). Every queen goes to exactly one target cell, every target cell receives exactly one queen. The total cost of the move is minimised; call the minimum `C`.

Then encode the target. If `col_i` is the column of the target queen in row `i`:

```text
result = col_0 * C^0 + col_1 * C^2 + col_2 * C^3 + ... + col_{n-1} * C^n      (exponent 1 is skipped)
```

If several (configuration, assignment) pairs reach the same `C`, take the one with the smallest `result`. Output `result mod 10000027`.

- Part 1 cost of one queen: `0` if it stays, `1` if it slides along its row or column, `2` otherwise (one horizontal + one vertical slide).
- Part 2 cost of one queen: Manhattan distance `|r1 - r2| + |c1 - c2|`.

Example (Part 1): target columns `[4,2,0,5,3,1]`, `C = 3`, `result = 1885`. Example (Part 2): same target, `C = 5`, `result = 28179`.

## Part 1

**Observations**

- `N = 14` has 365,596 valid N-Queens boards. Enumerating them is cheap; what is expensive is doing heavy work per board.
- The start board has one queen per row, and a valid target has one queen per row too. The obvious assignment is "queen of row `i` goes to target row `i`".

**Why the identity assignment is enough**

Cost 0 is only possible when a queen already stands on its target cell. For a given target board, the number of such queens is at most the number of rows `i` with `target[i] == qc[i]` (`qc[i]` = start column of row `i`). Every other queen costs at least 1. The identity assignment reaches exactly this bound: a queen that keeps its row but changes column costs exactly 1 (same row, one slide). So for a fixed target:

```text
min cost = number of rows i where target[i] != qc[i]      ("mismatches")
```

No Hungarian algorithm is needed, and `C` is simply the Hamming distance between the start board and the closest valid N-Queens board.

**Algorithm (`solve1.ts`)**

A bitmask N-Queens backtracking (`cols`, `diags`, `antiDiags` as bit sets, `available = ~(cols | diags | antiDiags) & limit`) that carries a running `mismatches` counter.

1. Row by row, first try the *preferred bit* `1 << qc[row]` if it is available. This keeps `mismatches` unchanged.
2. Then try every other available bit, each with `mismatches + 1`.
3. Prune: `if (mismatches > bestCost) return;` at the top of `backtrack`. The test is strict (`>`), not `>=`, because boards with an equal cost still matter for the tie-break.
4. At `row === n` compute `enc = encode(solution, n, mismatches)`. Keep it if `mismatches < bestCost`, or if the cost is equal and `enc < bestEncoded`.
5. Return `bestEncoded % MOD`.

Trying the zero-cost move first drives `bestCost` down very early, so most of the tree is cut. `bestCost` starts at `n + 1` (larger than any possible cost).

`encode` builds the polynomial with a `power` variable: after the first term it jumps from `C^0` to `C^2` (`power = bigC * bigC`), then multiplies by `C` each step (`C^3`, `C^4`, ...). That reproduces the skipped exponent 1 exactly.

**Complexity**: worst case visits the whole N-Queens search tree (about 365k leaves for `N = 14`), `O(N)` work per leaf for `encode`, but pruning removes most branches in practice.

## Part 2

**What changes**

The cost is now Manhattan distance, so moving to another row is no longer "at least 2 for everyone". A queen may profitably go to a different row (for instance two queens in the same column can split up vertically). The identity assignment is no longer optimal, so for each candidate board we must solve a real assignment problem:

```text
costMatrix[i][j] = |i - j| + |qc[i] - solution[j]|     // start queen i -> target cell in row j
C(board) = min-cost perfect matching on costMatrix       // Hungarian algorithm
```

**Why the part 1 approach needs adjusting**

- `mismatches` no longer equals the cost, so we cannot prune during the row-by-row search with it.
- Running the Hungarian algorithm (`O(N^3)`) on all 365,596 boards is too slow (the organizers measure 30 s or more).

**Algorithm (`solve2.ts`)**

1. The same bitmask backtracking enumerates complete boards (still trying the preferred bit `qc[row]` first). It has no cost pruning; it just calls `processSolution()` at `row === n`.
2. `processSolution` first fills `costMatrix` row by row and computes a cheap lower bound: `lb += rowMin`, where `rowMin` is the cheapest target for queen `i`. Any perfect matching costs at least the sum of the row minima. If `lb > bestCost` it returns immediately, even in the middle of the matrix (early exit). The comparison is strict so equal-cost boards are still examined for the tie-break.
3. Only boards that survive call `hungarian(costMatrix, n)`: the classic potentials version (`u`, `v`, `p`, `way`, `minv`, `used`) that returns the minimum total cost.
4. Update: `cost < bestCost` replaces both `bestCost` and `bestEncoded`; `cost === bestCost` keeps the smaller `encode(solution, n, cost)`.

**Complexity**: `O(#boards * N^2)` for the bounds plus `O(N^3)` for the few boards that pass the bound.

## Pitfalls / traps

- **BigInt for the encoding.** `C^n` is huge: in Part 1 `14^14` is already above `2^53`, and in Part 2 `C` can be in the dozens, so `C^14` overflows doubles by many orders of magnitude. `encode` uses `BigInt`.
- **Compare unreduced values.** The tie-break is on the exact `result`, not on `result mod 10000027`. The modulo is applied only on the final output.
- **Skipped exponent 1.** Exponents are `0, 2, 3, ..., n`. A plain `sum col_i * C^i` is wrong.
- **Strict pruning (`>`).** Using `>=` would throw away equal-cost boards and break the tie-break.
- **`C = 0` edge case.** If the board is already a valid arrangement, `power` becomes 0; the encoding still works (`C^0 = 1` for the first term).
- **Statement vs generator.** The statement allows `N <= 16`, but the generator uses `N = 14`, which is what makes "enumerate all boards" feasible.
- **Part 1 vs Part 2 are different problems.** Do not reuse the identity shortcut in Part 2.

## Files

- `solve1.ts` — N-Queens bitmask backtracking, identity assignment, `mismatches` pruning, preferred-column-first ordering, BigInt encoding.
- `solve2.ts` — same enumeration, but each board is scored with a row-minima lower bound and then the Hungarian algorithm (Manhattan cost matrix), with BigInt tie-break encoding.
