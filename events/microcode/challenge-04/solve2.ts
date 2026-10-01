export function solve(input: string): number {
    const lines = input.trim().split("\n");
    const dishes = lines[0].trim().split(",").map(Number);
    const k = parseInt(lines[1]);
    const n = dishes.length;

    let maxNeighborSum = 0;
    for (let i = 0; i < n; i++) {
        const sum = dishes[i] + dishes[(i + 1) % n];
        if (sum > maxNeighborSum) {
            maxNeighborSum = sum;
        }
    }

    const totalDishes = dishes.reduce((a, b) => a + b, 0);
    const maxPerRound = Math.floor(n / 2);
    const capacityRounds = Math.ceil(totalDishes / maxPerRound);

    const part1Answer = Math.max(maxNeighborSum, capacityRounds);

    let maxCooldownRounds = 0;
    for (let i = 0; i < n; i++) {
        const roundsNeeded = dishes[i] * (k + 1) - k;
        if (roundsNeeded > maxCooldownRounds) {
            maxCooldownRounds = roundsNeeded;
        }
    }

    return Math.max(part1Answer, maxCooldownRounds);
}
