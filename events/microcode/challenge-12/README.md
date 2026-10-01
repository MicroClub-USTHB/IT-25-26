# Challenge 12 — Heap Hazards

## Problem

A heap holds `N` objects (`N <= 10,000`) and a list of `R <= 100,000` operations simulates a garbage collector.

```text
N R K
root ids (space separated)
ALLOC id size
REF src dst        add edge src -> dst (no-op if it already exists)
DELREF src dst     remove edge (no-op if it does not exist)
ADDROOT id
DELROOT id
```

All `ALLOC` lines come first. Operations on freed objects are no-ops.

- **Part 1 — reference counting.** `rc` = number of incoming edges from alive objects, plus one per appearance in the root set. An object is freed only when a *decrement* brings `rc` to 0; freeing removes its outgoing edges, which can cascade. Objects allocated with `rc = 0` and never touched stay alive (leaks). Output the total size of alive objects.
- **Part 2 — periodic mark-and-sweep.** No reference counts. Every non-ALLOC operation increments a counter (even no-ops). When the counter is a multiple of `K`, run a full GC: mark everything reachable from the roots, free the rest. Output `part2Size * 1000000 + |part2Size - part1Size|`.

Example (Part 1): roots `{0, 1}`, `REF 0 2`, `REF 2 3`, `REF 3 2`, `REF 1 4`, `DELREF 1 4`. Object 4 is freed, 5 leaks (born with `rc = 0`), the cycle `2 <-> 3` survives because root 0 points to it. Total = `100+200+150+300+50 = 800`. With `K = 4`, Part 2 gives `1000`, so the output is `1000000200`.

## Part 1

**Observations**

- It is a pure simulation: there is nothing to optimise away except the cascades. Each operation is `O(1)` plus the cost of the frees it triggers.
- The two rules that matter: `REF` must be idempotent, and freeing only happens on a decrement that hits exactly 0.

**Data structures (`solve1.ts`)**

- `alive[]`, `rc[]` (`Int32Array`), `sz[]`.
- `outgoing[id]`: a `Set<number>` of targets. The set is what makes duplicate `REF` a no-op and `DELREF` of a missing edge a no-op.
- `rootSet` is only used at `ALLOC` time to give the initial `rc` (1 if root, else 0).

**Operations**

| Op | Behaviour in the code |
| --- | --- |
| `ALLOC` | `alive = 1`, set size, `rc = rootSet.has(id) ? 1 : 0`, fresh empty `Set`. |
| `REF` | Ignore if `src` or `dst` is dead, or the edge already exists. Else add the edge, `rc[dst]++`. |
| `DELREF` | Ignore if either end is dead or the edge is missing. Else delete, `rc[dst]--`, and if it is 0 call `freeObj(dst)`. |
| `ADDROOT` | Ignore if dead, else `rc[id]++`. |
| `DELROOT` | Ignore if dead, else `rc[id]--`, and if it is 0 call `freeObj(id)`. |

**The cascade (`freeObj`)**

```text
alive[id] = 0                          // mark dead FIRST
for each target of outgoing[id]:
    if target already dead: skip
    rc[target]--
    if rc[target] == 0: freeObj(target)
outgoing[id].clear()
```

Setting `alive[id] = 0` before walking the edges is what makes cycles terminate: when the recursion comes back to an object already being freed, the `!alive[target]` check stops it.

Born-dead objects (`rc = 0` from the start, never referenced) are never decremented, so they are never freed: that is the "leak" the statement wants. Unreachable cycles also leak: each member keeps `rc >= 1` from the other, nobody ever drops to 0.

**Complexity**: `O(R + total edges freed)`, since each object is freed once and its edge set is scanned once. Memory `O(N + edges)`.

## Part 2

**What changes**

We no longer track counts at all. Reachability from the roots is the only thing that decides survival, and it is evaluated only at discrete moments (every `K`-th non-ALLOC operation). Between collections garbage simply sits there.

