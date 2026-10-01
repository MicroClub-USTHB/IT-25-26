# Challenge 2 — Formula Folding

## Problem

The input is a single line: a formula over the letters `A B C D` and groups written `(...){N}`.

| Letter | Energy |
| :----- | -----: |
| `A`    |    247 |
| `B`    |    383 |
| `C`    |    156 |
| `D`    |    512 |

A group `(...){N}` is worth `N` times the energy inside it. Groups nest, and every `(` has a matching `)` immediately followed by `{N}`.

- **Part 1:** output the total energy of the formula.
- **Part 2:** at every group closure, before multiplying by `N`, collapse the inner energy: if it is strictly greater than `1000`, replace it with `inner mod 1000`. Then multiply and add to the parent. Output the final energy.

Example: `A(B(C){4}){2}D`
- Part 1: `C = 156`, `(C){4} = 624`, `B + 624 = 1007`, `(...){2} = 2014`, total `247 + 2014 + 512 = 2773`.
- Part 2: `(C){4}` is unchanged (156 is not above 1000), giving 624. `383 + 624 = 1007 > 1000`, so it becomes `7`, and `7 * 2 = 14`. Total `247 + 14 + 512 = 773`.

## Part 1 — nested evaluation with an explicit stack

**Observations**
- The input is millions of characters long (about 2.5 to 5 MB on the seeds I checked), with nesting depth 10 and multipliers 2 or 3.
- Expanding the groups into one long string is hopeless. The answer is around `1e13`, so the expanded string would have tens of billions of letters.
- Evaluate each group to a number once. The nesting is a stack structure, so a stack of running sums is the natural fit.

**Algorithm (`solve1.ts`)**

`stack[top]` holds the running sum of the group currently being read. `stack[0]` is the top level. Scan the characters left to right:

| Character       | Action                                                              |
| :-------------- | :------------------------------------------------------------------ |
| `A..D`          | `stack[top] += ENERGY[code]`                                        |
| `(`             | `top++; stack[top] = 0` (open a fresh group)                        |
| `)` (anything else) | read the multiplier, pop the group, add `inner * mult` to the parent |

Details of the `)` branch:
- `ENERGY` is an `Int16Array(128)` lookup table indexed by char code (`A` = 65, `B` = 66, `C` = 67, `D` = 68). A non-zero entry means the character is a letter.
- `i += 2` skips `)` and `{`. Then the loop `mult = mult * 10 + code - 48` reads digits until `}` (code 125), and `i++` steps past it.
- `inner = stack[top]; top--; stack[top] += inner * mult;`

Trace for `A(B(C){4}){2}D`:

```
start    [0]
A        [247]
(        [247, 0]
B        [247, 383]
(        [247, 383, 0]
C        [247, 383, 156]
){4}     [247, 383 + 156*4]  = [247, 1007]
){2}     [247 + 1007*2]      = [2261]
D        [2773]
```

The stack is `Float64Array(52)`: depth is at most 50, plus the base level and a spare slot. The stack never grows or shrinks in memory, and there are no per-character allocations.

**Complexity:** `O(length)` time, `O(depth)` memory.

## Part 2 — collapse before multiplying

**What changes.** Part 1 is linear. Each letter contributes `energy * (product of the multipliers around it)`, so the order of evaluation does not matter. You could even skip the stack and keep a running product of multipliers. The collapse rule `x -> x mod 1000` breaks this. The result is no longer linear in the multipliers: `(x mod 1000) * N` is generally not `x * N`, and the mod only applies to a group's full total. So you must know the true total of each group before reducing it. The part 1 stack already gives you that, because the group total is exactly `stack[top]` at the moment of the closing bracket.

**Algorithm (`solve2.ts`).** Identical to part 1, with one extra step between popping and adding:

```ts
let inner = stack[top];
top--;
if (inner > 1000) {
  inner = inner % 1000;
}
stack[top] += inner * mult;
```

Notes on the rule:
- It is applied at every closing bracket, innermost first, because the loop pops in that order.
- The test is strictly `> 1000`. A group worth exactly `1000` stays `1000`. Using `>= 1000` or an unconditional `% 1000` would turn it into `0`.
- The top level has no closing bracket, so `stack[0]` is never collapsed.
- After the collapse, every group contributes at most `1000 * 3`, so part 2 values stay small.

**Complexity:** unchanged, `O(length)`.

## Pitfalls / traps

- **Leading prefix.** The generator prepends 12 letters (the seed written in base 4 as `A..D`) at the top level. They are ordinary letters and get added to `stack[0]`. This only guarantees that every user's input is unique.
- **Magnitude in part 1.** The values explode with depth. On sampled seeds I saw totals around `1.2e13`. The generator's own comment bounds the worst case at about `4.5e15`. That is already far above `2^32` (an `Int32Array` or C `int` overflows), but below `2^53 ≈ 9e15`. A `Float64Array` (a JavaScript `number`) is exact here. In other languages use `int64`.
- **Part 2 is guaranteed to trigger.** Leaf groups have 10 to 15 letters, so their sum is at least `10 * 156 = 1560 > 1000`. The collapse therefore fires at the deepest level on every input. A part 1 solution cannot pass by luck.
- **Stack size.** The statement allows nesting up to 50 levels, and the stack array of 52 covers that. The generator itself only goes to depth 10.
- **Statement vs generator.** The part 2 text talks about multipliers "reaching into the millions". The actual generator uses multipliers 2 and 3. The behaviour above (strict `> 1000`, collapse before multiplying) is what the reference solution implements.
- **Whitespace.** `input.trim()` removes a trailing newline, so the scan does not hit a stray character.

## Files

- `solve1.ts` — iterative stack evaluator (lookup table for letters, manual multiplier parsing, `Float64Array` stack).
- `solve2.ts` — same evaluator, with the `inner > 1000 -> inner % 1000` collapse applied when each group is popped.
