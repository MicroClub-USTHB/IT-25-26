# Challenge 07 — Genetic Generation

## Problem

Input: `P` patient groups (150 to 300 in the generator), then `4 * P` lines. Every block of 4 lines is a group of four 8-character binary strings, indexed 0..3 (bit positions 0..7 from the left).

For each group, simulate exactly 1000 generations `g = 1..1000`. After each generation, add up the decimal values (0..255) of the 4 sequences of the new population. The answer is the sum of everything over all groups and all generations.

One generation (part 1):

1. **Selection.** `strength` = number of `1` bits. `First` = strongest, `Second` = next strongest; ties go to the **higher index**.
2. **Blend point.** `split = (sFirst + sSecond) % 7 + 1` (range 1..7).
3. **Recombination.** `child1 = First[0:split] + Second[split:8]`, `child2 = Second[0:split] + First[split:8]`.
4. **Radiation.** `strike = (g * 3 + sFirst) % 8`; flip that bit in **both** children.
5. **Rotation.** Array `[First, Second, child1, child2]` is rotated **right** by `g % 4`; this is the new population.

Example, generation 1 of the given group `[10100000, 00001010, 11100000, 00000111]`: strengths `2 2 3 3`, First = index 3, Second = index 2, `split = 7`, children `00000110` and `11100001`, strike bit 6 gives `00000100` and `11100011`, rotate right by 1 gives `[11100011, 00000111, 11100000, 00000100]`, values `227 + 7 + 224 + 4 = 462`.

## Part 1 — direct simulation

**Observations**

- Nothing is hidden: the statement fully defines a deterministic state machine. The state is only 4 strings of 8 bits per group.
- Cost: `P * 1000 = 300 000` generations at most, each doing constant work on 4 strings of length 8. Roughly a few million basic operations.

**Naive approach and why it is fine**

There is no trap in the size, so the naive simulation is the intended solution. The difficulty is purely about being faithful to the order of the steps and to the exact tie-break, rotation and indexing rules, because one mistake propagates through all the following generations (chaotic dynamics, no self-correction).

**Algorithm (`solve1.ts`)**

For each group `p`, `pop` = the 4 lines `lines.slice(1 + p*4, 1 + p*4 + 4)`, `total = 0`, then for `g = 1..1000`:

1. `fitness = pop.map(countOnes)` computes the strengths.
2. Selection with one comparator:

   ```ts
   ranked = [0,1,2,3].sort((i, j) => fitness[j] - fitness[i] || j - i)
   ```

   `fitness[j] - fitness[i]` sorts by strength descending; if equal (0, falsy), `j - i` sorts the higher index first. So `ranked[0]` is First and `ranked[1]` is Second. Then `pa, pb` are the sequences and `fa, fb` their strengths.
3. `split = ((fa + fb) % 7) + 1`; `child1 = pa.slice(0, split) + pb.slice(split)`; `child2 = pb.slice(0, split) + pa.slice(split)`.
4. `mutIdx = (g * 3 + fa) % 8` and `flipBit` (split into chars, toggle one, join) on both children. Note that it is **First's** strength `fa`, and it is the strength computed *before* recombination.
5. `arr = [pa, pb, child1, child2]` and `r = g % 4`. Right rotation by `r` moves the last `r` items to the front:

   ```text
   r = 1 : [d, a, b, c]    = [...arr.slice(3), ...arr.slice(0, 3)]
   r = 2 : [c, d, a, b]
   r = 3 : [b, c, d, a]
   r = 0 : unchanged       (special-cased, because slice(4) would work but it is clearer)
   ```
6. `total += sum of parseInt(seq, 2)` over the new `pop` (after rotation; the sum is rotation-independent but the *content* is not, as the rotation decides who is First/Second next time through the tie-break by index).

`grandTotal += total` after the 1000 generations.

**Complexity**

`O(P * G)` with `G = 1000` and constant work per generation (4 strings of 8 bits): at most about 300k generations. Memory `O(P)`. The result is at most `300 * 1000 * 4 * 255 ~ 3e8`, so a plain JS `number` is enough.

## Part 2 — shifting reference key

**What changes**

Same loop, same recombination, mutation and rotation. Two differences:

1. **Strength becomes resemblance** to a reference key `target`: `8 - hammingDistance(seq, target)`. This replaces `countOnes` (part 1 is the special case `target = 11111111`). Selection (with the same higher-index tie-break), `fa`, `fb` and `mutIdx = (g * 3 + fa) % 8` all use this new value.
2. **The target evolves** at the very start of each generation, and it influences the blend point.

**Why part 1 needs adjusting**

Part 1 never had state outside the population. Now each group carries an extra piece of state (`target`) that must be updated *before* anything else in generation `g` and **reset to `11010110` for every group** (the line `let target = "11010110"` sits inside the group loop).

**`evolveTarget(target, g)`**

```text
if g % 100 == 0 : rotate left by 1  -> target.slice(1) + target[0]
                  then flip positions 2 and 5
if g % 250 == 0 : reverse the string        (runs after the rule above)
```

Both `if`s are independent (not `else if`), so at `g = 500` and `g = 1000` rule 1 happens first, then rule 2 on its result. Order matters: rotate+flip then reverse is not the same as reverse then rotate+flip.

**Blend point**

After updating the key, count its ones: `keyOnes`. Then

```ts
splitSum = keyOnes > 4 ? fa + fb + 2 : fa + fb
split = (splitSum % 7) + 1
```

`keyOnes > 4` is strict (exactly 4 ones does not trigger the `+2`). Everything else (children, strike bit, rotation, decimal sum) is copied from part 1.

Check on the example: key `11010110` has 5 ones, resemblances `3 3 4 4`, First = index 3, Second = index 2, `split = (4 + 4 + 2) % 7 + 1 = 4`, strike `(3 + 4) % 8 = 7`, sum again `462` (different strings, same total in this specific case).

**Complexity**

Same as part 1: `O(P * 1000)` with a few more constant-time operations per generation (an 8-char Hamming distance for 4 sequences, plus the key update).

## Pitfalls / traps

- **Tie-break direction.** Higher index wins, which is *reversed* relative to a normal stable sort. The comparator `|| j - i` encodes it. Duplicate sequences are possible (random bytes, and recombination often creates equal strings), so ties are very frequent.
- **Strength used for the strike is `fa`**, the strength of First, not the sum, not Second's.
- **Right rotation**, by `g % 4` (0 means no rotation). Doing a left rotation, or rotating before sorting, gives different answers.
- **Order inside a generation.** Update key, then selection, split, recombination, flip, rotation, then the sum. Summing before the rotation or before the flip is wrong (flip is applied to the children *before* they enter the sum).
- **Bit positions are from the left**, i.e. string index; `parseInt(seq, 2)` is consistent with that (position 0 is the most significant bit).
- **Key reset per group** and the key rule order at `g = 500, 1000` (both triggers).
- **Strict `> 4`** for the `+2` rule.
- The numbers stay small (no overflow, no BigInt needed here); the trap is only precision of the simulation, and an off-by-one anywhere changes the final sum completely after a few generations.

## Files

- `solve1.ts` — straightforward simulation with strength = number of ones.
- `solve2.ts` — same simulation with Hamming-based resemblance to a reference key that evolves via `evolveTarget` and modifies the blend point.
