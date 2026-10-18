"use client";

import { fmt, type Point } from "@/labs/complexity";

export type Series = { id: string; name: string; color: string; points: Point[] };

export function ComplexityChart({
  series,
  sizes,
  log,
  metric = "ops",
  xLabel = "n",
}: {
  series: Series[];
  sizes: number[];
  log: boolean;
  metric?: "ops" | "ms";
  xLabel?: string;
}) {
  const W = 680,
    H = 330,
    L = 62,
    R = 18,
    T = 16,
    B = 44;
  const minN = Math.min(...sizes),
    maxN = Math.max(...sizes);
  const geometric = maxN / Math.max(1, minN) > 40;
  const xs = (n: number) =>
    geometric
      ? L + ((Math.log(n) - Math.log(minN)) / (Math.log(maxN) - Math.log(minN) || 1)) * (W - L - R)
      : L + ((n - minN) / (maxN - minN || 1)) * (W - L - R);
  const val = (p: Point) => Math.max(metric === "ops" ? p.ops : p.ms, metric === "ops" ? 1 : 0.001);
  const all = series.flatMap((s) => s.points.map(val));
  const maxY = Math.max(10, ...all);
  const minY = log ? Math.max(metric === "ops" ? 1 : 0.001, Math.min(...all, maxY / 10)) : 0;
  const ys = (v: number) =>
    log
      ? H - B - ((Math.log10(v) - Math.log10(minY)) / (Math.log10(maxY) - Math.log10(minY) || 1)) * (H - T - B)
      : H - B - (v / maxY) * (H - T - B);

  const yTicks = log
    ? (() => {
        const out: number[] = [];
        for (let e = Math.floor(Math.log10(minY)); e <= Math.ceil(Math.log10(maxY)); e++) {
          const v = 10 ** e;
          if (v >= minY * 0.99 && v <= maxY * 1.01) out.push(v);
        }
        return out;
      })()
    : [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Operations versus input size">
      {/* grid */}
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={ys(Math.max(v, minY))} y2={ys(Math.max(v, minY))} stroke="#ebe8f3" strokeWidth="1.5" strokeDasharray="4 5" />
          <text x={L - 8} y={ys(Math.max(v, minY)) + 4} textAnchor="end" fill="#77738c" className="font-mono text-[11px]">
            {metric === "ms" ? (v < 1 ? v.toFixed(2) : fmt(v)) : fmt(v)}
          </text>
        </g>
      ))}
      {sizes.map((n, i) =>
        sizes.length > 9 && i % 2 === 1 ? null : (
          <text key={n} x={xs(n)} y={H - B + 18} textAnchor="middle" fill="#77738c" className="font-mono text-[11px]">
            {fmt(n)}
          </text>
        ),
      )}
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fill="#1f1d2b" className="font-display text-[13px] font-semibold">
        input size {xLabel} →
      </text>
      <text x={14} y={(T + H - B) / 2} textAnchor="middle" fill="#1f1d2b" className="font-display text-[13px] font-semibold" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>
        {metric === "ops" ? "operations" : "milliseconds"} {log ? "(log)" : ""}
      </text>
      <path d={`M ${L} ${T} L ${L} ${H - B} L ${W - R} ${H - B}`} stroke="#1f1d2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {series.map((s) => {
        if (!s.points.length) return null;
        const d = s.points.map((p, i) => `${i ? "L" : "M"} ${xs(p.n).toFixed(1)} ${ys(val(p)).toFixed(1)}`).join(" ");
        return (
          <g key={s.id}>
            <path d={d} stroke="#1f1d2b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <path d={d} stroke={s.color} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {s.points.map((p) => (
              <circle key={p.n} cx={xs(p.n)} cy={ys(val(p))} r="4.5" fill={s.color} stroke="#1f1d2b" strokeWidth="2" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
