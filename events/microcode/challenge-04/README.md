# Challenge 4 — Galley Gyration

## Problem

The input has two lines:

1. a comma-separated list `D[0..n-1]` of positive integers: the number of dishes each crew member must cook. They sit around a circular table, so `D[0]` and `D[n-1]` are neighbours.
2. an integer `K`, used only in part 2.

Cooking happens in rounds. In each round you choose a set of crew members, no two of whom are neighbours, and each chosen member cooks exactly one dish.

- **Part 1:** the minimum number of rounds so that everyone cooks all their dishes.
- **Part 2:** same, but after cooking in a round a member cannot cook again for the next `K` rounds (with `K = 1`, cook in round 3 means unavailable in round 4, available in round 5).

Example: `3,2,1,4,2` with `K = 1` gives `6` for part 1 and `7` for part 2.

## Part 1 — two lower bounds on a cycle

**Observations**
- A round is an independent set of the cycle graph. The question is the minimum number of independent sets needed to cover each vertex `D[i]` times. That is a weighted colouring of a cycle.
- `n` goes up to 2000 and dishes up to 2000. A search over round assignments is hopeless, and a per-round greedy is not provably optimal.
- So look for lower bounds and hope they are tight.

**Two lower bounds**
1. **Neighbour bound.** Two neighbours can never cook in the same round, so their dishes need separate rounds: at least `D[i] + D[i+1]` rounds. Take the maximum over every adjacent pair, including the wrap-around pair `(n-1, 0)`.
2. **Capacity bound.** At most `floor(n/2)` people can cook in a single round (no two neighbours). There are `sum(D)` dishes in total, so at least `ceil(sum(D) / floor(n/2))` rounds.

**Key insight.** The answer is the larger of the two:

```
answer1 = max( max_i (D[i] + D[(i+1) % n]),  ceil( sum(D) / floor(n/2) ) )
```

This is the known result for multi-colouring a cycle. For an even cycle (which is bipartite) the neighbour bound alone is enough. For an odd cycle the capacity bound can be larger. For example `2,1,3,1,2`: the largest neighbour sum is 4, but `ceil(9 / 2) = 5`, and 5 is correct.

I also compared this formula with an exhaustive search over every schedule on 400 random small cycles (`n` from 3 to 6, dishes up to 3). It matched every time, for both odd and even `n`.

**Algorithm (`solve1.ts`)**
1. Split line 1 on `,` and convert to numbers: `dishes`.
2. `maxNeighborSum`: loop `i` from 0 to `n-1`, taking `dishes[i] + dishes[(i + 1) % n]`. The `% n` is the wrap-around for the circular table.
3. `totalDishes = sum(dishes)`, `maxPerRound = floor(n / 2)`, `capacityRounds = ceil(totalDishes / maxPerRound)`.
4. Return `Math.max(maxNeighborSum, capacityRounds)`.

Check on `3,2,1,4,2`: neighbour sums are `5, 3, 5, 6, 5`, so the maximum is `6`. The capacity bound is `ceil(12 / 2) = 6`. Answer `6`.

**Complexity:** `O(n)` time, `O(n)` memory.

## Part 2 — adding the cooldown

**What changes.** A cooldown limits how often a single person can cook. If someone has `D` dishes and must wait `K` rounds between sessions, the earliest they can finish is when they cook in rounds `1, K+2, 2K+3, ...`. The last of their `D` dishes is in round `1 + (D-1)(K+1)`, so they need at least

```
D + (D-1)*K  =  D*(K+1) - K
```

rounds on their own. This is a third lower bound, per person, and nothing in part 1 covers it, because part 1 only constrains neighbouring pairs and total capacity.

**Algorithm (`solve2.ts`).** Compute `part1Answer` exactly as in part 1. Then loop over every person, compute `roundsNeeded = dishes[i] * (k + 1) - k`, and keep the maximum as `maxCooldownRounds`. Return `Math.max(part1Answer, maxCooldownRounds)`.

Check on `3,2,1,4,2` with `K = 1`: the person with 4 dishes needs `4 * 2 - 1 = 7`, which beats the part 1 value of 6. Answer `7`.

**Complexity:** `O(n)`.

## Why it works on the generated inputs (and its limits)

The generator makes one "bottleneck" person with 500 to 2000 dishes, while everyone else has 1 to 200, and `K` is in 1 to 10.

- In part 1 the capacity bound is at most about 410. Any pair containing the bottleneck sums to at least 501. So on generated inputs the answer is always the largest neighbour pair.
- In part 2, with `D` the bottleneck's dish count (`D >= 500`) and `K >= 1`, its cooldown bound is `D(K+1) - K >= 2D - 1`. Every part 1 bound is smaller: the largest neighbour sum is at most `D + 200`, pairs without the bottleneck sum to at most 400, and the capacity bound is about 410. Since `2D - 1 > D + 200` for `D >= 500`, the bottleneck's cooldown bound beats them all. I checked this on 500 generated seeds, and it held every time. The answer is then `D * (K+1) - K` for the bottleneck.

The part 2 formula is a maximum of lower bounds. The solution relies on the fact that the bound is achievable here, because the bottleneck's neighbours have lots of slack. It is **not** exact for arbitrary inputs. For example, `2,2,2,2` with `K = 2`: the formula gives `max(4, 2*3 - 2) = 4`, but exhaustive search shows 5 rounds are needed. When all people are loaded evenly, the adjacency and cooldown constraints interact, and the simple bound is too optimistic. Don't reuse it outside this challenge's input family.

## Pitfalls / traps

- **Circular table.** Forgetting the pair `(n-1, 0)`. The `% n` in the neighbour loop covers it.
- **Capacity bound.** Forgetting `floor(n/2)` per round, or using `n/2` without the floor, or rounding down the division instead of up (`ceil`). It does not decide the answer on generated data, but it is part of the correct part 1 formula (`2,1,3,1,2` needs it).
- **Cooldown off by one.** The formula is `D*(K+1) - K`, not `D*(K+1)`. The last dish does not need a cooldown after it.
- **Don't simulate.** A round-by-round greedy is not provably optimal. The answer here is a closed form.
- **Number sizes.** Everything stays below about `2000 * 11 = 22,000`, so there is no overflow concern.

## Files

- `solve1.ts` — maximum adjacent sum and the capacity bound `ceil(sum / floor(n/2))`, combined with `max`.
- `solve2.ts` — the part 1 answer plus the per-person cooldown bound `D*(K+1) - K`, combined with `max`.
