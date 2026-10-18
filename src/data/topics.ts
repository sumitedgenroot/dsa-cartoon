import { TOPICS_A } from "./topics-a";
import { TOPICS_B } from "./topics-b";
import type { Topic } from "./types";

export const TOPICS: Topic[] = [...TOPICS_A, ...TOPICS_B];

export const getTopic = (slug: string) => TOPICS.find((t) => t.slug === slug);

export const TIER_INFO: Record<Topic["tier"], { label: string; note: string; cls: string }> = {
  Must: { label: "MUST", note: "~60% of interview questions", cls: "bg-cherry" },
  Strong: { label: "STRONG", note: "show up often", cls: "bg-sun" },
  Good: { label: "GOOD-TO-HAVE", note: "senior / specific rounds", cls: "bg-sky" },
};

/** Suggested learning order (weeks) from the master sheet's 6-week plan. */
export const ROADMAP = [
  { week: "Week 1–2", focus: "Foundations", slugs: ["big-o", "two-pointers", "sliding-window", "hashing", "prefix-sum", "binary-search", "strings"] },
  { week: "Week 3–4", focus: "Structures", slugs: ["sorting", "linked-list", "stack-queue", "trees", "recursion-backtracking"] },
  { week: "Week 5", focus: "Advanced", slugs: ["dynamic-programming", "heap", "graphs", "greedy", "intervals"] },
  { week: "Week 6", focus: "Extras + mocks", slugs: ["union-find", "trie", "bit-manipulation", "math", "segment-fenwick"] },
];
