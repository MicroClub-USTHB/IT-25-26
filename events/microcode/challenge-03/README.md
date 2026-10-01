# Challenge 3 — Signal Stack

## Problem

The input is a program for a stack machine, one instruction per line. All values are 32-bit unsigned integers (`0 .. 2^32 - 1`). The stack starts empty. After the last instruction, XOR together every value left on the stack and print the result.

| Instruction                                  | Effect                                                      |
| :------------------------------------------- | :---------------------------------------------------------- |
| `push V`                                     | push `V`                                                    |
| `pop`                                        | drop the top                                                |
| `dup`, `dup2`, `dup3`                        | duplicate the top 1, 2 or 3 elements                        |
| `rol N`                                      | roll the top `N`: `[A B C D]` becomes `[D A B C]` for `N=4` |
| `xor or and sub sum shl shr`                 | pop `B` (top), then `A`; push `A op B`                      |
| `inc dec not`                                | modify the top (`not` is a bitwise not)                     |

- **Part 1:** run the program, XOR-reduce the stack.
- **Part 2:** after every binary arithmetic operation (`sum sub xor or and shl shr`), look at the pushed result `T`:
  1. if bit 31 of `T` is set, reverse the whole stack;
  2. otherwise, if bit 0 of `T` is set, set a flag so that the next binary operation uses its operands in the opposite order (`B - A` for `sub`). The flag is consumed by that one operation.

Example (part 1): `push 10, push 20, xor, push 5, sub` gives `[10, 20]` then `[30]` then `[30, 5]` then `[25]`. The answer is `25`. In part 2 the example is the same, because `T = 30` has neither bit set, and `T = 25` sets the flag only after the last operation, so there is nothing left to consume it.

## Part 1 — an exact 32-bit virtual machine

**Observations**
- This is a pure simulation. There is no clever algorithm to find: the work is being exact.
- The generator emits about 7,800 instructions on the seed I checked. It builds an MD5-style hash loop, 256 rounds over a four-word state `(A, B, C, D)`. For example, rounds `0..84` use the selection function `(B & C) | (~B & D)`, and the last 85 rounds use `B ^ C ^ D`. Each round also adds two PRNG constants, does a rotate-left, and re-orders the state with `rol`.
- Because one wrong bit in any early round changes everything after it, there is no partial credit: the final XOR is either exactly right or random-looking.
- The stack stays tiny (at most 8 values, 4 at the end), so every `rol` and reversal is cheap.

**Algorithm (`solve1.ts`)**
1. `parseOps` splits the text into lines, and `parseOp` turns each one into a tagged `Op` (`{ kind: "Rol", n }`, `{ kind: "Push", val }`, and so on).
2. `apply(op, stack)` executes one instruction on a plain `number[]`.
3. `solve` applies every op in order, then returns `stack.reduce((acc, x) => acc ^ x, 0) >>> 0`.

**How `apply` keeps everything in 32-bit unsigned range**

JavaScript bitwise operators work on signed 32-bit integers, so every result is normalised with `>>> 0` (which converts it back to `0 .. 2^32 - 1`):

| Op                | Code                              | Why                                                        |
| :---------------- | :-------------------------------- | :--------------------------------------------------------- |
| `push`            | `op.val >>> 0`                    | values such as `4023233417` exceed `2^31`                  |
| `sum`             | `(a + b) & 0xFFFFFFFF`, then `>>> 0` | `a + b` can reach `2^33`; it is exact as a double, then truncated |
| `sub`             | `(a - b) & 0xFFFFFFFF`, then `>>> 0` | a negative difference wraps modulo `2^32`                  |
| `shl` / `shr`     | `a << (b & 31)` / `a >>> (b & 31)` | the shift count is masked to 5 bits; `shr` is the unsigned shift |
| `and` `or` `xor`  | `a & b` etc., then `>>> 0`        | the operators return signed values                         |
| `not` `inc` `dec` | `(~x) >>> 0`, `(x + 1) >>> 0`, `(x - 1) >>> 0` | wrap at both ends                          |

Operand order: `const b = stack.pop(); const a = stack.pop();`, then compute `a op b`. This matters for `sub`, `shl` and `shr`.

