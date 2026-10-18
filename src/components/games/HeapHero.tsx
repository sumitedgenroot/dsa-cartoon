"use client";

import { useState } from "react";
import { MascotSays } from "@/components/Mascot";
import { useHighScore } from "@/lib/progress";
import { celebrate, ScoreBar } from "./kit";

function randomArray(n: number) {
  const pool = Array.from({ length: 60 }, (_, i) => i + 1);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

/** swaps the textbook bottom-up heapify would make */
function heapifySwaps(a: number[]) {
  const h = [...a];
  let swaps = 0;
  for (let i = (h.length >> 1) - 1; i >= 0; i--) {
    let k = i;
    for (;;) {
      const l = 2 * k + 1,
        r = l + 1;
      let m = k;
      if (l < h.length && h[l] < h[m]) m = l;
      if (r < h.length && h[r] < h[m]) m = r;
      if (m === k) break;
      [h[m], h[k]] = [h[k], h[m]];
      swaps++;
      k = m;
    }
  }
  return swaps;
}

export default function HeapHero() {
  const { best, submit } = useHighScore("heap-builder");
  const [size, setSize] = useState(7);
  const [arr, setArr] = useState<number[]>(() => [9, 4, 7, 1, 8, 2, 6]);
  const [swaps, setSwaps] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [target, setTarget] = useState(() => heapifySwaps([9, 4, 7, 1, 8, 2, 6]));

  const bad = new Set<number>();
  arr.forEach((v, i) => {
    if (i > 0 && arr[(i - 1) >> 1] > v) bad.add(i);
  });
  const valid = bad.size === 0;

  const newRound = (n = size) => {
    let a = randomArray(n);
    while (heapifySwaps(a) === 0) a = randomArray(n);
    setSize(n);
    setArr(a);
    setTarget(heapifySwaps(a));
    setSwaps(0);
    setSel(null);
    setDone(false);
  };

  const click = (i: number) => {
    if (done) return;
    if (sel === null) {
      setSel(i);
      return;
    }
    const a = sel,
      b = i;
    setSel(null);
    const isEdge = (a > 0 && (a - 1) >> 1 === b) || (b > 0 && (b - 1) >> 1 === a);
    if (!isEdge || a === b) return;
    const next = [...arr];
    [next[a], next[b]] = [next[b], next[a]];
    setArr(next);
    setSwaps((s) => s + 1);
    const ok = next.every((v, k) => k === 0 || next[(k - 1) >> 1] <= v);
    if (ok) {
      setDone(true);
      const gained = Math.max(10, 50 - (swaps + 1 - target) * 10);
      const ns = score + gained;
      setScore(ns);
      submit(ns);
      if (swaps + 1 <= target) celebrate();
    }
  };

  const depth = Math.floor(Math.log2(arr.length)) + 1;
  const W = 560,
    levelH = 78;
  const pos = (i: number) => {
    const d = Math.floor(Math.log2(i + 1));
    const p = i - (2 ** d - 1);
    return { x: ((p + 0.5) / 2 ** d) * W, y: d * levelH + 30 };
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <ScoreBar score={score} best={best} extra={<span className="chip bg-white text-sm">swaps {swaps} · par {target}</span>} />
        <div className="ml-auto flex gap-1">
          {[7, 10, 15].map((k) => (
            <button key={k} className={`btn btn-sm ${k === size ? "bg-ink text-white" : ""}`} onClick={() => newRound(k)}>
              {k} nodes
            </button>
          ))}
        </div>
      </div>
      <div className="card bg-white p-3">
        <svg viewBox={`0 0 ${W} ${depth * levelH + 10}`} className="w-full">
          {arr.map((_, i) => {
            if (i === 0) return null;
            const a = pos((i - 1) >> 1),
              b = pos(i);
            return <line key={`e${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={bad.has(i) ? "#ff7a7a" : "#1f1d2b"} strokeWidth={bad.has(i) ? 5 : 2.5} strokeDasharray={bad.has(i) ? "6 5" : undefined} />;
          })}
          {arr.map((v, i) => {
            const p = pos(i);
            return (
              <g key={i} onClick={() => click(i)} className="cursor-pointer">
                <circle cx={p.x} cy={p.y} r={24} fill={sel === i ? "#ffd84d" : done ? "#8fe3a8" : "#fff"} stroke="#1f1d2b" strokeWidth="3" />
                <text x={p.x} y={p.y + 6} textAnchor="middle" className="pointer-events-none font-mono text-[17px] font-bold" fill="#1f1d2b">
                  {v}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex flex-wrap items-center gap-1 font-mono text-sm">
          <span className="mr-1 text-xs font-bold uppercase text-muted">array</span>
          {arr.map((v, i) => (
            <span key={i} className={`rounded border-2 border-ink px-1.5 ${bad.has(i) ? "bg-cherry-soft" : "bg-white"}`}>
              {v}
            </span>
          ))}
          <span className="ml-2 text-xs text-muted">children of i are 2i+1 and 2i+2</span>
        </div>
      </div>
      <MascotSays mood={done ? (swaps <= target ? "cool" : "happy") : sel !== null ? "think" : "wink"}>
        {done
          ? swaps <= target
            ? `Valid min-heap in ${swaps} swaps — matching heapify's ${target}! 🦸`
            : `Valid heap! You used ${swaps} swaps; bottom-up heapify needs ${target}. Tip: fix from the last parent up to the root.`
          : valid
            ? "Already a heap!"
            : sel !== null
              ? "Now click its parent or child to swap them."
              : "Make it a MIN-heap: every parent ≤ its children. Red dashed edges are broken. Click a node, then its parent/child, to swap."}
      </MascotSays>
      {done && (
        <button className="btn self-center bg-sun" onClick={() => newRound()}>
          Next heap →
        </button>
      )}
    </div>
  );
}
