# MicroCode 2026

**MicroCode** was a story-driven coding competition organized by the MicroClub IT Section, inspired by Advent of Code. Each challenge is a chapter in a Ramadan adventure through space: an astronaut and their crew have to find the crescent moon, cook iftar after losing signal, land on alien planets, send mission data back to Earth and finally get home in time for Eid.

- **Two-part puzzles:** solving Part 1 unlocks a harder Part 2.
- **Unique inputs:** every participant got their own generated puzzle input.
- **Any language:** only the submitted answer mattered.
- **Ranked:** the number of challenges solved came first, and solving speed broke ties.

This folder holds a writeup and the reference solutions (in TypeScript) for each of the **20 challenges**.

## Layout

```text
microcode/
├── README.md
└── challenge-NN/
    ├── README.md   # the writeup: problem, way of thinking, pitfalls
    ├── solve1.ts   # Part 1 solution
    └── solve2.ts   # Part 2 solution
```

- Each `README.md` explains the problem and how to reach the solution step by step.
- `solve1.ts` and `solve2.ts` are the exact reference solutions and contain no comments, because the writeup explains them.
- Every solver exports `solve(input: string): number`.
- In challenges 03, 09, 12 and 19, `solve2.ts` imports helpers from `./solve1`. Challenge 03 also keeps its stack-machine interpreter in `solve1.ts`.

## Challenges

### Easy

| #   | Challenge                               | Topics                                                 |
| --- | --------------------------------------- | ------------------------------------------------------ |
| 01  | [Crescent Calibration](./challenge-01/) | Two-sum variant, triplet search                        |
| 02  | [Formula Folding](./challenge-02/)      | Parsing, nested expressions, modular arithmetic        |
| 03  | [Signal Stack](./challenge-03/)         | Stack operations, stateful VM, 32-bit integer wrapping |
| 04  | [Galley Gyration](./challenge-04/)      | Circular array scheduling, capacity bounding           |

### Medium

| #   | Challenge                             | Topics                                             |
| --- | ------------------------------------- | -------------------------------------------------- |
| 05  | [Stellar Static](./challenge-05/)     | String parsing, primality testing, cycle detection |
| 06  | [Linguistic Lineage](./challenge-06/) | Directed trees, Lowest Common Ancestor (LCA)       |
| 07  | [Genetic Generation](./challenge-07/) | Cellular automata, bitwise logic, state simulation |
| 08  | [Terminal Tactics](./challenge-08/)   | Minimax, alpha-beta pruning, expectiminimax        |
| 09  | [Toroidal Tracking](./challenge-09/)  | Bounded backtracking, toroidal Manhattan distance  |
| 10  | [Network Navigation](./challenge-10/) | Directed graph cycles, Kosaraju's SCCs, DAG longest path |

### Hard

| #   | Challenge                                | Topics                                                   |
| --- | ---------------------------------------- | -------------------------------------------------------- |
| 11  | [Magnetic Moves](./challenge-11/)        | N-Queens constraint satisfaction, bipartite matching     |
| 12  | [Heap Hazards](./challenge-12/)          | Directed graphs, reference counting, mark-and-sweep GC   |
| 13  | [Constellation Cuboids](./challenge-13/) | 3D computational geometry, Inclusion-Exclusion principle |
| 14  | [Conveyor Chaos](./challenge-14/)        | Grid simulation, functional graph cycle detection        |
| 15  | [Palindrome Protocol](./challenge-15/)   | Manacher's Algorithm, Double-Hashed Fenwick Trees        |

### Boss

| #   | Challenge                            | Topics                                                    |
| --- | ------------------------------------ | --------------------------------------------------------- |
| 16  | [Shield Sequence](./challenge-16/)   | PRNGs (LCG/PCG), O(log T) affine leap-ahead, BigInt       |
| 17  | [Keypad Cascade](./challenge-17/)    | Recursive memoization, combinatorial pathfinding          |
| 18  | [Thermal Partition](./challenge-18/) | Divide and Conquer DP optimization, contiguous sub-arrays |
| 19  | [Guidance Gates](./challenge-19/)    | Boolean circuit DAG simulation, iterative deepening DFS   |
| 20  | [Bazaar Bidding](./challenge-20/)    | Combinatorial auction, branch-and-bound, LP relaxation    |
