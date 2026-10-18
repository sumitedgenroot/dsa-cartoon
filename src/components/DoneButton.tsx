"use client";

import confetti from "canvas-confetti";
import { useProgress } from "@/lib/progress";

export function DoneButton({ id }: { id: string }) {
  const { done, toggle } = useProgress();
  const isDone = !!done[id];
  return (
    <button
      className={`btn ${isDone ? "bg-mint" : "bg-white"}`}
      onClick={() => {
        if (!isDone) confetti({ particleCount: 90, spread: 70, origin: { y: 0.3 }, colors: ["#ffd84d", "#ff9ec4", "#8ecbff", "#8fe3a8", "#c3b1ff"] });
        toggle(id);
      }}
    >
      {isDone ? "✅ Learned!" : "☐ Mark as learned"}
    </button>
  );
}

export function DoneDot({ id }: { id: string }) {
  const { done } = useProgress();
  if (!done[id]) return null;
  return (
    <span className="absolute -right-2 -top-2 rotate-12 rounded-full border-2 border-ink bg-mint px-2 py-0.5 text-xs font-bold">✓ done</span>
  );
}

export function ProgressBar({ ids }: { ids: string[] }) {
  const { done } = useProgress();
  const count = ids.filter((id) => done[id]).length;
  const pct = Math.round((count / ids.length) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
        <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-sm font-bold">
        {count}/{ids.length}
      </span>
    </div>
  );
}
