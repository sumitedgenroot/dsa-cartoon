"use client";

import { useState } from "react";
import { useHighScore } from "@/lib/progress";
import { MascotSays } from "@/components/Mascot";
import { celebrate, ScoreBar } from "./kit";

const BITS = 8;

type Puzzle = { prompt: string; target: number; explain: string };

function makePuzzle(level: number): Puzzle {
  const r = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const kind = level < 3 ? 0 : r(0, 5);
  const a = r(1, 255),
    b = r(1, 255);
  switch (kind) {
    case 1:
      return { prompt: `${a} & ${b}`, target: a & b, explain: "AND keeps a bit only where BOTH have a 1." };
    case 2:
      return { prompt: `${a} | ${b}`, target: a | b, explain: "OR sets a bit where EITHER has a 1." };
    case 3:
      return { prompt: `${a} ^ ${b}`, target: a ^ b, explain: "XOR sets a bit where they DIFFER. x ^ x = 0!" };
    case 4: {
      const x = r(1, 63);
      return { prompt: `${x} << 2`, target: (x << 2) & 255, explain: "Left shift by k multiplies by 2ᵏ." };
    }
    case 5: {
      const x = r(2, 255);
      return { prompt: `${x} & (${x} - 1)`, target: x & (x - 1), explain: "x & (x − 1) removes the lowest set bit — used to count bits or test powers of two." };
    }
    default: {
      const x = level === 0 ? r(1, 31) : r(1, 255);
      return { prompt: `${x}`, target: x, explain: "Each bit is a power of two: 128 64 32 16 8 4 2 1." };
    }
  }
}

const bin = (x: number) => x.toString(2).padStart(BITS, "0");

export default function BitFlipper() {
  const { best, submit } = useHighScore("bit-flipper");
  const [level, setLevel] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle>({ prompt: "13", target: 13, explain: "Each bit is a power of two: 128 64 32 16 8 4 2 1." });
  const [bits, setBits] = useState(0);
  const [score, setScore] = useState(0);
  const [flips, setFlips] = useState(0);
  const [solved, setSolved] = useState(false);

  const flip = (i: number) => {
    if (solved) return;
    const nb = bits ^ (1 << i);
    const nf = flips + 1;
    setBits(nb);
    setFlips(nf);
    if (nb === puzzle.target) {
      setSolved(true);
      const ns = score + Math.max(5, 20 - Math.max(0, nf - BITS));
      setScore(ns);
      submit(ns);
      if ((level + 1) % 5 === 0) celebrate();
    }
  };
  const next = () => {
    const nl = level + 1;
    setLevel(nl);
    setPuzzle(makePuzzle(nl));
    setBits(0);
    setFlips(0);
    setSolved(false);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ScoreBar score={score} best={best} extra={<span className="chip bg-grape-soft text-sm">level {level + 1}</span>} />
        <button className="btn btn-sm" onClick={next}>
          ⏭ skip
        </button>
      </div>
      <div className="card flex flex-col items-center gap-2 bg-cherry-soft p-6 text-center">
        <span className="text-sm font-bold uppercase tracking-wide text-muted">make this number in binary</span>
        <span className="font-mono text-4xl font-bold">{puzzle.prompt}</span>
        {solved && <span className="font-mono text-lg">= {puzzle.target} = {bin(puzzle.target)}</span>}
      </div>
      <div className="flex justify-center gap-1.5 sm:gap-3">
        {Array.from({ length: BITS }, (_, k) => BITS - 1 - k).map((i) => {
          const on = (bits >> i) & 1;
          return (
            <button key={i} onClick={() => flip(i)} className="flex flex-col items-center gap-1" aria-label={`bit ${i}`}>
              <span className={`text-2xl transition sm:text-3xl ${on ? "drop-shadow-[0_0_10px_#ffd84d]" : "opacity-30 grayscale"}`}>💡</span>
              <span
                className={`flex h-14 w-9 items-start justify-center rounded-lg border-2 border-ink p-1 transition sm:w-11 ${on ? "bg-sun" : "bg-white"}`}
              >
                <span className={`h-5 w-full rounded border-2 border-ink bg-ink transition ${on ? "" : "translate-y-5"}`} />
              </span>
              <span className="font-mono text-lg font-bold">{on}</span>
              <span className="font-mono text-[10px] text-muted">{1 << i}</span>
            </button>
          );
        })}
      </div>
      <div className="text-center font-mono text-lg">
        you have: <b>{bits}</b> <span className="text-muted">({bin(bits)})</span>
      </div>
      <MascotSays mood={solved ? "happy" : "think"}>
        {solved ? `Lit! ${puzzle.explain}` : `Flip the switches. ${puzzle.explain}`}
      </MascotSays>
      {solved && (
        <button className="btn self-center bg-sun" onClick={next} autoFocus>
          Next puzzle →
        </button>
      )}
    </div>
  );
}
