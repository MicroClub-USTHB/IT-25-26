# Challenge 10 — Network Navigation

## Problem

Input: a directed weighted graph.

- Line 1: `N M` (the generator produces `N` between 3000 and 5000).
- Next `M` lines: `A B W`, a directed edge `A -> B` with positive weight `W`.

**Part 1.** You may reverse at most one edge (`A -> B` is replaced by `B -> A`, same weight; the original is removed), or none. Find the minimum total weight of a directed cycle in the resulting graph.

**Part 2.** Decompose the original graph into strongly connected components (SCCs). The weight of an SCC with at least 2 nodes is the weight of its cheapest directed cycle using only edges inside it (original directions); a single-node SCC has weight 0. Build the condensation DAG (one edge per connected SCC pair). Find the path through the maximum number of SCCs; ties are broken by the largest sum of SCC weights along the path. Output that sum.

Example (6 nodes, 8 edges: `0->1(5) 1->2(5) 2->0(50) 0->2(20) 3->4(4) 4->5(4) 5->3(40) 1->3(1)`):

- Part 1: no reversal gives `48` (cycle `3-4-5`). Reversing `0->2(20)` into `2->0(20)` closes `0->1->2` (cost 10) into a cycle of `30`. Answer `30`.
- Part 2: SCCs `{0,1,2}` (weight 60) and `{3,4,5}` (weight 48), joined by `1->3`. The longest chain is 2 SCCs, `60 + 48 = 108`.

## Part 1 — shortest cycle with one reversal

**Observations**

- A simple cycle that exists after reversing edge `e = u -> v (w)` either avoids the reversed edge (then it is an original cycle that does not use `e`), or uses the new edge `v -> u (w)` once. In the second case the rest of the cycle is a path `u ~> v` in the graph **without** `e`. So its cost is `w + shortestPath(u, v) without e`.
- Cycles with no reversal: any edge `u -> v (w)` closes a cycle with the shortest path `v ~> u`, cost `w + dist(v, u)`. Minimising over all edges gives the best original cycle.
- So the answer is the minimum, over all edges `e`, of `w + dist(v,u)` and `w + dist_without_e(u,v)`.

**Naive approach and why it fails**

For each of the `M` edges, build the flipped graph and run Dijkstra (`O(E log V)`) to find the best cycle: `O(M * E log V)`. With `N, M` in the thousands that is tens of billions of operations. Running a full Dijkstra just to learn one distance is the waste.

**Key insight**

Precompute all-pairs shortest distances once, then answer each edge in `O(1)` in almost all cases:

- `d0 = dist(u, v)` is the shortest path in the full graph. If `d0 < w`, then a shorter route than the edge itself exists, and it cannot use `e` (a simple path from `u` to `v` that used `e` would be just `e`, costing `w`). So `dist_without_e = d0`.
- If `d0 === w`, the edge itself may be the shortest path, so `d0` would produce a fake cycle that re-uses the removed edge. Only in this case run a fresh Dijkstra that skips edge `e` (`dijkstraSkipEdge`).

**Algorithm (`solve1.ts`)**

1. Parse tokens into `edges`; store the graph in forward-star arrays: `head`, `next`, `to`, `w`, `src` (typed arrays for speed; an edge is identified by its index `ei`).
2. `distAll = new Int32Array(N * N)` filled with `INF = 0x3fffffff`. For every source `s`, run Dijkstra with a hand-written binary `MinHeap` (lazy deletion: `if (d !== getDist(u)) continue`). `distTmp`/`seen`/`stamp` avoid re-initialising arrays: a value is valid only if `seen[u] === stamp`. Copy results into row `s` of `distAll`.
3. For each edge `ei = (u, v, ww)`:
   - **No reversal:** `back = distAll[v * N + u]`; if reachable, candidate `ww + back`.
   - **Reversal:** `d0 = distAll[u * N + v]`; skip if unreachable. If `d0 === ww`, replace it by `dijkstraSkipEdge(u, v, ei)` (second `dist2/seen2/stamp2` set, stops as soon as `t` is popped). Candidate `ww + dNoEdge` if finite.
4. Return the minimum candidate.

```text
edge e = u -> v (w), reverse it:   v -> u (w)
cycle:   u ~~~(path avoiding e)~~~> v  --(w, reversed)--> u
cost  =  w + dist_without_e(u, v)
```

On the example: edge `0->2(20)`, `d0 = dist(0,2) = 10 < 20`, so the candidate is `20 + 10 = 30` without any extra Dijkstra. Edge `0->1(5)`: `d0 = 5 = w` so the skip-edge Dijkstra runs and finds no path.

**Complexity**

`N` Dijkstras: `O(N * M log N)` time. About 5000 runs on a sparse graph with roughly `N` edges, fine. Memory: `distAll` is `N * N` int32, up to `25 million * 4 B = 100 MB` at `N = 5000`. The extra Dijkstras happen for edges with `d0 === w`, which on this generator's graphs is most ring edges (the ring is the only route), but each run only explores the part of the graph reachable and stops at `t`, so total work stays small.

## Part 2 — SCCs, per-SCC cheapest cycle, longest chain DP

**What changes**

Part 1 is a global question solved with all-pairs distances and allows a reversal. Part 2 has no reversal, cares about structure (SCCs), and needs a **per-SCC** value, then a DP over the DAG of SCCs. The all-pairs table is no longer the right tool: we only need distances *inside each SCC* (much smaller graphs) and from sources *within* that SCC. The Part 1 idea of "edge plus shortest return path" is reused inside each SCC.

**Algorithm (`solve2.ts`)**

