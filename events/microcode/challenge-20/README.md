# Challenge 20 — Bazaar Bidding

## Problem

A bazaar auction: choose which **bids** win so the net revenue is maximal.

```
N B C                               items, bids, categories
cat_0 ... cat_{N-1}                 category of each item
price i_1 ... i_k | e_1 e_2 ... > d_1 d_2 ...      B bid lines
C lines of C integers               penalty matrix pen[a][b]
Q                                   number of queries (part 2)
Q query lines
```

For a bid line: `price`, then the items it wants, then after `|` the bids it **excludes**, then after `>` the bids it **depends on** (both lists may be empty, e.g. `10 0 1 | >` or `6 6 7 | 3 > 1`).

`score = sum(prices of winners) - sum over pairs of winners of pairwise penalty`, subject to:

1. **No item overlap** between two winners.
2. **Exclusivity**: if `X` wins, nothing in `X`'s exclusion list wins (the relation is symmetric in effect).
3. **Dependencies**: if `X` wins, all bids in `X`'s dependency list win too, transitively.

Pairwise penalty of winners `A` and `B`: let `cats(A)`, `cats(B)` be the **sets** of categories touched by their items; the penalty is `sum pen[ca][cb]` over `ca` in `cats(A)`, `cb` in `cats(B)`. Only pairs of *different* winners count.

- **Part 1**: the maximum score.
- **Part 2**: process `Q` cumulative queries and print the **sum** of the result of each:
  - `A b`: force bid `b` (and its whole dependency closure) to win. Bids sharing items with it, and bids it excludes, are disqualified. If it contradicts earlier forces/bans/disqualifications the result is `0` and nothing changes.
  - `B b`: ban `b` forever. A forced bid whose dependencies include `b` becomes illegal and is dropped too.
  - `C b p`: set the price of `b` to `p`, permanently.
  - `K k`: no state change; result is the **k-th largest distinct score** among all valid winner sets (the smallest found if fewer than `k` distinct scores exist).
  - for `A`, `B`, `C` the result is the new optimal score.

Sample (8 items, 6 bids, 2 categories, queries `B 2`, `A 3`, `K 2`): part 1 is `27` (bids 0, 1, 2: `10 + 8 + 15 - 6`), part 2 is `72`.

Generator facts (useful for sizing): `B` 220-250, `N` 110-140, `C` 26-32, `Q` about 550-600, bids ask 5-15 items out of ~110-140 (bid 0 asks 3 "anchor" items nobody else touches), prices 10..9999, penalties 0..20 (symmetric, zero diagonal). The graph structure is the same for everyone; only prices, penalties and item categories differ. Roughly three quarters of the queries are `C`, a fifth `K`, and `A`/`B` are rare.

## Part 1 - exact branch and bound

**Observations**

- Maximum-weight set packing is NP-hard, and the pairwise penalties make it a quadratic objective. `2^B` subsets is hopeless, and a DP over item bitmasks is out of the question with ~120 items.
- But the instance is *dense in conflicts*: each bid takes 5-15 of ~120 items, so most bid pairs overlap. An optimal solution therefore contains few winners and a branch and bound with a good bound has a shallow, narrow tree.
- Penalties are non-negative. Ignoring them gives an **upper bound** on any partial solution's potential, which is what the bound exploits.

**Precomputation** (`parse`)

- `closure[i]`: `i` plus all transitive dependencies (DFS over `deps`).
- `cats[i]`: the distinct categories of `i`'s items (`new Set`).
- `bidPen[i][j]` (an `Int32Array` per bid): the full bid-to-bid penalty, so scoring a pair is `O(1)`.
- `conflictOf[i]`: every `j` with item overlap or with `j` in `i`'s exclusion list or `i` in `j`'s. Conflicts are made symmetric.

**Search state** (`solveAuction`)

Part 1 calls it with every bid available and none forced; part 2 reuses the same idea with real forced/unavailable sets.

- Forced bids give `baseScore` (their prices minus pairwise penalties among themselves) and `usedItems`.
- `candidates`: the bids that are neither forced nor unavailable, **sorted by price descending** (rich bids are decided first, so good solutions and tight bounds appear early). `candPos[bid]` maps a bid to its position, `-1` when it is not a candidate.
- `density[ci] = price / number of items`. `itemCands[item]` lists candidate positions covering the item sorted by density. `sufSum[i]` is the sum of prices of candidates `i..M-1`.
- Mutable branch state: `forb2` (positions that may no longer be taken), `usedItems2`, `freeWinners`, `freeScore` (prices minus penalties, relative to forced and earlier free winners).

**Bounds**

1. `sufSum` bound: `baseScore + freeScore + sufSum[idx] <= best` means even taking every remaining bid cannot win.
2. `lpRelaxUB(idx)`: for every item not yet used, add the best `density` among candidates at position `>= idx` that are not `forb2`. Why it is an upper bound: a bid's price equals the sum of its per-item density over its items, and winners have disjoint items, so total price is at most the sum, over items, of the best density available for that item. Penalties are ignored (they only reduce the score). The name "LP relaxation" refers to this fractional view.
3. `greedySeed()`: scan candidates by price, take a bid if its items are free, it has no exclusion conflict with the current winners and all of its dependencies are already winners; subtract penalties. This gives a decent initial `best` so the bounds prune from the first node.

**The recursion** `bb(idx)`: decide candidate `idx`.

