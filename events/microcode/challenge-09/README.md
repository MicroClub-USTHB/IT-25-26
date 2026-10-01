# Challenge 09 — Toroidal Tracking

## Problem

Input:

```text
TARGET: T
WORD: W
MATRIX:
<ROWS lines of COLS characters>
```

The generator builds a 600 x 600 matrix and a word of 18 to 28 characters.

**Part 1.** Find the (unique) sequence of cells `(R1,C1) ... (RL,CL)` that spells `WORD` character by character with:

1. strictly increasing columns, `C1 < C2 < ... < CL` (rows unrestricted);
2. `sum of (Ri - Ci) = TARGET`.

Output `Hash = sum of (Ri+1) * (Ci+1)` (1-based).

**Part 2.** Keep that path. For each cell `(Ri, Ci)` with character `X`, find the closest *other* cell with the same character `X` on a torus (distance `min(|dr|, ROWS-|dr|) + min(|dc|, COLS-|dc|)`), ignoring candidates on column `0` or `COLS-1`. Ties: lowest row, then lowest column. Take its left and right neighbour characters `(r, c-1)`, `(r, c+1)`. Concatenate the pairs for the whole word (a payload of `2L` characters) and output `sum of ASCII(char_k) * k`, `k = 1..2L`.

Example: word `AB`, target `1`, matrix `xAxxB / xxBxA / AxBxx`. The path is A at `(2,0)`, B at `(1,2)` (checksum `2 + (-1) = 1`), hash `3*1 + 2*3 = 9`. Part 2: twin of A is `(0,1)` (`(1,4)` is on the border), twin of B is `(2,2)`; both neighbour pairs are `xx`, payload `xxxx`, answer `120 * (1+2+3+4) = 1200`.

## Part 1 — find the constrained path

**Observations**

- Each position in the word picks one cell among all cells containing that letter. The constraints are a chain (`C` strictly increasing) plus one global sum. That is a search over choices per letter.
- The matrix has 360 000 cells; the word has up to 28 letters.

**Naive approach and why it fails**

Try every combination of occurrences: the product of the occurrence counts. For a generic matrix each letter may appear thousands of times, so this is hopeless. Even with only two occurrences per letter (which is what the generator does, see below) there are `2^28` combinations, which also does not run in time. Rescanning the whole matrix for each letter and each branch also wastes `360 000` cell visits every time.

**Key insights**

1. Collect candidates once. Scan the matrix a single time and, for each letter used in the word, keep the list of its positions. Scan **column-major** (outer loop over `c`, inner loop over `r`), so every list comes out sorted by column. This is what makes step 3 possible.
2. Bound the remaining sum. Precompute, going backwards over the word, the smallest and largest total of `(r - c)` that letters `i..n-1` can still contribute:

   ```text
   minS[i] = min(r - c over candidates[i]) + minS[i + 1]
   maxS[i] = max(r - c over candidates[i]) + maxS[i + 1]     (minS[n] = maxS[n] = 0)
   ```

   If the amount still needed, `need = target - sumSoFar`, is outside `[minS[i], maxS[i]]`, no choice downstream can fix it and the branch is dead immediately.
3. Binary search the column constraint. Since `candidates[i]` is sorted by column, the first candidate with `column > prevCol` is found with a binary search (`start`), and the loop only visits `j >= start`.

**Algorithm (`solve1.ts`)**

1. `parse` reads `WORD:`, `TARGET:` and the matrix after `MATRIX:`; it checks all rows have the same width and drops empty lines.
2. `charPositions` (map from letter to positions) is built column-major for the letters of the word only; `candidates[i] = charPositions.get(word[i])`.
3. Build `minS` / `maxS` for `i = n-1 .. 0`.
4. Depth-first search `bt(i, sumSoFar, prevCol)`:
   - `i === n`: succeed iff `sumSoFar === target`;
   - prune if `need` is outside `[minS[i], maxS[i]]`;
   - binary search `start`, then try each `cand[j]` from `start`: record `result[i] = [r, c]`, recurse with `sumSoFar + (r - c)` and `prevCol = c`; return `true` as soon as one branch works.
5. `computeHash(result)` returns `sum (r+1)*(c+1)`.

**Why it is fast on the generator's inputs**

Each letter of the word occurs exactly twice: the real cell and a twin in the **same column** but a **strictly greater row** (so `r - c` for the twin is larger). Hence

```text
target = sum of the real (r - c)  =  minS[0]
```

