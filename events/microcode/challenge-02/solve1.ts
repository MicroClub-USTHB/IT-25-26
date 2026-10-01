const ENERGY = new Int16Array(128);
ENERGY[65] = 247;
ENERGY[66] = 383;
ENERGY[67] = 156;
ENERGY[68] = 512;

export function solve(input: string): number {
  const f = input.trim();
  const n = f.length;

  const stack = new Float64Array(52);
  let top = 0;
  stack[0] = 0;

  let i = 0;
  while (i < n) {
    const code = f.charCodeAt(i);

    if (ENERGY[code]) {
      stack[top] += ENERGY[code];
      i++;
    } else if (code === 40) {
      top++;
      stack[top] = 0;
      i++;
    } else {
      i += 2;
      let mult = 0;
      while (f.charCodeAt(i) !== 125) {
        mult = mult * 10 + f.charCodeAt(i) - 48;
        i++;
      }
      i++;

      const inner = stack[top];
      top--;
      stack[top] += inner * mult;
    }
  }

  return stack[0];
}
