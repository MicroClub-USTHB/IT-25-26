export function solve(input: string): number {
    const lines = input.trim().split("\n");
    const firstLine = lines[0].split(";");
    const gridSize = parseInt(firstLine[0]);
    const mySymbol = firstLine[1];
    const opponentSymbol = mySymbol === "X" ? "O" : "X";
    const maxDepth = parseInt(firstLine[2]);

    const board = lines.slice(1).map(line => line.split(""));

    function checkWin(b: string[][]): string | null {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c <= gridSize - 4; c++) {
                const s = b[r][c];
                if (s !== "." && s === b[r][c + 1] && s === b[r][c + 2] && s === b[r][c + 3]) return s;
            }
        }
        for (let r = 0; r <= gridSize - 4; r++) {
            for (let c = 0; c < gridSize; c++) {
                const s = b[r][c];
                if (s !== "." && s === b[r + 1][c] && s === b[r + 2][c] && s === b[r + 3][c]) return s;
            }
        }
        for (let r = 0; r <= gridSize - 4; r++) {
            for (let c = 0; c <= gridSize - 4; c++) {
                const s = b[r][c];
                if (s !== "." && s === b[r + 1][c + 1] && s === b[r + 2][c + 2] && s === b[r + 3][c + 3]) return s;
            }
        }
        for (let r = 3; r < gridSize; r++) {
            for (let c = 0; c <= gridSize - 4; c++) {
                const s = b[r][c];
                if (s !== "." && s === b[r - 1][c + 1] && s === b[r - 2][c + 2] && s === b[r - 3][c + 3]) return s;
            }
        }
        return null;
    }

    function isDraw(b: string[][]): boolean {
        return b.every(row => row.every(cell => cell !== "."));
    }

    function minimax(b: string[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
        const winner = checkWin(b);
        if (winner === mySymbol) return 100;
        if (winner === opponentSymbol) return -100;
        if (isDraw(b) || depth === 0) return 0;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    if (b[r][c] === ".") {
                        b[r][c] = mySymbol;
                        const ev = minimax(b, depth - 1, alpha, beta, false);
                        b[r][c] = ".";
                        maxEval = Math.max(maxEval, ev);
                        alpha = Math.max(alpha, ev);
                        if (beta <= alpha) break;
                    }
                }
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    if (b[r][c] === ".") {
                        b[r][c] = opponentSymbol;
                        const ev = minimax(b, depth - 1, alpha, beta, true);
                        b[r][c] = ".";
                        minEval = Math.min(minEval, ev);
                        beta = Math.min(beta, ev);
                        if (beta <= alpha) break;
                    }
                }
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c] === ".") {
                const index = r * gridSize + c;
                board[r][c] = mySymbol;
                const score = minimax(board, maxDepth - 1, -Infinity, Infinity, false);
                board[r][c] = ".";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = index;
                } else if (score === bestScore) {
                    if (bestMove === -1 || index < bestMove) {
                        bestMove = index;
                    }
                }
            }
        }
    }

    return bestMove;
}
