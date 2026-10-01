import { apply, Op, parseOps } from "./solve1";

function isArithmeticOperation(op: Op): boolean {
  return ["Sum", "Sub", "Shl", "Shr", "And", "Or", "Xor"].includes(op.kind)
}

export function solve(input: string): number {
  const ops = parseOps(input);
  const stack: number[] = [];
  var flag = false;

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (isArithmeticOperation(op) && flag) {
      flag = false;
      const temp = stack[stack.length - 1];
      stack[stack.length - 1] = stack[stack.length - 2];
      stack[stack.length - 2] = temp;
    }

    apply(op, stack);

    if (isArithmeticOperation(op) && stack.length >= 1) {
      const top = stack[stack.length - 1];
      if ((top >> 31) & 1)
        stack.reverse();
      else if (top & 1)
        flag = true;
    }
  };
  return stack.reduce((acc, x) => acc ^ x, 0) >>> 0;
}
