type GateType = "AND" | "OR" | "XOR" | "NAND" | "NOR" | "XNOR";

function evalGate(type: GateType, a: number, b: number): number {
  switch (type) {
    case "AND":
      return a & b;
    case "OR":
      return a | b;
    case "XOR":
      return a ^ b;
    case "NAND":
      return (a & b) ^ 1;
    case "NOR":
      return (a | b) ^ 1;
    case "XNOR":
      return a ^ b ^ 1;
  }
}

export interface Gate {
  type: GateType;
  in1: number;
  in2: number;
  out: number;
}

export function parseInput(input: string) {
  const lines = input.trim().split("\n");
  const [I, G] = lines[0].split(/\s+/).map(Number);
  const inputValues = lines[1].split(/\s+/).map(Number);

  const gates: Gate[] = [];
  for (let i = 0; i < G; i++) {
    const parts = lines[2 + i].split(/\s+/);
    gates.push({
      type: parts[0] as GateType,
      in1: Number(parts[1]),
      in2: Number(parts[2]),
      out: Number(parts[3]),
    });
  }

  const targetLine = lines[2 + G].split(/\s+/).map(Number);

  return { I, G, inputValues, gates, target: targetLine };
}

export function simulate(
  I: number,
  inputValues: number[],
  gates: Gate[],
): number[] {
  const wire: number[] = new Array(I + gates.length).fill(0);
  for (let i = 0; i < I; i++) wire[i] = inputValues[i];

  for (const g of gates) {
    wire[g.out] = evalGate(g.type, wire[g.in1], wire[g.in2]);
  }

  return wire;
}

export function solve(input: string): number {
  const { I, G, inputValues, gates, target } = parseInput(input);
  const K = target.length;

  const wire = simulate(I, inputValues, gates);

  const totalWires = I + G;

  let result = 0;
  let place = 1;
  for (let i = K - 1; i >= 0; i--) {
    result += wire[totalWires - K + i] * place;
    place *= 2;
  }

  return result;
}
