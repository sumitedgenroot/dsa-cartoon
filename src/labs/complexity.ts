// Guess the Big-O class of measured (n, ops) points by checking which growth
// function keeps ops / f(n) the most constant.

export type Point = { n: number; ops: number; ms: number };

type Growth = { label: string; f: (n: number) => number };

const CANDIDATES: Growth[] = [
  { label: "O(1)", f: () => 1 },
  { label: "O(log n)", f: (n) => Math.log2(n + 1) },
  { label: "O(n)", f: (n) => n },
  { label: "O(n log n)", f: (n) => n * Math.log2(n + 1) },
  { label: "O(n²)", f: (n) => n * n },
  { label: "O(n³)", f: (n) => n * n * n },
  { label: "O(2ⁿ)", f: (n) => Math.pow(1.618, n) },
  { label: "O(2ⁿ)", f: (n) => Math.pow(2, n) },
];

export type Detection = { label: string; confidence: number; coef: number; f: (n: number) => number };

export function detectComplexity(points: Point[]): Detection | null {
  const pts = points.filter((p) => p.ops > 0);
  if (pts.length < 3) return null;
  // the last few points matter most: small inputs are dominated by constant overhead
  const use = pts.slice(Math.max(0, pts.length - 5));
  const scored = CANDIDATES.map((c) => {
    const logs = use.map((p) => Math.log(p.ops) - Math.log(c.f(p.n)));
    const mean = logs.reduce((a, b) => a + b, 0) / logs.length;
    const sd = Math.sqrt(logs.reduce((a, b) => a + (b - mean) ** 2, 0) / logs.length);
    const trend = Math.abs(logs[logs.length - 1] - logs[0]);
    return { c, score: sd + trend * 0.5, coef: Math.exp(mean) };
  }).sort((a, b) => a.score - b.score);
  const best = scored[0];
  const gap = scored[1].score - best.score;
  const confidence = Math.max(0.3, Math.min(0.99, 0.55 + gap * 2 - best.score));
  return { label: best.c.label, confidence, coef: best.coef, f: best.c.f };
}

/** Does the detected class agree with the textbook claim, e.g. "O(n log n) avg" vs "O(n log n)". */
export function matchesClaim(claim: string, detected: string) {
  const c = claim.replace(/\s|avg|amortized/gi, "").split(",")[0].toLowerCase();
  const d = detected.replace(/\s/g, "").toLowerCase();
  if (c.startsWith(d)) return true;
  if (d === "o(2ⁿ)" && /ⁿ|ᵐ|ᵃ/.test(c) && !c.includes("n²")) return true;
  return false;
}

export const fmt = (x: number) =>
  !Number.isFinite(x)
    ? "∞"
    : x >= 1e15
      ? x.toExponential(1)
      : x >= 1e12
        ? (x / 1e12).toFixed(1) + "T"
        : x >= 1e9
          ? (x / 1e9).toFixed(1) + "B"
          : x >= 1e6
            ? (x / 1e6).toFixed(1) + "M"
            : x >= 1e4
              ? (x / 1e3).toFixed(1) + "k"
              : String(Math.round(x));

/** Human-friendly duration for `ops` simple operations at ~10^8 ops/second (a typical judge). */
export function humanTime(ops: number) {
  const s = ops / 1e8;
  if (!Number.isFinite(s) || s > 3.15e17) return "longer than the universe 🌌";
  if (s < 1e-3) return "< 1 ms ⚡";
  if (s < 1) return `${(s * 1000).toFixed(0)} ms`;
  if (s < 60) return `${s.toFixed(1)} s`;
  if (s < 3600) return `${(s / 60).toFixed(1)} min`;
  if (s < 86400) return `${(s / 3600).toFixed(1)} hours`;
  if (s < 3.15e7) return `${(s / 86400).toFixed(1)} days`;
  return `${(s / 3.15e7).toExponential(1)} years 🦕`;
}