**Why Part 1's code cannot be reused as is**

- Freeing is no longer triggered by a decrement, so there is no `rc` and no cascade.
- Roots must be tracked explicitly as a set to start the mark phase from, and `DELROOT` on a non-root must do nothing (in Part 1 it decremented `rc`).
- Part 1's result is still needed for the final formula, so `solve2.ts` imports `solve` from `solve1.ts` as `solvePart1`.

**Algorithm (`solve2.ts`)**

1. `roots` is a `Map<id, multiplicity>` initialised from line 2. `ADDROOT` on an alive object increments its count; `DELROOT` decrements it and deletes the key when it reaches 0 (no-op on a non-root). Multiplicity matters: adding a root twice and removing it once keeps it rooted.
2. `REF` adds to `outgoing[src]` (a `Set`, so duplicates are harmless); `DELREF` deletes from it. Both are skipped when an end is dead.
3. `nonAllocCount` is incremented for **every** `REF`, `DELREF`, `ADDROOT`, `DELROOT`, including the branches that do nothing because an object is dead. The code repeats `nonAllocCount++; if (nonAllocCount % K === 0) gc();` in each branch.
4. `gc()`:
   - Mark: BFS from every alive root with a fresh `marked = new Uint8Array(N)`.
   - Sweep: every `i` with `alive[i] && !marked[i]` gets `alive[i] = 0` and `outgoing[i].clear()`.
5. There is no separate "final GC": if the last non-ALLOC operation lands on a multiple of `K`, the check inside the loop already ran it.
6. `part2Size` is the sum of sizes of alive objects; return `part2Size * 1_000_000 + Math.abs(part2Size - part1Size)`.

**Complexity**: `O(R + (R / K) * (N + E))`. With `K` in `[500, 2000]` that is at most a couple of hundred full collections.

## Pitfalls / traps

The generator builds five groups of objects to make the two strategies diverge:

- **Reachable cycles** (triangles hanging off a root): alive in both parts.
- **Unreachable 2-cycles**: leak in Part 1, swept in Part 2.
- **Connect-then-disconnect** (`REF root x` early, `DELREF root x` near the end): freed immediately in Part 1, but in Part 2 they survive unless a GC fires after the `DELREF`.
- **Born-dead objects**: leak in Part 1, swept in Part 2 at the first GC.
- **Random churn**: random `REF`/`DELREF`/`ADDROOT`/`DELROOT`, including on freed objects.

Things that bite:

- **Counter must advance on no-ops.** Counting only "effective" operations shifts every GC point and changes the answer.
- **`D` can be negative**, because Part 2 can be bigger (group D survives) or smaller (cycles/born-dead swept) than Part 1. Hence `Math.abs`.
- **Part 1 `DELROOT` is a literal decrement**, even on a non-root object whose `rc` comes from incoming edges, or on an object with `rc = 0` (it goes to `-1` and is never freed because the test is `=== 0`). The code follows the statement literally.
- **Dead targets stay in other sets.** Edges from still-alive objects to freed objects are not removed eagerly, which is why `freeObj` and the BFS both guard with `alive[target]`.
- **Recursion depth in `freeObj`** can reach the length of a reference chain (up to `N`), which is fine for `N <= 10,000` in Node.
- **Output size.** `part2Size` is at most about `4e7`, so `part2Size * 1e6` is about `4e13`, safe in a double: no BigInt needed.
- Blank trailing line: both solutions tolerate it (unknown op falls through; Part 2 has `if (!line) continue`).

## Files

- `solve1.ts` — reference counting with `rc`, edge `Set`s and the recursive `freeObj` cascade; returns the total alive size.
- `solve2.ts` — mark-and-sweep every `K` non-ALLOC operations (root multiset, BFS mark, sweep); combines with Part 1's result as `part2 * 1e6 + |part2 - part1|`.
