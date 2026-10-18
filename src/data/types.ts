import type { Tone } from "@/components/ui";

export type Level = "Easy" | "Medium" | "Hard";

export type Example = {
  title: string;
  logic?: string;
  java: string;
  cpp: string;
  time: string;
  space: string;
};

export type Practice = { name: string; level: Level; lc?: string };

export type Topic = {
  slug: string;
  num: number;
  title: string;
  emoji: string;
  tone: Tone;
  tier: "Must" | "Strong" | "Good";
  tagline: string;
  /** cartoon story that explains the idea with a real-life picture */
  analogy: string;
  concept: string;
  whenToUse: string[];
  /** words in a problem statement that should ring this bell */
  signals: string[];
  thought: string;
  /** the Hinglish tip from the master sheet */
  desi: string;
  template?: string[];
  ops?: { op: string; java: string; cpp: string; time: string }[];
  examples: Example[];
  gotchas: string[];
  practice: Practice[];
  labs?: string[];
  games?: string[];
};

export const lcUrl = (p: Practice) =>
  `https://leetcode.com/problems/${
    p.lc ??
    p.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  }/`;
