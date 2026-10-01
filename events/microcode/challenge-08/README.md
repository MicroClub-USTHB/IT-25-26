# Challenge 08 — Terminal Tactics

## Problem

A "connect four" style game on a `GRID_SIZE x GRID_SIZE` board (5..7). Four in a row (horizontal, vertical or either diagonal) wins. There is no gravity: a move is any empty cell.

Input:

- Line 1: `GRID_SIZE;YOUR_SYMBOL;DEPTH;WEIGHTS`, where `WEIGHTS` is `W-R,C|W-R,C|...` (used only in part 2).
- Then `GRID_SIZE` lines of the board (`.`, `X`, `O`).

Position number of a cell is `row * GRID_SIZE + col`.

**Part 1.** For each empty cell, play it (that is placement number 1), then the opponent plays the move that minimises your outcome, you play the move that maximises it, and so on. The simulation ends when someone completes four (`+100` for you, `-100` for the opponent), or when the number of placements reaches `DEPTH`, or when the board is full (`0`). Pick the candidate with the best value; ties go to the lowest position number.

**Part 2 (tournament mode).** The opponent secretly placed one extra piece. `WEIGHTS` lists possible cells `(R, C)` with weights `W`. For each candidate and each scenario:

- the hidden piece sits on the candidate cell: add `W * -100`;
- the hidden piece alone already gives the opponent four: add `W * -100`;
- otherwise add the hidden piece, play the candidate, run the same minimax, add `W * outcome`.

Pick the highest weighted total; ties go to the lowest position number.

Example (5x5, `X`, `DEPTH = 2`, row 2 is `.XXX.`): playing `(2,0)` (position 10) or `(2,4)` (position 14) completes four, both `+100`, tie-break gives `10`. In part 2 with `3-0,0|7-0,4` neither hidden cell matters, both moves total `1000`, answer is again `10`.

## Part 1 — depth-limited minimax with alpha-beta

**Observations**

- It is a small two-player zero-sum game with a fixed horizon (`DEPTH` plies, counting your first move), a terminal check after every placement, and values only in `{+100, -100, 0}`.
- The value definition is literally minimax: you maximise, the opponent minimises.

**Naive approach**

Enumerate the tree without pruning. At each level there are about `GRID_SIZE^2` empty cells, so the cost is `O(cells^DEPTH)` plies times a win check. For `DEPTH = 2` on 7x7 it is tiny; the statement allows any positive `DEPTH`, though, and a deeper tree on a mostly empty 7x7 board explodes (`49^d`). Pruning is the standard remedy and costs nothing in correctness.

**Key insight**

Alpha-beta pruning returns exactly the same value as plain minimax, but it skips branches that cannot influence the result. Because the output is "which candidate", the root is handled by hand (no pruning *across* candidates) so every candidate gets its exact value and the tie-break can be applied.

**Algorithm (`solve1.ts`)**

1. Parse the header: `gridSize`, `mySymbol`, `opponentSymbol` (the other letter), `maxDepth`; `board` is a `string[][]`.
2. `checkWin(b)` scans the four directions (rows, columns, down-right diagonals, up-right diagonals via `b[r - k][c + k]`) for four equal non-`.` cells and returns the winning symbol or `null`.
3. `minimax(b, depth, alpha, beta, isMaximizing)`:
   - first check terminal state: `winner === mySymbol` returns `100`, `winner === opponentSymbol` returns `-100`, `isDraw(b) || depth === 0` returns `0`. Note the winner check comes **before** the depth check, so a win on the very last allowed placement still counts;
   - maximiser tries `mySymbol` in every empty cell, minimiser tries `opponentSymbol`; both mutate the board, recurse with `depth - 1`, and undo (`b[r][c] = "."`);
   - `alpha`/`beta` are updated and both loops `break` when `beta <= alpha`.
