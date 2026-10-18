import type { Tone } from "@/components/ui";

export type GameMeta = { slug: string; title: string; emoji: string; blurb: string; topic: string; tone: Tone; skill: string };

export const GAMES: GameMeta[] = [
  { slug: "big-o-battle", title: "Big-O Battle", emoji: "⏱️", blurb: "Read the code, guess its complexity before the timer runs out.", topic: "big-o", tone: "sky", skill: "Complexity analysis" },
  { slug: "pattern-detective", title: "Pattern Detective", emoji: "🕵️", blurb: "Read a problem, pick the right technique. Train the interview reflex.", topic: "big-o", tone: "grape", skill: "Choosing the algorithm" },
  { slug: "number-guess", title: "Binary Search Bot", emoji: "🔢", blurb: "Beat the bot at guessing — or watch it find your number in ≤ 10 tries.", topic: "binary-search", tone: "sun", skill: "Binary search" },
  { slug: "bracket-rush", title: "Bracket Rush", emoji: "🥞", blurb: "Push and pop the pancake stack fast to keep brackets balanced.", topic: "stack-queue", tone: "peach", skill: "Stacks" },
  { slug: "hanoi", title: "Tower of Hanoi", emoji: "🗼", blurb: "The classic recursion puzzle. Can you hit the minimum 2ⁿ − 1 moves?", topic: "recursion-backtracking", tone: "mint", skill: "Recursion" },
  { slug: "n-queens", title: "N-Queens", emoji: "👑", blurb: "Place N queens with no attacks — then watch backtracking do it.", topic: "recursion-backtracking", tone: "bubble", skill: "Backtracking" },
  { slug: "maze-race", title: "Maze Race: BFS vs DFS", emoji: "🌀", blurb: "Draw walls, then race BFS against DFS to the cheese.", topic: "graphs", tone: "sky", skill: "Graph traversal" },
  { slug: "coin-change", title: "Coin Cashier", emoji: "🪙", blurb: "Make change with the fewest coins. Is greedy enough, or do you need DP?", topic: "dynamic-programming", tone: "sun", skill: "Greedy vs DP" },
  { slug: "bit-flipper", title: "Bit Flipper", emoji: "💡", blurb: "Flip switches to build the target number in binary. XOR puzzles inside!", topic: "bit-manipulation", tone: "cherry", skill: "Bit manipulation" },
  { slug: "heap-builder", title: "Heap Hero", emoji: "⛰️", blurb: "Restore the heap: swap nodes so every parent is smaller than its kids.", topic: "heap", tone: "grape", skill: "Heaps" },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);