1. **Graph arrays.** `adj` (forward), `radj` (reverse), `adjW` (forward with weights).
2. **SCC by Kosaraju (`kosarajuSCC`).**
   - Pass 1: DFS on `adj`, recording nodes in finish order (`order`). The DFS is **iterative**: `stack` holds nodes, `itStack` holds each node's next-neighbour pointer, so a 5000-deep chain does not overflow the JS call stack.
   - Pass 2: process `order` from the last finished to the first. For each unassigned start, flood over `radj` (a BFS queue is enough, it just collects everything reaching the start among unassigned nodes) and label with `sccCount`. Result: `sccId[u]` and `S = sccCount`.
3. **Weight of each SCC (`minCycleInSCC`).** If the SCC has fewer than 2 nodes, weight 0. Otherwise for **every source node `s` of the SCC** run Dijkstra restricted to edges whose target has the same `sccId`. When an edge relaxes into `s` itself, do not push it; record `nd` as a cycle candidate (`best = min(best, nd)`). The cheapest candidate over all sources is the minimum directed cycle. Note this uses original directions only and considers the chords/shortcuts that exist in the SCC (a cheap chord can bypass part of the ring).
4. **Condensation.** For each original edge with `sccId[a] !== sccId[b]`, add `sb` into `condSets[sa]` (a `Set`, so duplicates collapse); `condAdj` is the sorted list.
5. **Topological order (Kahn).** Compute `inDeg`, push zero-in-degree SCCs, pop and decrement.
6. **DP over the DAG.** `bestLen[s]` = max number of SCCs on a path ending at `s` (starts at 1), `bestSum[s]` = best weight sum among paths achieving that length (starts at `weight[s]`). In topological order, for every `u -> v`:

   ```text
   candLen = bestLen[u] + 1
   candSum = bestSum[u] + weight[v]
   if candLen > bestLen[v] or (candLen == bestLen[v] and candSum > bestSum[v]):  update v
   ```

   Comparing `(length, sum)` lexicographically is exactly the statement's tie rule.
7. Answer: among SCCs with `bestLen === maxLen`, the largest `bestSum`.

On the example: `sccId` splits `{0,1,2}` and `{3,4,5}`; `weight = [60, 48]`; the only cross edge `1->3` gives `bestLen = 2`, `bestSum = 108`.

**Complexity**

Kosaraju `O(N + M)`. Per-SCC cheapest cycle: for an SCC of size `s` with `m_s` internal edges, `s` Dijkstras of `O(m_s log s)`, so at most `500 * ~500 * log` per SCC here and about `10` times that overall. DAG DP `O(S + cross edges)`.

## Pitfalls / traps

- **Generator structure.** `K = 10` SCCs of 300 to 500 nodes. Each is a directed ring: cheap edges `i -> i+1` (5..20) and **one huge closing edge** (about 50 000 to 90 000). Every natural cycle therefore costs at least about 50 000. The SCCs are linked in a strict chain by exactly `K-1` cross edges (weights 1..50), forward only, so SCCs never merge and the condensation is a single path of length 10.
- **The planted chord** `u -> v` (weight 200..2000) inside the first SCC of the chain, spanning 8..25 cheap ring edges. Reversing it gives `v -> u` plus the ring path `u ~> v`, a cycle of roughly a few hundred to a couple of thousand, far below 50 000. That is the Part 1 answer (`chord weight + ring path from u to v`); reversing a ring or cross edge never helps since the alternative route must go through a huge edge or does not exist. No-reversal cycles are all huge, but they must still be considered because the statement allows "at most one" reversal.
- **Do not re-use the removed edge.** For a reversed `u -> v`, the plain `dist(u, v)` may be the edge itself (then `d0 === w`). Using it would build a "cycle" that needs the edge you just deleted. This is why `dijkstraSkipEdge` exists and why the check is `d0 === ww` rather than `d0 < INF`.
- **Cost of the naive "reverse every edge" approach** (`M` Dijkstras per candidate) and the `N * N` memory of all-pairs: 100 MB of `Int32Array` is OK, a `number[][]` or `Map` is not.
- **Overflow / infinity.** `INF = 0x3fffffff` fits in int32 and is never added to anything (`d0 >= INF` is checked before use), real distances are well below it. Typed `Int32Array` would silently wrap if it were.
- **Recursion depth.** A recursive DFS over a 5000-node chain may overflow the call stack; Kosaraju is written iteratively (`stack` + `itStack`).
- **Node ids and edge order are shuffled** by the generator, so SCCs are not contiguous ranges and cross edges are not recognisable by index: use real SCC detection.
- **Per-SCC Dijkstra must be restricted to the SCC** (`sccId[e.to] !== scc` skip), otherwise it would wander into other components. The edge back to the source is recorded as a cycle but never relaxed further.
- **Singleton SCCs have weight 0** and an SCC of size 1 has no cycle. The code returns 0 when `nodes.length < 2` (and when no cycle is found).
- **Parallel cross edges** must be deduplicated in the condensation (the `Set`); otherwise `inDeg` counts would still work, but the semantics ("keep one edge") are explicit in the statement.
- **Tie rule** is "max SCC count first, then max weight sum", not "max sum first".

## Files

- `solve1.ts` — all-pairs Dijkstra (`distAll`), then for every edge combines "no reversal" (`w + dist(v,u)`) with "reversal" (`w + dist(u,v)` avoiding that edge, recomputed with `dijkstraSkipEdge` only when `d0 === w`).
- `solve2.ts` — iterative Kosaraju SCCs, per-SCC cheapest cycle via restricted Dijkstras, condensation DAG with a `Set` dedupe, Kahn topological order and `(length, sum)` DP; returns the winning weight sum.