```
if base + free + sufSum[idx] <= best : return
if lpRelaxUB(idx)            <= best : return
if idx == M : best = max(best, base + free) ; return

include branch (if !forb2[idx]):
    package = the bid + every dependency in its closure that is not already forced
    all must be candidates (pos != -1), not forb2, with all items free; the bid's own items must be free
    for each bid in the package: add penalties against forced and current free winners,
        add price, mark items used, mark it and all conflictOf[...] neighbours forb2
    bb(idx + 1), then undo everything
exclude branch: bb(idx + 1)
```

A bid is therefore always taken **together with its dependency closure**, and penalties are charged when the later member of a pair arrives, so each pair is counted exactly once. Result: `best`.

**Complexity**: exponential in the worst case, but with these structures it takes about one second for part 1.

## Part 2 - a stream of modifications

**What changes**: the single solve becomes about 600 re-solves of an evolving problem (forced, banned, disqualified bids and changed prices), plus a different objective for `K` queries. Each solve must be fast, and the state transitions must be exactly right.

**State** (in `solve`)

- `prices` (mutable copy, because `C` queries change it; `solveCore` reads `prices[]`, not `bids[].price`), `banned`, `forced`, `forcedItems`, `disq`.
- `getAvailable()` = not banned and not disqualified.
- `rebuildForcedState()` recomputes `forcedItems` and `disq` **from scratch** after every change: disqualify any non-banned, non-forced bid that shares an item with a forced bid, any bid that lists a forced bid in its exclusions, and every bid in a forced bid's exclusion list. Recomputing is simpler and safer than updating incrementally.

**Query handling**

- `A b` -> `applyForce(b)`: reject (return `0`, no change) if any bid of `closure(b)` is banned or disqualified, overlaps forced items, conflicts by exclusion (either direction) with a forced bid, or conflicts with another member of the closure. Otherwise add the whole closure to `forced`, rebuild the state, and re-solve.
- `B b` -> ban `b`; every forced bid whose closure contains `b` is removed from `forced` and banned (closures are transitive, so one pass covers all ancestors); rebuild the state; re-solve. Bids that depended on `b` need no special handling: `b` is no longer a candidate (`candPos = -1`), so the include branch fails for them.
- `C b p` -> `prices[b] = p`; re-solve (this can change a forced bid's contribution, hence prices are passed in).
- `K k` -> call `solveCore` with `topK = k` on the unchanged state and add the **last** (smallest) element of the returned list, `0` if the list is empty.

`solveCore` is the part 1 branch and bound with the forced set as the base (`forcedList`, `forcedItems`) and the live `prices`.

**Top-K distinct scores**: the objective changes from "best" to "k best distinct values".

- `scoreSet` collects the distinct scores of leaves (it starts with `baseScore`, the "add nothing" set), so equal scores from different winner sets count once, as the statement requires.
- Pruning can no longer use `best`. A node may be cut only if its upper bound is `<= cachedKthBest`, the k-th largest distinct score so far (`-Infinity` until `k` distinct scores exist). Such a node cannot create a new score in the top `k`.
- `cachedKthBest` is recomputed only when a **new** distinct score is inserted (`updateKthBest`, a sort of the set), so each pruning test is `O(1)`.
- At the end the result is the descending sorted `scoreSet`, first `k` entries.

**Cost**: about 3-4 seconds in total for ~600 queries on a laptop. It stays fast because the bounds prune hard and because every forced bid shrinks the candidate list (the items it uses disqualify all overlapping bids).

## Pitfalls / traps

- **Parsing**: lists around `|` and `>` can be empty; use `indexOf('|')` and `indexOf('>')` and treat blank strings as empty lists.
- **Dependencies are transitive** (use `closure`), and winning a bid *forces* its closure; the closure's prices and penalties all count.
- **Penalty accounting**: pairs of different winners only, charged once; forced bids take part in penalties with the free winners and with each other (`baseScore`).
- **Category sets, not multisets**: a bid touching a category through several items still counts that category once.
- **Contradictory `A`** returns `0` and must not alter the state; **`K` never alters the state**; `B`, `C`, `A` are cumulative.
- **`B` on a dependency of a forced bid** drops every forced bid whose closure contains it (only those bids, not the rest of their closures) while keeping the ban.
- **Top-K distinct**: duplicates of the same score count once, and non-maximal winner sets count too (the empty extra set contributes `baseScore`).
- **Never prune with the best score in Top-K mode**; use the k-th best.
- **Number sizes**: scores stay in the low millions, so `Number` is exact (penalty sums fit in `Int32Array`).
- **Caveat about the reference code** (it does not show up on generated data): (a) a dependent of an already-taken bid is rejected, because `forb2` is also set for winners, so two winners sharing a common dependency are never produced; (b) `sufSum` and `lpRelaxUB` only look at positions `>= idx`, yet a later bid can still pull in a dependency sitting *earlier* in price order, whose price is then missing from the bound. On adversarial inputs this can prune the true optimum. Ordering dependents before dependencies and skipping dependencies that are already winners fixes both; on the generated inputs such a variant returned the same totals (checked for several users). Keep this in mind before reusing the code on arbitrary data.

## Files

- `solve1.ts`: parser, precomputed closures/penalties/conflicts, and `solveAuction`, the branch and bound with greedy seed, price-sorted candidates, sum bound and density ("LP relaxation") bound.
- `solve2.ts`: same engine as `solveCore` with forced base and live prices, optional top-K mode (`scoreSet` plus `cachedKthBest`), and the query state machine (`applyForce`, `rebuildForcedState`, ban cascade) that sums the query results.
