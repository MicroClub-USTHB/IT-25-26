import { parseInput, simulate, Gate } from "./solve1";

type GateType = "AND" | "OR" | "XOR" | "NAND" | "NOR" | "XNOR";
const ALL_TYPES: GateType[] = ["AND", "OR", "XOR", "NAND", "NOR", "XNOR"];

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

function resimulateFrom(
  gates: Gate[],
  wire: number[],
  types: GateType[],
  from: number,
): void {
  for (let i = from; i < gates.length; i++) {
    const g = gates[i];
    wire[g.out] = evalGate(types[i], wire[g.in1], wire[g.in2]);
  }
}

function outputMatches(
  wire: number[],
  outputStart: number,
  target: number[],
): boolean {
  for (let i = 0; i < target.length; i++) {
    if (wire[outputStart + i] !== target[i]) return false;
  }
  return true;
}

export function solve(input: string): number {
  const { I, G, inputValues, gates, target } = parseInput(input);
  const totalWires = I + G;
  const K = target.length;
  const outputStart = totalWires - K;

  const baseWire = simulate(I, inputValues, gates);
  if (outputMatches(baseWire, outputStart, target)) return 0;

  const wrongOutputs: number[] = [];
  for (let i = 0; i < K; i++) {
    if (baseWire[outputStart + i] !== target[i]) {
      wrongOutputs.push(outputStart + i);
    }
  }
  const wrongSet = new Set(wrongOutputs);

  const consumers: number[][] = Array.from({ length: totalWires }, () => []);
  for (let gi = 0; gi < G; gi++) {
    consumers[gates[gi].in1].push(gi);
    consumers[gates[gi].in2].push(gi);
  }

  const reachesWrong = new Uint8Array(G);
  for (let gi = G - 1; gi >= 0; gi--) {
    const outWire = gates[gi].out;
    if (wrongSet.has(outWire)) {
      reachesWrong[gi] = 1;
      continue;
    }
    for (const cgi of consumers[outWire]) {
      if (reachesWrong[cgi]) {
        reachesWrong[gi] = 1;
        break;
      }
    }
  }

  const candidates: number[] = [];
  for (let gi = 0; gi < G; gi++) {
    if (!reachesWrong[gi]) continue;
    const g = gates[gi];
    const a = baseWire[g.in1];
    const b = baseWire[g.in2];
    const curOut = baseWire[g.out];
    let canChange = false;
    for (const t of ALL_TYPES) {
      if (t !== g.type && evalGate(t, a, b) !== curOut) {
        canChange = true;
        break;
      }
    }
    if (canChange) candidates.push(gi);
  }

  const currentTypes: GateType[] = gates.map((g) => g.type);
  const maxDepth = Math.min(6, candidates.length);

  for (let depth = 1; depth <= maxDepth; depth++) {
    const bestSum = { value: Infinity };
    dfs(
      gates,
      G,
      totalWires,
      target,
      outputStart,
      candidates,
      currentTypes,
      baseWire.slice(),
      depth,
      0,
      0,
      bestSum,
    );
    if (bestSum.value < Infinity) {
      return depth * 1_000_000 + bestSum.value;
    }
  }

  throw new Error("No repair found within depth limit");
}

function dfs(
  gates: Gate[],
  G: number,
  totalWires: number,
  target: number[],
  outputStart: number,
  candidates: number[],
  types: GateType[],
  wire: number[],
  remaining: number,
  startIdx: number,
  currentSum: number,
  bestSum: { value: number },
): void {
  if (remaining === 0) {
    if (outputMatches(wire, outputStart, target)) {
      if (currentSum < bestSum.value) {
        bestSum.value = currentSum;
      }
    }
    return;
  }

  if (outputMatches(wire, outputStart, target)) {
    if (currentSum < bestSum.value) {
      bestSum.value = currentSum;
    }
    return;
  }

  if (currentSum >= bestSum.value) return;

  for (let ci = startIdx; ci < candidates.length; ci++) {
    const gi = candidates[ci];

    if (currentSum + gi >= bestSum.value) continue;

    if (candidates.length - ci - 1 < remaining - 1) break;

    const g = gates[gi];
    const origType = types[gi];

    const a = wire[g.in1];
    const b = wire[g.in2];
    const curOut = evalGate(origType, a, b);

    const altOut = curOut ^ 1;
    let altType: GateType | null = null;
    for (const t of ALL_TYPES) {
      if (t !== origType && evalGate(t, a, b) === altOut) {
        altType = t;
        break;
      }
    }

    if (altType === null) continue;

    const savedWires: number[] = [];
    for (let j = gi; j < G; j++) {
      savedWires.push(wire[gates[j].out]);
    }

    types[gi] = altType;
    resimulateFrom(gates, wire, types, gi);

    dfs(
      gates,
      G,
      totalWires,
      target,
      outputStart,
      candidates,
      types,
      wire,
      remaining - 1,
      ci + 1,
      currentSum + gi,
      bestSum,
    );

    types[gi] = origType;
    for (let j = gi; j < G; j++) {
      wire[gates[j].out] = savedWires[j - gi];
    }
  }
}
