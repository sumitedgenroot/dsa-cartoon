"use client";

import confetti from "canvas-confetti";
import { Mascot, type Mood } from "@/components/Mascot";

export const celebrate = () =>
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.35 }, colors: ["#ffd84d", "#ff9ec4", "#8ecbff", "#8fe3a8", "#c3b1ff"] });

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function ScoreBar({
  score,
  best,
  lives,
  extra,
}: {
  score: number;
  best: number;
  lives?: number;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="chip bg-sun text-sm">⭐ score {score}</span>
      <span className="chip bg-white text-sm">🏆 best {best}</span>
      {lives !== undefined && <span className="chip bg-white text-sm">{"❤️".repeat(Math.max(0, lives))}{"🤍".repeat(Math.max(0, 3 - lives))}</span>}
      {extra}
    </div>
  );
}

export function EndScreen({
  title,
  score,
  best,
  mood = "happy",
  onRestart,
  children,
}: {
  title: string;
  score: number;
  best: number;
  mood?: Mood;
  onRestart: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 bg-sun-soft p-8 text-center">
      <Mascot mood={mood} size={110} className="animate-float" />
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-lg">
        Score <b className="font-mono text-2xl">{score}</b> · best <b className="font-mono">{Math.max(best, score)}</b>
      </p>
      {children}
      <button className="btn bg-sun" onClick={onRestart}>
        🔁 Play again
      </button>
    </div>
  );
}

export function StartScreen({ title, rules, onStart, children }: { title: string; rules: string[]; onStart: () => void; children?: React.ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center">
      <Mascot mood="wink" size={100} className="animate-float" />
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="flex flex-col gap-1 text-left text-ink-soft">
        {rules.map((r) => (
          <li key={r}>• {r}</li>
        ))}
      </ul>
      {children}
      <button className="btn bg-sun px-6 text-lg" onClick={onStart}>
        ▶ Start
      </button>
    </div>
  );
}

export function TimerBar({ left, total }: { left: number; total: number }) {
  const pct = Math.max(0, (left / total) * 100);
  return (
    <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
      <div
        className={`h-full transition-[width] duration-100 ${pct < 30 ? "bg-cherry" : pct < 60 ? "bg-sun" : "bg-mint"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
