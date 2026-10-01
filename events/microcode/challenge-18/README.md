# Challenge 18 — Thermal Partition

## Problem

A row of heat tiles must be split into contiguous cooling zones. A zone whose tiles sum to `S` has stress `S * S`. Minimize the **total** stress. Every zone has at least one tile, and the zones cover the sequence with no gaps or overlaps.

```
N1 K1 N2 K2
v_0 v_1 ... v_{N2-1}
```

- Part 1: split the **first `N1` tiles** into exactly `K1` zones.
- Part 2: split **all `N2` tiles** into exactly `K2` zones.
- Values are non-negative integers (0..1000 in the generator). Generator sizes: `N1` 80-150, `K1` 8-25, `N2` 1200-2000, `K2` 80-250.

Sample: `5 2 10 4` with `4 2 3 1 5 6 2 3 7 1`.

| Partition (first 5 tiles, K = 2) | Zone sums | Total |
| :------------------------------- | :-------- | :---- |
| [4] \| [2 3 1 5]                 | 4, 11     | 137   |
| [4 2] \| [3 1 5]                 | 6, 9      | 117   |
| [4 2 3] \| [1 5]                 | 9, 6      | 117   |
| [4 2 3 1] \| [5]                 | 10, 5     | 125   |

Part 1 answer `117`; part 2 answer (all 10 tiles, 4 zones) `302`.

## Part 1 - classic partition DP

**Observations**

- Zones are contiguous, so a solution is just a choice of `K-1` cut points. Brute force is `C(N-1, K-1)`, astronomically large already for `N = 100`.
- The cost of the last zone only depends on its sum, and the sum of any segment is `prefix[r] - prefix[l]` in `O(1)` after one pass of prefix sums.
- Optimal substructure: if the last zone is `(j, i]`, the first `j` tiles must be split optimally into `k-1` zones.

**Key idea**: `dp[k][i]` = minimal total stress splitting the first `i` tiles into `k` zones.

```
dp[1][i] = prefix[i]^2
dp[k][i] = min over j in [k-1, i-1] of  dp[k-1][j] + (prefix[i] - prefix[j])^2
```

`j` is where the last zone starts: the first `k-1` zones need at least `k-1` tiles (`j >= k-1`) and the last zone needs at least one (`j <= i-1`). The answer is `dp[K][N]`.

**Algorithm** (`solve1.ts`)

1. Header gives `N = header[0]`, `K = header[1]`. The second line holds all `N2` numbers, so take `allValues.slice(0, N)`: part 1 only uses the first `N1` tiles.
2. `prefix` is a `Float64Array` of prefix sums; `segCost(l, r)` returns `(prefix[r+1] - prefix[l])^2`.
3. Only two rows are kept: `prev` (layer `k-1`) and `curr` (layer `k`). `prev` starts as layer 1, `curr.fill(INF)` at the start of each layer, and the rows are swapped at the end of the layer. `INF = Number.MAX_SAFE_INTEGER` marks unreachable states (`i < k`).
4. Triple loop `k = 2..K`, `i = k..N`, `j = k-1..i-1`, keeping the minimum.
5. Return `prev[N]` after the final swap.

**Complexity**: `O(N^2 * K)` time (about `150^2/2 * 25 ~ 3e5` steps here), `O(N)` memory.

## Part 2 - same DP, but the inner minimum must be sped up

**What changes**: the sizes. The statement is identical (same cost, same constraints), but now `N2` is up to ~2000 and `K2` up to ~250, and the input header must be read from its **second pair** (`header[2]`, `header[3]`) with the whole line of values.

Part 1's inner loop is `O(N)` per state, so total `~ N^2 K / 2`, up to about `5 * 10^8` here (2-3 seconds in a JS engine on the larger inputs). The organizer's notes target an even larger scale (`N2 = 4000`, `K2 = 600`, about `10^10` steps), where it is hopeless, so the transition has to become `O(log N)` amortized. The recurrence itself is unchanged.

**Key insight: the optimal split point is monotone.** Let `opt[k][i]` be the best `j` for `dp[k][i]`. If the cost `w(j, i) = (prefix[i] - prefix[j])^2` satisfies the *quadrangle inequality* (for `a <= b <= c <= d`: `w(a,c) + w(b,d) <= w(a,d) + w(b,c)`), then `opt[k][i] <= opt[k][i+1]`.

Why it holds here: `x -> x^2` is convex, the pairs `(a,c),(b,d)` and `(a,d),(b,c)` have the same total length, and the nested pair `(a,d),(b,c)` is more spread out, so its squares sum to more. That argument needs the prefix sums to be non-decreasing, which is exactly why the generator keeps values **non-negative**.

**Divide and conquer optimization.** To fill one layer `curr[lo..hi]` knowing that the optimum for all these `i` lies in `[optLo, optHi]`:

1. Take `mid = (lo + hi) >> 1` and scan `j` from `optLo` to `min(mid - 1, optHi)`, computing `prev[j] + (prefix[mid] - prefix[j])^2`. Keep the best value and its `bestJ`.
2. Store `curr[mid]`.
3. By monotonicity the left half `[lo, mid-1]` only needs `j` in `[optLo, bestJ]`, the right half `[mid+1, hi]` only `j` in `[bestJ, optHi]`.

Each level of the recursion scans about `N` candidate `j` in total (ranges overlap only at their endpoints) and there are `log N` levels, so one layer costs `O(N log N)`.

`solve2.ts` implements this with an explicit stack instead of recursion: entries are `[lo, hi, optLo, optHi]`, a layer starts with `stack.push([k, N, k - 1, N - 1])` (valid `i` are `k..N`, valid `j` are `k-1..N-1`), and each popped entry pushes its right and left children as above. Strict `<` keeps the leftmost minimizer; the lower bound `optLo >= k-1` also guarantees `prev[j]` is a real value, never `INF`.

Layer 1 is initialized as `prev[i] = prefix[i]^2`, and after each layer `prev`/`curr` are swapped. The answer is `prev[N]`.

**Complexity**: `O(K * N log N)`, about `250 * 2000 * 11 ~ 5.5e6` steps, roughly 0.1 s versus seconds for the plain DP. Memory `O(N)`.

## Pitfalls / traps

- **Two sub-instances in one input**: part 1 uses the first `N1` values and `K1`, part 2 uses all `N2` values and `K2`. Using the full array in part 1 is wrong.
- **Each zone needs at least one tile**: loop bounds `i >= k` and `j >= k-1`. Allowing empty zones gives a smaller (wrong) answer, especially as zero-valued tiles exist.
- **Magnitudes**: the largest possible total is `(2000 * 1000)^2 = 4e12`, below 2^53, so `Number`/`Float64Array` are exact. The sentinel must be larger than any real answer (`1e18` in part 2); never add `INF` values in a way that loses precision on real states.
- **Do not use the divide and conquer trick on arbitrary costs**: it relies on the quadrangle inequality, guaranteed here only by non-negative values.
- **Recursion depth / call overhead**: the explicit stack avoids JS recursion overhead; the depth is only `log N` anyway.
- Off-by-one on the monotone ranges: the left child keeps `bestJ` as its upper bound and the right child keeps it as its lower bound (both inclusive).

## Files

- `solve1.ts`: `O(N1^2 K1)` rolling-array DP on the first `N1` tiles.
- `solve2.ts`: the same DP over all `N2` tiles with the divide and conquer transition (iterative stack), `O(K2 N2 log N2)`.
