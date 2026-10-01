# Challenge 17 — Keypad Cascade

## Problem

The input is a list of codes (5 per participant, one per line): three uppercase hex digits followed by `#`, e.g. `1A3#`.

Each code must be typed on a **hex keypad**, but only a chain of robot arms can reach it. Every arm hovers over a keypad and is itself driven by presses on the next directional keypad.

```
Hex keypad              Directional keypad
 0  1  2                    ^  #
 3  4  5                 <  v  >
 6  7  8
 9  A  B                (top-left cell is empty)
 C  D  E
    F  #                (bottom-left cell is empty)
```

- A press of `^ v < >` moves the arm one cell; `#` presses the key under the arm. Every arm starts on `#`.
- An arm must **never** hover over the empty cell.
- Part 1: **2** intermediate directional relays (3 arms in total: one over the hex pad, two over directional pads, and you type on a directional pad).
- Part 2: **25** intermediate relays (26 arms).

For every code find the minimum number of button presses **you** make; `complexity = shortest_sequence_length * hex_value_of_code` (the trailing `#` is ignored, so `042#` is `0x042 = 66`). Output the **sum of complexities**.

Sample (`1A3# F00# B7E# 042# D1C#`): lengths `90 74 68 86 82`, answer `802794` (part 1). Running part 2 on the same sample gives `942674221731290`.

## Part 1 - recursion over the layers

**Observations**

- Moving an arm from key `x` to key `y` and pressing it means: type some path of `^ v < >` moves followed by `#` on the pad above. The path must be a *shortest* path (a longer detour only adds presses at every layer above), but there are several shortest paths: any interleaving of `dr` vertical and `dc` horizontal moves.
- All shortest paths between two keys have the same length, but they are **not** equal for the next layer: the arm above must then travel between different keys. Example: `<<v#` and `<v<#` have the same length, but if one more directional relay sits above them, typing `<<v#` costs 22 presses and `<v<#` costs 30 (grouping equal moves keeps the upper arm from travelling back and forth). So we cannot just pick one path, we must pick the one that is cheapest *after* expansion.
- Each path ends with `#`, and at the layer above the arm therefore also ends on `#`. Consequence: **every layer restarts from `#` after each press**. The cost of a single hop depends only on `(from key, to key, layer)`, never on what happened before. That is exactly the structure memoization needs.

**Naive approach and why it dies (part 2, not part 1)**: build the full string of presses layer by layer. This works for 2 relays (under 100 characters per code) and is a fine part 1 solution, but the length multiplies by roughly 2 to 3 per layer.

**Key idea**: define `cost(fromKey, toKey, depth)` = the number of presses *you* must make so that the arm at layer `depth` moves from `fromKey` to `toKey` and presses it.

- `depth = 0` is the arm over the hex pad. `depth > 0` are arms over directional pads (`DIR_PAD`).
- `allShortestPaths(from, to, gap)` returns every shortest path as strings ending with `#`:
  - same cell: `["#"]`; same row or column: the single straight path;
  - otherwise all distinct permutations of `v..v >..>` (via `uniquePermutations`), then `passesThrough(from, perm, gap)` replays the moves and discards any path that steps on the empty cell (`HEX_GAP = [5,0]`, `DIR_GAP = [0,0]`). Straight paths never cross the gap, so skipping the check for them is safe.
- If `depth === numDirRobots` the path is typed by you: `cost = paths[0].length` (all candidates have equal length).
- Otherwise each candidate path is a sequence of presses for the arm at `depth + 1`:

```
pathCost = sum over the path's characters of cost(prev, ch, depth + 1)   // prev starts at '#'
cost     = min over candidate paths of pathCost
```

- Results are cached in `memo` under the key `` `${fromKey},${toKey},${depth}` ``.
- For a whole code, `minPresses` does the same at the top: the arm starts on `#`, and for each character `total += cost(prev, ch, 0)`.
- `solve` multiplies `minPresses(code, 2)` by `parseInt(hexPart, 16)` and sums.

Layers in terms of the code (`numDirRobots = 2`):

```
depth 0  arm over the hex pad          paths are sequences on a directional pad
depth 1  arm over a directional pad    paths are sequences on the next directional pad
depth 2  arm over a directional pad    paths are typed by YOU  -> length counted
```

**Complexity**: the number of distinct states is tiny (17x17 hex pairs plus 5x5 directional pairs per layer), each tries at most 21 permutations (hex pad: `dr <= 5`, `dc <= 2`; directional pad: at most 3). Essentially instantaneous.

## Part 2 - 25 relays instead of 2

**What changes**: only the depth. `solve2.ts` is `solve1.ts` with `minPresses(code, 25)`.

**Why it still works**: the recursion never builds a string. It only returns integers, and thanks to the memo each `(from, to, depth)` is computed once, so work grows **linearly** with the number of layers (about 26 layers x 25 pairs of keys x a few paths), not exponentially. The *answer* however grows exponentially: each code needs on the order of 10^11 presses.

**Why a part 1 solution may break**: if part 1 was written by materializing the string of presses (or by recursing without a cache), part 2 runs out of memory/time. A recursion that returns lengths with memoization needs no change.

**Number range**: the final total is around 6e14 to 1.1e15, below `Number.MAX_SAFE_INTEGER` (about 9.0e15), so plain `Number` is exact here. It is close enough to the limit that `BigInt` would be the safe choice if the code length or hex values were larger.

## Pitfalls / traps

- **The empty cell** on both pads. Paths through it are illegal. Hex pad, `C` to `F`: `v>` steps onto the gap, only `>v` is legal. Directional pad, `<` to `^`: `^>` steps onto the gap, only `>^` is legal. Discarding such paths is mandatory (otherwise you find answers that are too short), not an optimization.
- **Do not hard-code "horizontal first" or "vertical first"**. The best order depends on the layer; the solution tries all shortest orderings and lets the DP choose.
- **Arms start on `#`** at every level, and every sub-sequence ends with `#` (the press). Forgetting the final `#` in a path, or starting from the wrong key, shifts every length.
- **Hex value ignores the `#`** (`code.replace('#', '')`, base 16); `042#` is 66, not 42.
- **Memo key must include the depth**: the same `(from, to)` costs a different amount at different layers. The memo is created inside `minPresses`, so it is rebuilt per code (cheap).
- **Exponential blow-up of the output** in part 2: never build strings. The generator only emits 5 codes, so the difficulty is purely the depth.
- Sample check: part 1 sample lengths `90, 74, 68, 86, 82` must come out exactly.

## Files

- `solve1.ts`: memoized `cost(from, to, depth)` recursion over all gap-safe shortest paths, `numDirRobots = 2`.
- `solve2.ts`: identical code with `numDirRobots = 25`.
