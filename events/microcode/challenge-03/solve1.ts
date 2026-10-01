export type Op =
  | { kind: "Pop" }
  | { kind: "Dup" }
  | { kind: "Dup2" }
  | { kind: "Dup3" }
  | { kind: "Rol"; n: number }
  | { kind: "Push"; val: number }
  | { kind: "Sum" }
  | { kind: "Sub" }
  | { kind: "Inc" }
  | { kind: "Dec" }
  | { kind: "Not" }
  | { kind: "Shl" }
  | { kind: "Shr" }
  | { kind: "And" }
  | { kind: "Or" }
  | { kind: "Xor" };

export function apply(op: Op, stack: number[]): boolean {
  const need = (n: number) => stack.length >= n;

  switch (op.kind) {
    case "Pop":
      stack.pop();
      return true;

    case "Push":
      stack.push(op.val >>> 0);
      return true;

    case "Dup": {
      if (!need(1)) return false;
      stack.push(stack[stack.length - 1]);
      return true;
    }

    case "Inc": {
      if (!need(1)) return false;
      stack[stack.length - 1] = (stack[stack.length - 1] + 1) >>> 0;
      return true;
    }

    case "Dec": {
      if (!need(1)) return false;
      stack[stack.length - 1] = (stack[stack.length - 1] - 1) >>> 0;
      return true;
    }

    case "Not": {
      if (!need(1)) return false;
      stack[stack.length - 1] = (~stack[stack.length - 1]) >>> 0;
      return true;
    }

    case "And":
    case "Or":
    case "Xor":
    case "Sum":
    case "Sub":
    case "Shl":
    case "Shr": {
      if (!need(2)) return false;
      const b = stack.pop()!;
      const a = stack.pop()!;

      let result: number;

      switch (op.kind) {
        case "And": result = a & b; break;
        case "Or": result = a | b; break;
        case "Xor": result = a ^ b; break;
        case "Sum": result = (a + b) & 0xFFFFFFFF; break;
        case "Sub": result = (a - b) & 0xFFFFFFFF; break;
        case "Shl": result = a << (b & 31); break;
        case "Shr": result = a >>> (b & 31); break;
      }

      stack.push(result >>> 0);
      return true;
    }

    case "Dup2": {
      if (!need(2)) return false;
      const b = stack[stack.length - 1];
      const a = stack[stack.length - 2];
      stack.push(a, b);
      return true;
    }

    case "Dup3": {
      if (!need(3)) return false;
      const c = stack[stack.length - 1];
      const b = stack[stack.length - 2];
      const a = stack[stack.length - 3];
      stack.push(a, b, c);
      return true;
    }

    case "Rol": {
      const n = op.n;
      if (n < 2 || stack.length < n) return false;

      const top = stack.length - 1;
      const tmp = stack[top];

      for (let i = 0; i < n - 1; i++) {
        stack[top - i] = stack[top - i - 1];
      }

      stack[top - (n - 1)] = tmp;
      return true;
    }

    default: {
      const _exhaustive: never = op;
      return _exhaustive;
    }
  }
}

export function parseOps(input: string): Op[] {
  const lines = input.trim().split('\n');
  const ops: Op[] = [];
  for (let i = 0; i < lines.length; i++) ops.push(parseOp(lines[i]));
  return ops;
}

export function parseOp(line: string): Op {
  const trimmed = line.trim();
  const parts = trimmed.split(" ");
  const opcode = parts[0].toLowerCase();

  switch (opcode) {
    case "pop": return { kind: "Pop" };
    case "dup": return { kind: "Dup" };
    case "dup2": return { kind: "Dup2" };
    case "dup3": return { kind: "Dup3" };
    case "sum": return { kind: "Sum" };
    case "sub": return { kind: "Sub" };
    case "inc": return { kind: "Inc" };
    case "dec": return { kind: "Dec" };
    case "not": return { kind: "Not" };
    case "shl": return { kind: "Shl" };
    case "shr": return { kind: "Shr" };
    case "and": return { kind: "And" };
    case "or": return { kind: "Or" };
    case "xor": return { kind: "Xor" };

    case "push": {
      if (parts.length < 2) throw new Error("push requires a numeric argument");
      const val = Number(parts[1]);
      if (!Number.isFinite(val)) throw new Error("push argument must be a number");
      return { kind: "Push", val: val >>> 0 };
    }
    case "rol": {
      if (parts.length < 2) throw new Error("rol requires a numeric argument");
      const n = Number(parts[1]);
      if (!Number.isFinite(n)) throw new Error("rol argument must be a number");
      return { kind: "Rol", n: n >>> 0 };
    }

    default: throw new Error(`Unknown opcode: ${opcode}`);
  }
}

export function solve(input: string): number {
  const ops = parseOps(input);
  const stack: number[] = [];
  for (let i = 0; i < ops.length; i++) apply(ops[i], stack);
  return stack.reduce((acc, x) => acc ^ x, 0) >>> 0;
}
