"use client";

import { useState } from "react";
import Link from "next/link";
import { PATTERNS, PUZZLES, getPattern, type Puzzle } from "@/data/patterns";
import { useHighScore } from "@/lib/progress";
import { MascotSays } from "@/components/Mascot";
import { celebrate, EndScreen, ScoreBar, shuffle, StartScreen } from "./kit";

type Round = { puzzle: Puzzle; options: string[] };

function makeRounds(): Round[] {
  return shuffle(PUZZLES)
    .slice(0, 10)
    .map((p) => ({
      puzzle: p,
      options: shuffle([p.answer, ...shuffle(PATTERNS.filter((x) => x.id !== p.answer)).slice(0, 3).map((x) => x.id)]),
    }));
}

export default function PatternDetective() {
  const { best, submit } = useHighScore("pattern-detective");
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [ri, setRi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);

  const start = () => {
    setRounds(makeRounds());
    setRi(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setCorrect(0);
    setPhase("play");
  };

  if (phase === "start")
    return (
      <StartScreen
        title="Pattern Detective 🕵️"
        rules={[
          "You get a problem statement — like in an interview.",
          "Pick the technique you'd reach for first.",
          "Look for signal words: sorted, contiguous, top k, number of ways…",
          "10 cases. Streaks earn bonus points.",
        ]}
        onStart={start}
      />
    );

  if (phase === "end")
    return (
      <EndScreen title={correct >= 8 ? "Master detective! 🕵️" : correct >= 5 ? "Good instincts!" : "Keep training!"} score={score} best={best} mood={correct >= 5 ? "cool" : "think"} onRestart={start}>
        <p className="text-ink-soft">
          {correct}/10 solved. Review the <Link href="/patterns" className="font-bold underline">Which Algo?</Link> guide to sharpen your reflexes.
        </p>
      </EndScreen>
    );

  const r = rounds[ri];
  const ans = getPattern(r.puzzle.answer);
  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === r.puzzle.answer) {
      setScore((s) => s + 10 + streak * 5);
      setStreak((s) => s + 1);
      setCorrect((c) => c + 1);
    } else setStreak(0);
  };
  const next = () => {
    if (ri + 1 >= rounds.length) {
      submit(score);
      if (correct >= 7) celebrate();
      setPhase("end");
      return;
    }
    setRi(ri + 1);
    setPicked(null);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ScoreBar score={score} best={best} extra={<span className="chip bg-bubble-soft text-sm">🔥 streak {streak}</span>} />
        <span className="font-mono text-sm text-muted">case {ri + 1}/10</span>
      </div>
      <div className="card relative bg-grape-soft p-6">
        <span className="absolute -top-3 left-5 rotate-[-3deg] rounded-md border-2 border-ink bg-sun px-2 text-sm font-bold">CASE FILE #{ri + 1}</span>
        <p className="font-hand text-2xl leading-snug">{r.puzzle.text}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {r.options.map((id) => {
          const p = getPattern(id);
          const isAns = picked && id === r.puzzle.answer;
          const isWrong = picked === id && id !== r.puzzle.answer;
          return (
            <button
              key={id}
              disabled={!!picked}
              onClick={() => choose(id)}
              className={`btn justify-start py-3 text-left disabled:opacity-100 ${isAns ? "bg-mint" : isWrong ? "bg-cherry" : "bg-white"}`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="whitespace-normal">{p.name}</span>
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <MascotSays mood={picked === r.puzzle.answer ? "happy" : "think"}>
            {picked === r.puzzle.answer ? "Case closed! " : `It's ${ans.name}. `}
            {r.puzzle.why}
          </MascotSays>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Signals for {ans.name}:</span>
            {ans.signals.map((s) => (
              <span key={s} className="chip bg-white font-mono text-xs">
                {s}
              </span>
            ))}
            <button className="btn ml-auto bg-sun" onClick={next} autoFocus>
              {ri + 1 >= rounds.length ? "See results" : "Next case →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
