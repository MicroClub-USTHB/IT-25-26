export function solve(input: string): number {
  const s = input.trim();
  const n = s.length;
  let i = 0;

  let T = 0;
  while (i < n && s.charCodeAt(i) !== 10) {
    T = T * 10 + s.charCodeAt(i) - 48;
    i++;
  }
  i++;

  const seen = new Uint8Array(T + 1);

  while (i < n) {
    let v = 0;
    while (i < n && s.charCodeAt(i) !== 10) {
      v = v * 10 + s.charCodeAt(i) - 48;
      i++;
    }
    i++;

    const c = T - v;
    if (seen[c]) return v * c;
    seen[v] = 1;
  }

  throw new Error("No valid pair found");
}
