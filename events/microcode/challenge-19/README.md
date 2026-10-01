# Challenge 19 — Guidance Gates

## Problem

A damaged logic circuit (a DAG of two-input gates) has to be simulated and then repaired.

```
I G
B_1 ... B_I                       input wire values (0 or 1)
GATE_TYPE IN1 IN2 OUT             G lines, GATE_TYPE in AND OR XOR NAND NOR XNOR
T_1 ... T_K                       target values of the K output wires
```

- Wires `0..I-1` are inputs; gate number `g` (0-based, in file order) drives wire `I + g`. Gates are listed in topological order, so a gate only reads wires that already have a value.
- The circuit outputs are the **last `K` wires** (highest ids). `K` is the length of the target line.
- Generator sizes: `I` 20-40, `G` 3000-5000, `K` 40-45 (the statement allows `I <= 100`, `G <= 10 000`).

Truth tables: `AND = a&b`, `OR = a|b`, `XOR = a^b`, `NAND = !(a&b)`, `NOR = !(a|b)`, `XNOR = !(a^b)`.

- **Part 1**: simulate and print the outputs read as a binary number, `O_1` (lowest wire id) being the most significant bit: `O_1 * 2^(K-1) + ... + O_K * 2^0`.
- **Part 2**: the current outputs differ from the target. Change as few gate **types** as possible (no rewiring; a changed gate may become any of the 6 types) so that the outputs equal the target. Print `changed_count * 1_000_000 + sum_of_changed_gate_indices` (0-based index in the file's gate list). If nothing needs changing the answer is `0`.

Sample (`3 5`, inputs `1 0 1`, target `0 1`): outputs are wires 6, 7 = `0 1`, binary `01`, so part 1 is `1`; the output already equals the target, so part 2 is `0`.

## Part 1 - topological simulation

**Observations**

- The gate list is already in topological order, so no graph traversal or sorting is needed: one pass in file order evaluates everything. `O(G)`.
- The only subtlety is the final integer. `K` is up to 45 bits (answers around `10^13`), beyond 32 bits.

**Algorithm** (`solve1.ts`)

1. `parseInput` returns `I, G, inputValues, gates, target`. `K = target.length`.
2. `simulate` allocates `wire[I + G]`, copies the inputs and, for each gate in order, sets `wire[g.out] = evalGate(g.type, wire[g.in1], wire[g.in2])`.
3. `evalGate` uses bitwise ops on 0/1 values: `a & b`, `a | b`, `a ^ b`; negated gates use `^ 1` (`(a & b) ^ 1`, `(a | b) ^ 1`, `a ^ b ^ 1`).
4. Encode the outputs without shifts:

```
result = 0; place = 1
for i = K-1 down to 0:  result += wire[totalWires - K + i] * place;  place *= 2
```

`i = K-1` (the last wire) gets weight 1, `i = 0` (first output wire) gets `2^(K-1)`.

**Complexity**: `O(G)` time and memory.

## Part 2 - minimum repair by pruned iterative deepening

**What changes**: we no longer evaluate, we must *search* over modifications. The part 1 helpers (`parseInput`, `simulate`) are reused (`solve2.ts` imports them from `solve1.ts`).

**Naive approach and why it fails**: choose `d` gates among `G` and a new type for each: `C(G, d) * 5^d` candidate repairs, each needing an `O(G)` simulation. With `G = 5000` and `d = 3` that is about `2 * 10^10 * 125` configurations. Impossible, so the search space must be cut sharply.

**Key observations**

1. **Only gates that can influence a wrong output matter.** Compare the base outputs to the target to get `wrongOutputs`. Build `consumers[wire]` (which gates read each wire) and compute `reachesWrong[gi]` in *reverse* gate order (consumers always have a higher index, so they are already known): a gate reaches a wrong output if its own output wire is wrong or any consumer reaches one. Gates that don't are never worth changing.
2. **A useful change must flip the gate's output.** Changing a type to another that gives the same output for the current inputs changes nothing, and the signature does not depend on *which* new type is used. For every input pair `(a, b)` there are types producing 0 and types producing 1, so the only meaningful move is "flip the output". That reduces the branching factor from 5 to 1: `altOut = curOut ^ 1`, take the first type with `evalGate(t, a, b) === altOut`.
3. **Decide gates in increasing index order.** All wires a gate reads come from lower-indexed gates, which are already settled when its turn comes, so `a` and `b` are read from the live `wire` array and the flip decision is exact. Choosing gates as an increasing index sequence (`startIdx = ci + 1`) visits every subset once.
4. **Iterative deepening on the number of changes.** `for depth = 1..min(6, candidates.length)` run the DFS with exactly `remaining = depth` changes allowed. The first depth that yields any repair is the minimum count.
5. **Tie-break by index sum.** Several repairs of the minimum size may exist; the signature wants the smallest sum of indices, tracked in `bestSum.value`. Branches are cut when `currentSum + gi >= bestSum.value`.

**Algorithm** (`solve2.ts`)

- `baseWire = simulate(...)`. If `outputMatches(baseWire, outputStart, target)` return `0`.
- Compute `wrongOutputs`, `consumers`, `reachesWrong`, then `candidates` = gates with `reachesWrong` set (plus a check that some other type changes the output, which is always true for these six gate types).
- `dfs(..., wire, remaining, startIdx, currentSum, bestSum)`:
  - if `outputMatches` now, record `currentSum` (if smaller) and return; if `remaining === 0`, return after the check;
  - for each candidate `gi` from `startIdx` on: skip when `currentSum + gi >= bestSum.value`; stop when fewer candidates remain than changes still needed (`candidates.length - ci - 1 < remaining - 1`);
  - compute `altType` as above, **save** `wire[gates[j].out]` for all `j >= gi`, set `types[gi] = altType`, **resimulate** only from `gi` (`resimulateFrom`), recurse with `remaining - 1`, `ci + 1`, `currentSum + gi`, then **restore** the type and the saved wires (backtracking).
- Return `depth * 1_000_000 + bestSum.value` at the first depth with a repair.

**What the generator makes of it**: the target is the output of the *correct* circuit, then 2-3 output gates are mutated, and those gates are wired **directly to primary inputs**. Hence no gate upstream of them exists to compensate: the wrong outputs are exactly the mutated gates, `reachesWrong` marks only those 2-3 gates, `candidates` has size 2-3, and the minimum repair is unique (change precisely those gates back). The DFS therefore finishes at depth 2 or 3 almost instantly. For a general circuit the candidate set can be much larger (any ancestor of a wrong output) and the pruning above is what keeps the search feasible.

**Complexity**: `O(G)` per DFS node for the resimulation, over very few nodes here. In general `O(C(|candidates|, d) * G)` with heavy pruning.

## Pitfalls / traps

- **32-bit bit operations in JS**: `<<`, `>>`, `|` truncate to 32 bits, so building a 40-45-bit result with `result |= bit << i` is wrong. Multiply by `place` (exact up to 2^53).
- **Bit order**: `O_1` is the *lowest wire id* of the last `K` wires and the *most significant* bit.
- **Negated gates on 0/1 values**: use `^ 1`, never `~` or `!` (`~1 = -2`).
- **Index conventions**: the signature uses the 0-based position in the gate list, not the wire id (which is `I + index`). `sum` of indices stays below 10^5, so it never collides with the `* 1_000_000` count part.
- **Do not search the 5000-gate haystack blindly**: the pruned `candidates` list (backward reachability from the wrong outputs) and the "flip the output" rule are what make part 2 trivial. Trying every type for every gate is hopeless.
- **Already-correct circuit** must return `0`, not `1_000_000`.
- **Restore state when backtracking**: the DFS mutates `types` and `wire` in place; forgetting to restore `wire[...]` from `gi` onward corrupts later branches.
- The input also contains the target line in part 1; `K` is derived from it.

## Files

- `solve1.ts`: parsing, `evalGate`, `simulate`, and the part 1 output encoding (no shifts).
- `solve2.ts`: reuses the parsing/simulation; backward-reachability candidates, flip-the-output branching and iterative-deepening DFS with incremental resimulation and index-sum pruning.
