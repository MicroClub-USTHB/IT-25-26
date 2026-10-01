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

  const values = new Int32Array(50001);
  let count = 0;
  while (i < n) {
    let v = 0;
    while (i < n && s.charCodeAt(i) !== 10) {
      v = v * 10 + s.charCodeAt(i) - 48;
      i++;
    }
    i++;
    values[count++] = v;
  }

  const sorted = values.subarray(0, count);
  sorted.sort();

  for (let a = 0; a < count - 2; a++) {
    if (a > 0 && sorted[a] === sorted[a - 1]) continue;
    const target = T - sorted[a];

    if (sorted[a + 1] + sorted[a + 2] > target) break;
    if (sorted[count - 2] + sorted[count - 1] < target) continue;

    let left = a + 1;
    let right = count - 1;
    while (left < right) {
      const sum = sorted[left] + sorted[right];
      if (sum === target) {
        if (sorted[right] - sorted[a] >= 1000) {
          return sorted[a] * sorted[left] * sorted[right];
        }
        left++;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }

  throw new Error("No valid triplet found");
}