`rol N` is a manual shift: `tmp = stack[top]`, move the next `N-1` elements up by one slot, put `tmp` at `stack[top - (N-1)]`. This sends the top element `N-1` places down and slides the others up, matching `[A B C D]` becoming `[D A B C]`.

`dup2` and `dup3` read the top 2 or 3 values and `push` them back in the same order.

**Complexity:** `O(#ops)`, with a tiny constant (each `rol` touches at most 5 elements).

## Part 2 — a machine that reacts to its own results

**What changes vs part 1.** The instruction semantics stay exactly the same. The new behaviour is a "meta" layer around every binary arithmetic instruction. That is why `solve2.ts` imports `apply`, `parseOps` and `Op` from `./solve1` and wraps them instead of rewriting them.

**Algorithm (`solve2.ts`).** For each op:

1. **Before** the op: `if (isArithmeticOperation(op) && flag)` swap the top two stack elements and clear `flag`. After the swap, the normal `apply` pops `B` and `A` in the opposite order, so `sub` computes `B - A`, and `shl`/`shr` use the swapped operands.
2. `apply(op, stack)` runs unchanged.
3. **After** the op: if it was arithmetic, read `top = stack[stack.length - 1]`.
   - `(top >> 31) & 1` set: `stack.reverse()`.
   - `else if (top & 1)`: `flag = true`.

`isArithmeticOperation` lists only `Sum Sub Shl Shr And Or Xor`. Instructions like `inc`, `dec`, `not`, `push`, `dup`, `rol` and `pop` never trigger a reaction and never consume the flag.

Subtleties the code handles:
- **Mutual exclusion.** `else if` means a result with bit 31 set never sets the flag, even if its bit 0 is also set.
- **The flag survives non-arithmetic ops.** It is consumed only by the next arithmetic instruction, however many `push`/`rol`/`dup` come in between.
- **The swap happens for commutative ops too.** For `sum`, `and`, `or`, `xor` it changes nothing numerically (both operands are popped anyway), but the flag still gets cleared.
- **Reversal moves the whole state.** On the seed I checked there were about 1,145 reversals and 517 flag swaps. After a reversal, every later `rol` and `dup3` acts on a permuted stack, so the effect snowballs. That is why the answer differs completely from part 1.

**Complexity:** still `O(#ops)`. `stack.reverse()` is `O(stack size)`, and the stack never exceeds about 8 elements.

## Pitfalls / traps

- **Unsigned wrap.** Forgetting `>>> 0` gives negative numbers (JavaScript) or wrong results in a language without 32-bit integers (Python never wraps, so you have to mask with `& 0xFFFFFFFF` yourself).
- **Shift counts.** The generator builds rotate-left from `shl`/`shr` with `n` up to about 100,000 and computes `32 - n` with `sub`. That subtraction wraps to a huge unsigned number, which only works out because the shift count is masked with `& 31`. The rotation is therefore by `n mod 32`. In C or Rust (`x << 32` is undefined or panics) or in Python, you must mask the count yourself.
- **`push` and `rol` arguments.** Pushed constants like `0xFFFFFFFF` and `4023233417` are outside signed 32-bit range. Parse them as unsigned (`Number(...) >>> 0`).
- **Operand order.** `B` is the top, `A` is below, and the result is `A op B`. Getting this backwards breaks `sub`, `shl` and `shr` silently.
- **Final reduction.** XOR in JavaScript returns a signed number, so the answer needs a final `>>> 0`, or you might print a negative value.
- **Part 2 ordering.** Check the flag before executing the op, and inspect the result after it. Doing both after the op, or reversing and then testing bit 0 on the new top, gives a different (wrong) machine.
- **Tests on `T`.** `(top >> 31) & 1` works on the unsigned value because `>>` converts it to signed first. In a language with real unsigned integers write `top >> 31`.
- **Instruction count.** The organizer's note says about 3,000 instructions. The actual generator output is larger (about 7,800 lines), but the algorithm is unaffected.

## Files

- `solve1.ts` — `Op` type, `apply` (all 16 instructions with 32-bit wrap), `parseOps`/`parseOp`, and `solve` for part 1.
- `solve2.ts` — reuses `apply` and `parseOps`, adding the pre-swap on the reverse flag and the post-op MSB (reverse stack) and LSB (set flag) checks.
