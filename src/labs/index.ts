import type { Field, Input, Problem } from "./types";
import { twoSum, maxSumK, longestUnique, searchSorted, subarraySumK } from "./problems/arrays";
import { validParentheses, nextGreater } from "./problems/stack";
import { climbingStairs, coinChange, lcs } from "./problems/dp";
import { singleNumber, kthLargest, sortingRace } from "./problems/misc";
import { islands, reverseList, treeTraversal } from "./problems/graph";

export const PROBLEMS: Problem[] = [
  twoSum,
  maxSumK,
  longestUnique,
  searchSorted,
  subarraySumK,
  validParentheses,
  nextGreater,
  climbingStairs,
  coinChange,
  lcs,
  singleNumber,
  kthLargest,
  sortingRace,
  islands,
  reverseList,
  treeTraversal,
];

export const getProblem = (slug: string) => PROBLEMS.find((p) => p.slug === slug);

export function parseField(f: Field, raw: string): unknown {
  const s = raw.trim();
  switch (f.kind) {
    case "num": {
      const v = Number(s);
      if (!s || !Number.isFinite(v)) throw new Error(`${f.label} must be a number`);
      return Math.trunc(v);
    }
    case "nums": {
      if (!s) return [];
      return s
        .replace(/^\[|\]$/g, "")
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((x) => {
          if (x === "null") return null;
          const v = Number(x);
          if (!Number.isFinite(v)) throw new Error(`"${x}" is not a number in ${f.label}`);
          return Math.trunc(v);
        });
    }
    case "text":
      return raw.replace(/\s+/g, "");
    case "grid": {
      const rows = s
        .split(/\n|;/)
        .map((r) => r.replace(/[^01]/g, ""))
        .filter(Boolean)
        .map((r) => [...r].map(Number));
      if (rows.some((r) => r.length !== rows[0].length)) throw new Error("All grid rows must have the same length");
      return rows;
    }
  }
}

export function parseInput(p: Problem, raw: Record<string, string>): { input?: Input; error?: string } {
  try {
    const input: Input = {};
    for (const f of p.fields) input[f.key] = parseField(f, raw[f.key] ?? "");
    for (const f of p.fields)
      if (f.kind === "nums" && f.key !== "tree" && (input[f.key] as unknown[]).some((v) => v === null))
        return { error: `null is only allowed in tree inputs` };
    const err = p.validate?.(input);
    if (err) return { error: err };
    return { input };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