The real path is the minimum possible sum. Taking a twin at step `k` makes `sumSoFar` too large, so `need` falls below `minS[k+1]` and the very next call prunes. The DFS therefore goes down essentially one path with a trivial amount of backtracking: `O(L)` calls, each with a binary search over a 2-element list. Candidate lists are also sorted with the smaller row first inside a column, so the real cell is even tried first. The pruning is what makes the solver correct and fast in general, not just by luck of ordering.

**Complexity**

Preprocessing: `O(ROWS * COLS)` for one scan (about 360k cells). Search: tiny on these inputs; in the worst case on arbitrary inputs it is exponential in `L`, which the bounds and the uniqueness guarantee keep in check.

## Part 2 — nearest twin on a torus

**What changes**

Part 1 found *where* the path is; part 2 needs the path *and* a different kind of query: nearest same-letter cell under toroidal distance, followed by a neighbour read. The search (`bt`, `minS`, `maxS`) is repeated verbatim in `solve2.ts` (the file also imports `parse` from `./solve1`) to recover the coordinates `coords`; then a second phase handles each letter.

**Algorithm**

1. Build `occ`: for **every** character, the list of all its positions (row-major here, not just the word's letters, but only those of the word's letters are queried).
2. For each `i`, with `X = word[i]` and `(sr, sc) = coords[i]`:
   - loop over `occ.get(X)`;
   - skip the cell itself (`r === sr && c === sc`) and skip border columns (`c === 0 || c === cols - 1`);
   - `d = toroidalDist(...) = min(dr, rows - dr) + min(dc, cols - dc)` where `dr`, `dc` are absolute differences;
   - better `d` replaces the best; equal `d` replaces only if the row is smaller, or the row is equal and the column is smaller.
3. Append `matrix1[bestR][bestC - 1] + matrix1[bestR][bestC + 1]` to `payload`. The border exclusion guarantees both neighbours exist inside the row (no wrap for neighbours, only for the distance).
4. `weightedASCII(payload)` returns `sum charCodeAt(k) * (k + 1)`.

```text
distance on a torus: going "around" can be shorter
rows = 3: |2-0| = 2  -> min(2, 3-2) = 1
```

**Complexity**

Search as above; building `occ` is one pass over the 360k cells; each letter scans its own occurrence list (2 entries here). Total about `O(ROWS * COLS + L * occurrences)`.

**What the generator guarantees**

The real cell has exactly one other occurrence of its letter: its twin, in the same column (which is never `0` or `COLS-1`, columns are drawn from `1..COLS-2`), in a lower row. So the "nearest twin" is always that single twin, at toroidal distance `min(dr, ROWS - dr)`. The general tie-break and border code is still written because the statement requires it.

## Pitfalls / traps

- **Twin decoys in part 1.** A twin has the same letter and the same column as the real cell, so every column-progression check passes for it. Only the checksum (and the pruning built on it) discriminates. The twin is always placed on a greater row, so it always *increases* `r - c`.
- **Exponential search without bounds.** `2^L` combinations (`L` up to 28) if you do not prune on the achievable sum. Also avoid rescanning the matrix inside the recursion.
- **Strict column progression**: `cand[mid][1] > prevCol`, not `>=`.
- **Sorted candidate lists** are a precondition of the binary search, hence the column-major scan.
- **Signed targets.** `r - c` is often negative; `TARGET` is signed. The sums stay within safe-integer range, `parse` explicitly checks `Number.isSafeInteger(target)`.
- **1-based hash** in part 1 `(r+1)*(c+1)`, **1-based weights** in part 2 `(k+1)`, but 0-based coordinates for distances.
- **Border exclusion** in part 2 applies to the *twin*, not the original cell.
- **Toroidal distance** uses absolute differences first and then the wrap-around alternative; no wrap for neighbours.
- **Parsing.** The matrix is on lines after `MATRIX:`; keep only non-empty lines and compute `rows`/`cols` from them. Letters are case-sensitive and mixed with digits as noise (the noise alphabet excludes the letters of the word, so only the real cells and twins match).

## Files

- `solve1.ts` — parse, per-letter candidate lists (column-major), suffix bounds `minS`/`maxS`, DFS with binary search on columns; returns the 1-based positional hash. Also exports `parse`.
- `solve2.ts` — re-finds the same path, then for each path cell picks the nearest valid toroidal twin (ties by row, then column), reads its left and right neighbours and returns the weighted ASCII sum of the payload.