4. Root: for each empty cell in row-major order, place `mySymbol`, call `minimax(board, maxDepth - 1, -Infinity, Infinity, false)` (the first placement already consumed one unit of depth, and it is the opponent's turn), undo.
5. Keep `bestScore` / `bestMove`. Better score replaces; equal score replaces only if `index < bestMove` (the row-major scan already visits in increasing index order, so it is effectively "first best wins", the explicit comparison is a safety net).

```text
DEPTH = 2 on  .XXX.   candidate (2,0):
  place X -> board has XXXX -> checkWin = X -> minimax returns +100 at once
```

**Complexity**

`O(C * b^(DEPTH-1))` leaf evaluations in the worst case, with `b <= 49` and a win check costing about `O(N^2)`. Alpha-beta cuts this substantially; with the generator's `DEPTH = 2` it is just `C * b` boards, effectively instant.

## Part 2 — weighted parallel realities

**What changes**

The unknown opponent piece turns the single board into several boards (one per entry of `WEIGHTS`). The candidate is no longer judged by one minimax value but by the weight-sum of outcomes over all realities (an expectation up to normalisation, which does not change the arg-max).

**Why part 1 needs adjusting**

Part 1 evaluates one board. Here, for the same candidate, we must (a) detect two special losses before simulating anything, (b) rebuild the board per scenario, and (c) combine with weights. The minimax itself is reused unchanged; only the driver loop at the root is new.

**Algorithm (`solve2.ts`)**

1. Parse `weightsStr` into `realities = [{ weight, r, c }]` (`W-R,C` is split on `-` then on `,`).
2. For every empty cell `(r, c)` of `baseBoard` and for every `reality`:
   - if `(r, c)` equals the hidden cell: `total += weight * -100`; `continue`. The move is impossible in that world and counts as a loss;
   - copy the board (`baseBoard.map(row => [...row])`), set the hidden cell to `opponentSymbol`;
   - `checkWin(board) === opponentSymbol`: the hidden piece itself finishes the opponent's four, `total += weight * -100`; `continue`;
   - otherwise place `mySymbol` at `(r, c)` and add `weight * minimax(board, maxDepth - 1, -Infinity, Infinity, false)`.
3. Push `{ index, weightedScore }`, then sort by `weightedScore` descending, ties by `index` ascending, and return `moves[0].index`.

Why the generator's example flips the answer: the heavy scenario sits on `extLow` (the smaller-index winning endpoint). Playing `extLow` gets `-100 * heavy` from that scenario, while `extHigh` still wins (`+100 * heavy`) in that world, so the answer moves from `extLow` (part 1) to `extHigh`.

```text
weights  heavy (300-600) at extLow,  random others (10-150) elsewhere

move extLow : -100*heavy + 100*(sum of the other weights)
move extHigh: +100*heavy + 100*(sum of the others) - 200*w   (only if a scenario sits on extHigh itself)
              => extHigh wins since 2*heavy > 2*w
```

**Complexity**

`O(C * K * minimax)` where `C` is the number of empty cells and `K` the number of scenarios (8..12 in the generator): about `40 * 12` minimax calls, each tiny at `DEPTH = 2`. Fine.

## Pitfalls / traps

- **The generator's board is engineered**, not random: three of your pieces in a line with two open endpoints `extLow` and `extHigh`. Both complete four, both score `+100`, so the part 1 answer is decided purely by the tie-break (lowest position number, i.e. `extLow`). Background pieces are only accepted if they create no earlier winning cell (`hasImmediateWinBelow`), so there is no smaller-index decoy winning move.
- **Depth accounting.** The first move already counts as placement 1, so the recursion starts with `maxDepth - 1` and the opponent to move. Off-by-one here makes the opponent respond (or not) when the statement says otherwise. With `DEPTH = 2` the opponent gets exactly one reply.
- **Winner check before the depth check** so a win on the last allowed placement is still `+-100`.
- **Part 2 early exits.** The two `-100 * W` cases must be handled *before* running minimax. If the hidden piece is on the candidate cell, skipping this would overwrite the hidden piece with your own symbol and silently score a normal game. If the hidden piece already makes four, minimax would first see the opponent's win anyway, but the statement defines it as an immediate loss, and the explicit `checkWin` encodes that.
- **Each scenario needs a fresh board copy**: mutating `baseBoard` across scenarios leaks one world's hidden piece into the next.
- **Tie-break direction** is lowest position in both parts, the sort in part 2 is `weightedScore` descending then `index` ascending.
- The weighted sum is at most about `12 * 600 * 100 = 720 000`, no overflow concern.
- If a heavy scenario on `extLow` would itself give the opponent four, the generator skips it, so in that rare case there is no sabotage and the part 2 answer can still be `extLow`.

## Files

- `solve1.ts` — minimax with alpha-beta from each empty root cell, lowest index wins ties.
- `solve2.ts` — same minimax, wrapped by the weighted scenario loop with the two instant-loss rules; picks the highest weighted total, ties by lowest index.
