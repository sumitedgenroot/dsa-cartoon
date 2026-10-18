import type { Mood } from "@/components/Mascot";

export type CellTone =
  | "active"
  | "compare"
  | "found"
  | "done"
  | "dim"
  | "window"
  | "warn"
  | "sorted"
  | "pivot";

export type ArrayState = {
  label?: string;
  values: (number | string)[];
  /** small caption under each cell (e.g. original index) */
  sub?: (number | string)[];
  tones?: Record<number, CellTone>;
  pointers?: Record<string, number>;
  window?: [number, number];
};

export type MapState = {
  title: string;
  kind?: "map" | "set";
  entries: [string, string][];
  highlight?: string[];
  miss?: string;
};

export type StackState = {
  title: string;
  kind: "stack" | "queue";
  items: string[];
  /** index of the item to highlight */
  highlight?: number;
};

export type TableState = {
  title: string;
  rows: (string | number | null)[][];
  rowLabels?: string[];
  colLabels?: string[];
  active?: [number, number];
  reads?: [number, number][];
};

/** 0 water, 1 land, 2 visited, 3 in queue/stack, 4 current */
export type GridState = { cells: number[][]; labels?: (string | number | null)[][] };

export type BarsState = { values: number[]; tones?: Record<number, CellTone> };

export type ListState = {
  values: (number | string)[];
  /** next[i] = index of the node that node i points to, or null */
  next: (number | null)[];
  pointers: Record<string, number | null>;
  tones?: Record<number, CellTone>;
};

/** binary tree stored heap-style: children of i are 2i+1 and 2i+2 */
export type TreeState = {
  title?: string;
  values: (number | string | null)[];
  tones?: Record<number, CellTone>;
  output?: (number | string)[];
};

export type Frame = {
  step: string;
  msg: string;
  mood?: Mood;
  arrays?: ArrayState[];
  maps?: MapState[];
  stacks?: StackState[];
  table?: TableState;
  grid?: GridState;
  bars?: BarsState;
  list?: ListState;
  tree?: TreeState;
  vars?: Record<string, string | number | boolean>;
  ops: number;
};

export type FieldKind = "nums" | "num" | "text" | "grid";

export type Field = { key: string; label: string; kind: FieldKind; hint?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Input = Record<string, any>;

export type Badge = "Brute Force" | "Better" | "Optimal" | "Greedy" | "DP" | "Recursion" | "Classic";

export type Approach = {
  id: string;
  name: string;
  badge: Badge;
  time: string;
  space: string;
  idea: string;
  java: string;
  cpp: string;
  run: (input: Input, t: import("./tracer").Tracer) => string;
  /** largest n the complexity race will try (protects the browser from exponential blow-ups) */
  maxN?: number;
};

export type Problem = {
  slug: string;
  title: string;
  emoji: string;
  topic: string;
  level: "Easy" | "Medium" | "Hard";
  statement: string;
  fields: Field[];
  defaults: Record<string, string>;
  validate?: (input: Input) => string | null;
  /** random input of size n for the complexity race */
  gen: (n: number) => Input;
  sizes: number[];
  sizeLabel?: string;
  approaches: Approach[];
  /** when to pick which approach */
  takeaway: string;
  maxViz?: number;
};
