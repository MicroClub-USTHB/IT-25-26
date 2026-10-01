# Challenge 06 — Linguistic Lineage

## Problem

Input: a rooted binary tree.

- Line 1: `N` (1 <= N <= 2000), nodes labelled `0..N-1`, root is `0`.
- Next `N-1` lines: `P C` (node `P` is the parent of `C`). Each node has at most 2 children, and a parent's index always appears before its children's.

**Part 1.** Let `mat[i][j] = 1` if `i` is a *strict* ancestor of `j` (a node is not its own ancestor). Compute `sum of mat[i][j] * (j - i)^2` modulo `1_000_000_007`.

**Part 2.** For every pair of distinct nodes `i < j`, take `depth(LCA(i, j))` (a node is its own ancestor here, `depth(root) = 0`). Output the sum over all pairs, modulo `1_000_000_007`.

Example (`N = 5`, edges `0-1, 0-2, 1-3, 1-4`):

```text
        0
       / \
      1   2
     / \
    3   4
```

- Part 1: ancestor pairs are (0,1) (0,2) (0,3) (0,4) (1,3) (1,4) -> `1 + 4 + 9 + 16 + 4 + 9 = 43`.
- Part 2: only (1,3), (1,4), (3,4) have LCA = node 1 at depth 1, everything else has LCA = root (depth 0) -> `3`.

## Part 1 — sum over ancestor pairs

**Observations**

- The "matrix" `mat` is just the set of (ancestor, descendant) pairs. In a tree, a node `j` at depth `d` has exactly `d` strict ancestors, so there are `sum of depths` pairs in total, not `N^2`.
- The term `(j - i)^2` depends only on the labels, so there is nothing clever to compress, we only need to enumerate each pair once.

**Naive approach and why it is wasteful**

Building the full `N x N` matrix and then summing costs `O(N^2)` memory and time (4 million cells for `N = 2000`). It would pass at this size, but it is pointless: most cells are 0.

**Key insight**

Only the 1-cells matter, and every 1-cell corresponds to "walk up from `j`". So skip the matrix and enumerate ancestors directly.

**Algorithm (`solve1.ts`)**

1. Read the edges into a single array `parent[c] = p` (root keeps `-1`).
2. For every `j` from `1` to `N-1`, start with `anc = parent[j]` and climb: `anc = parent[anc]` until `anc === -1`.
3. At each step add `(j - anc)^2` to `result` and reduce `% MOD` right away.
4. `N === 1` returns `0` immediately (no edges to read, no pairs).

```text
j = 4 : anc = 1 -> (4-1)^2 = 9 ; anc = 0 -> (4-0)^2 = 16 ; anc = -1 stop
```

Every accumulated value is computed with `BigInt` (`diff * diff`, `MOD` is `1_000_000_007n`), so there is no precision issue even if `(j - anc)^2` were multiplied further.

**Complexity**

`O(sum of depths) = O(N * D)` time where `D` is the tree height, `O(N)` memory. The worst case is a chain (`D = N`), which gives about `N^2 / 2 = 2 million` iterations for `N = 2000`, still instant. The random generator produces much shallower trees.

## Part 2 — sum of LCA depths

**What changes vs part 1**

Part 1 asked about pairs where one node is above the other (at most `N * D` of them). Part 2 asks about **all** `N(N-1)/2` unordered pairs (about 2 million), and for each of them we would need the LCA. The part 1 trick of "climb from `j`" does not give the LCA of an arbitrary `(i, j)` for free.

**Naive approach**

For each pair, climb both nodes to equal depth and then together until they meet: `O(N^2 * D)`. Binary lifting or Euler tour + sparse table gives `O(N^2)` or `O(N^2 log N)` over all pairs. At `N = 2000` that is heavy and, more importantly, unnecessary.

**Key insight: count pairs per LCA instead of LCA per pair**

Flip the question. For each node `v`, how many pairs `(i, j)` have `v` as their *exact* LCA? Then the answer is

```text
S = sum over v of  depth[v] * pairsAtV[v]
```

Pairs with LCA exactly `v`:

- All pairs lying inside the subtree of `v`: `C2(sz[v])` where `C2(n) = n * (n - 1) / 2`.
- Remove those lying entirely inside one child's subtree (their LCA is deeper): `sum over children ch of C2(sz[ch])`.
- What is left is exactly the pairs that either split across the two children, or include `v` itself (the "LCA(i, i) = i" convention makes `(v, descendant)` count with LCA `v`).

```text
pairsAtV = C2(sz[v]) - sum(C2(sz[ch]) for ch in children[v])
```

Check on the example: `sz = [5, 3, 1, 1, 1]`.

| v | depth | C2(sz[v]) | children C2 | pairsAtV | contribution |
| - | ----- | --------- | ----------- | -------- | ------------ |
| 0 | 0 | 10 | 3 + 0 = 3 | 7 | 0 |
| 1 | 1 | 3 | 0 + 0 = 0 | 3 | 3 |
| 2,3,4 | - | 0 | 0 | 0 | 0 |

Total `3`. Also check: the pairsAtV values sum to `7 + 3 = 10 = C2(5)`, every pair is counted exactly once.

**Algorithm (`solve2.ts`)**

1. Read edges into `children[p]` and `parent[c]`.
2. BFS from the root fills `depth[ch] = depth[node] + 1` and records `bfsOrder`.
3. Walk `bfsOrder` in **reverse**, adding `sz[v]` into `sz[parent[v]]` (`sz` starts at 1 for every node). Reverse BFS order guarantees children are finished before their parent.
4. For each `v`, compute `pairsAtV` as above with the helper `C2(n)` and add `pairsAtV * depth[v]` to `result`, mod `MOD`.

**Complexity**

`O(N)` time and memory (each node is visited a constant number of times, each node has at most 2 children).

## Pitfalls / traps

- **Strict vs. non-strict ancestor.** Part 1 excludes `i = j`; part 2 explicitly counts a node as its own ancestor. In the part 2 formula this is what makes the pair `(v, descendant)` have LCA `v`, and it is why the `C2(sz[v])` count (which includes pairs with `v`) is correct.
- **Overflow.** Squared label differences (up to about `4e6`) summed over millions of terms, and in part 2 `pairsAtV * depth` (up to about `2e6 * 2000`), blow past what is comfortable; the solutions use `BigInt` and reduce modulo `1_000_000_007n` as they go.
- **Do not trust depth to be small.** A chain-shaped tree makes `D = N`; part 1 is still fine at `N <= 2000`, but only because of the limit. The generator attaches each new node to a random node that still has a free slot (`available` list, removed after 2 children), producing parents with smaller indices than children, so the input is topologically ordered.
- **`N = 1`.** No edge lines; both solutions return `0` early.
- Only one parent per child is assumed (a tree); there are no decoy edges.

## Files

- `solve1.ts` — climbs the `parent` chain from every node and sums `(j - anc)^2` mod `1e9+7`.
- `solve2.ts` — BFS depths, reverse-BFS subtree sizes, then sums `depth[v] * (C2(sz[v]) - sum C2(sz[child]))`.
