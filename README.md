# DSA Quest 🎮

Learn DSA by watching, racing and playing. A minimal white, cartoon-style Next.js site with every concept in **Java and C++**.

## What's inside

- **22 topics** (`/topics`): a cartoon analogy, the concept, when to use it, signal words, the thought process, a Hinglish tip, Java + C++ code, gotchas and LeetCode practice links.
- **Algo Lab** (`/lab`): 16 problems with 44 approaches (brute force → better → optimal). Each problem has three modes:
  - 🎬 **Step-by-step**: animated arrays, hash maps, stacks, DP tables, grids, trees and linked lists, with the matching Java/C++ line highlighted and a live operation counter.
  - 🏎️ **Side-by-side**: all approaches on the same input with a shared "work clock".
  - 📈 **Complexity race**: runs every approach on growing random inputs, plots operations and milliseconds, detects the Big-O from the measurements, and estimates how long a huge input would take.
- **10 games** (`/games`): Big-O Battle, Pattern Detective, Binary Search Bot, Bracket Rush, Tower of Hanoi, N-Queens, Maze Race (BFS vs DFS), Coin Cashier (greedy vs DP), Bit Flipper, Heap Hero.
- **Which Algo?** (`/patterns`): a pattern-finder wizard, the brute force → optimal ladder, when to use brute force, recursion, backtracking, DP or greedy, the constraints → complexity table, and UMPIRE.
- **OOPs** (`/oops`) and **Cheatsheet** (`/cheatsheet`): the 4 pillars, LRU Cache and Min Stack, and Java ↔ C++ STL mappings.

The Java / C++ toggle in the header switches every code block. Your progress and high scores are saved in your browser.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Built with Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, Motion, lucide-react and canvas-confetti.

## Adding a lab problem

Add a `Problem` in `src/labs/problems/*.ts` and register it in `src/labs/index.ts`. Each approach's `run(input, tracer)` calls `t.op()` to count work and `t.snap(() => frame)` to record animation frames. In the Java/C++ code strings, `//@step` markers link frames to code lines.
