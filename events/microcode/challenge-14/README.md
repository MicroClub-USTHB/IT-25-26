# Challenge 14 — Conveyor Chaos

## Problem

```text
R C T I
R rows of the grid, each cell one of  >  <  v  ^
I lines "r c": starting cell of an item (0-indexed)
```

`R, C <= 1000`, `I <= 500,000`, `T <= 10^18`. Every cell has exactly one belt. Each tick, every item moves one cell in the direction of the belt of the cell it is standing on. Items do not interact.

- **Part 1:** moving off the grid loses the item for good. After exactly `T` ticks, output the sum of `row * C + col` over surviving items (0 if none).
- **Part 2:** the grid wraps around (torus), so nobody is lost. Output `sum over t = 1..T of checksum(t)` modulo `10^9 + 9`, where `checksum(t)` is the sum of `row * C + col` of all items at tick `t`.

Example (Part 1, `T = 5`): the three items are lost, survive at `(3,2)`, and are lost, so the checksum is `3*5+2 = 17`. Example (Part 2): per-item cumulative values `22 + 39 + 80 = 141`.

## Part 1

**Observations**

- `T` is up to `10^18`: simulating ticks is impossible, even for a single item.
- Every cell has exactly one outgoing arrow, so the grid is a **functional graph**: from any cell the path either leaves the grid or eventually enters a cycle. Its shape is a "rho" (a tail followed by a loop).

**Key insight**

For each cell precompute:

| Array | Meaning |
| --- | --- |
| `succ[cell]` | next cell, or `LOST = -1` if the belt points off the grid |
| `rhoArr[cell]` | for a cell that reaches a cycle, steps until it is on the cycle (0 for cycle cells); for a cell that falls off, the tick at which it is lost |
| `cycleLenArr[cell]` | length of the cycle it ends in, or 0 if it is lost |
| `cycleIdArr[cell]`, `entryOffsetArr[cell]` | which cycle, and the index inside `cycles[cid]` where the path enters it |

Then each item is answered in `O(1)`:

- `cycleLen = 0`: the item is lost once `T >= rho`. Only if `T < rho` do we simulate `T` steps with `succ` (that only happens for small `T`).
- Otherwise, if `T < rho` simulate directly; else the item is on the cycle after `rho` steps and then moves `(T - rho)` more:

```text
remaining   = (T - rho) % cycleLen
finalOffset = (entryOffset + remaining) % cycleLen
position    = cycles[cid][finalOffset]
```

**Computing the arrays in one pass over the cells**

Each start cell with `status 0` is walked with a local `path` and a `pathIdx` map. `status` is 0 (unvisited), 1 (on the current path), 2 (resolved). The walk stops on one of three events, handled differently:

1. **Reached `LOST`:** walk the path backwards; `rhoArr = path.length - j` (distance to the exit), `cycleLen = 0`.
2. **Hit a cell on the current path:** a new cycle. The suffix of the path from that cell is the cycle (`cycleCells`; its cells get `rho = 0`, their own index as `entryOffset`). The prefix before it is the tail: `rho = cycleStart - j`, `entryOffset = 0` (they enter at cycle index 0, which is the first cycle cell).
3. **Hit an already resolved cell (`status 2`):** copy its data. Either it is lost (add `baseRho`), or inherit `cycleId`, `cycleLen` and `entryOffset` and set `rho = distance + baseRho`.

Every cell is processed once.

**Complexity**: `O(R*C + I)` time and memory. `T` is parsed as `BigInt` (see traps).

## Part 2

**What changes**

1. Wrapping: `succ` now wraps (`nr < 0 -> R-1`, `nr >= R -> 0`, same for columns). No cell is lost, so case 1 and `cycleLen = 0` disappear: every path ends in a cycle.
2. We need the sum of positions at **every** tick `1..T`, not the position at tick `T`. Knowing only the final cell is not enough, so we precompute prefix sums.

**Decomposing the `T` ticks of an item starting at `s`**

```text
ticks 1 .. rho          tail (the cell reached at tick rho is the cycle entry cell)
ticks rho+1 .. T        walking around the cycle: ticksInCycle = T - rho
```

- `cumTailSumArr[cell]` = sum of the cell indices visited at ticks `1..rho(cell)`. It is built backwards along the path: `cum[path[j]] = path[j+1] + cum[path[j+1]]`, with the cell right before the cycle getting `path[cycleStart]`. For a path attached to a resolved cell `cur`, the last path cell gets `cur + cum[cur]`. Cycle cells have `0`.
- For each cycle, store `cells`, `prefix` (a `BigInt64Array` of running sums, `prefix[0] = 0`) and `total = prefix[cLen]`.
- For `ticksInCycle > 0`:

```text
K                = ticksInCycle / lambda            (full laps)
r                = ticksInCycle % lambda            (leftover ticks)
cyclePhaseStart  = (entryOffset + 1) % lambda       (first cycle cell visited after the entry tick)
fullCycleContrib = K * cycle.total
partialCycleContrib = sum of r consecutive cycle cells from cyclePhaseStart, wrapping:
    end = cyclePhaseStart + r
    end <= lambda ? prefix[end] - prefix[cyclePhaseStart]
                  : (total - prefix[cyclePhaseStart]) + prefix[end - lambda]
itemContrib = tailContrib + fullCycleContrib + partialCycleContrib
```

- If `T <= rho` (`ticksInCycle <= 0`), the item never completes its tail, and `cumTailSum` would overshoot, so the code simulates the `T` steps directly instead.
- Add each item's contribution into `answer` modulo `10^9 + 9`.

**Complexity**: `O(R*C + I)`, with `BigInt` arithmetic only on the per-item formula.

## Pitfalls / traps

- **`T` exceeds `2^53`.** The generator produces `T` between `10^17` and `10^18`, so it must be parsed with `BigInt(...)`, not `+`. Also `(T - rho) % cycleLen` must be done in `BigInt`.
- **Big intermediate sums in Part 2.** `K` is up to about `10^18` and `cycle.total` up to about `10^12`, so `K * total` is about `10^30`. It needs `BigInt` and must be reduced modulo `10^9 + 9` per item. The tail sum (at most about `10^6 * 10^6 = 10^12`) and the cycle prefix sums stay exact in a `Float64Array` / `BigInt64Array`.
- **Part 1 checksum needs no modulo**: at most `5*10^5 * 10^6 = 5*10^11`, safe in a double.
- **Off-by-one on ticks.** Part 2 sums ticks `1..T` (the start cell is not counted), so the entry cell is part of the tail sum and the cycle walk begins at `(entryOffset + 1) % lambda`.
- **Boundary decoys.** About 20% of border cells are pushed outward, so in Part 1 a large share of items is lost; in Part 2 the same cells just wrap.
- **Lost vs cycle merging.** A path that runs into a resolved *lost* cell must inherit `cycleLen = 0`, and one that runs into a resolved *cyclic* cell must inherit `cycleId` and `entryOffset` (not the cell's own index).
- **Same cell, many items.** Items may share a start cell; the per-cell precomputation makes that free.
- Scale: up to `10^6` cells and `5*10^5` items, so avoid one-object-per-cell structures or per-item simulation.

## Files

- `solve1.ts` — builds the functional graph with `LOST`, resolves every cell once into `rho` / cycle length / cycle id / entry offset, and answers each item with `(T - rho) mod cycleLen`.
- `solve2.ts` — toroidal version; adds tail prefix sums (`cumTailSumArr`) and per-cycle prefix sums to sum all `T` ticks with `tail + K * cycleTotal + partial cycle`, modulo `10^9 + 9`.
