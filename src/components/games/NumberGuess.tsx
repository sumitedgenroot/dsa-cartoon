"use client";

import { useState } from "react";
import { MascotSays } from "@/components/Mascot";
import { useHighScore } from "@/lib/progress";
import { celebrate } from "./kit";

const MAX = 1000;

function RangeBar({ lo, hi, mark }: { lo: number; hi: number; mark?: number }) {
  return (
    <div className="relative h-10 rounded-xl border-2 border-ink bg-line/40">
      <div
        className="absolute top-0 h-full rounded-lg bg-mint transition-all duration-300"
        style={{ left: `${((lo - 1) / MAX) * 100}%`, width: `${((hi - lo + 1) / MAX) * 100}%` }}
      />
      {mark !== undefined && (
        <div className="absolute -top-2 h-12 w-[3px] bg-ink transition-all duration-300" style={{ left: `${((mark - 0.5) / MAX) * 100}%` }}>
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded border-2 border-ink bg-sun px-1 font-mono text-xs font-bold">{mark}</span>
        </div>
      )}
      <span className="absolute -bottom-6 left-0 font-mono text-xs text-muted">1</span>
      <span className="absolute -bottom-6 right-0 font-mono text-xs text-muted">{MAX}</span>
    </div>
  );
}

function YouGuess() {
  const { best, submit } = useHighScore("number-guess");
  const [secret, setSecret] = useState(() => 1 + Math.floor(Math.random() * MAX));
  const [lo, setLo] = useState(1);
  const [hi, setHi] = useState(MAX);
  const [guess, setGuess] = useState("");
  const [tries, setTries] = useState<{ g: number; hint: string }[]>([]);
  const [won, setWon] = useState(false);

  const submitGuess = () => {
    const g = Number(guess);
    if (!Number.isInteger(g) || g < 1 || g > MAX || won) return;
    let hint = "";
    if (g === secret) {
      hint = "🎉 correct!";
      setWon(true);
      const score = Math.max(0, 11 - (tries.length + 1)) * 10;
      submit(score);
      if (tries.length + 1 <= 10) celebrate();
    } else if (g < secret) {
      hint = "higher ⬆";
      setLo(Math.max(lo, g + 1));
    } else {
      hint = "lower ⬇";
      setHi(Math.min(hi, g - 1));
    }
    setTries([...tries, { g, hint }]);
    setGuess("");
  };
  const reset = () => {
    setSecret(1 + Math.floor(Math.random() * MAX));
    setLo(1);
    setHi(MAX);
    setTries([]);
    setWon(false);
  };
  const mid = Math.floor((lo + hi) / 2);

  return (
    <div className="flex flex-col gap-5">
      <MascotSays mood={won ? "wow" : "wink"}>
        {won
          ? `You got it in ${tries.length} tries! ${tries.length <= 10 ? "Binary-search brain 🧠" : "Tip: always guess the middle of the green range."}`
          : `I'm thinking of a number from 1 to ${MAX}. A perfect binary search needs at most ⌈log₂ ${MAX}⌉ = 10 guesses.`}
      </MascotSays>
      <RangeBar lo={lo} hi={hi} mark={tries.at(-1)?.g} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          className="input w-36 text-lg"
          type="number"
          value={guess}
          min={1}
          max={MAX}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitGuess()}
          placeholder="your guess"
          disabled={won}
        />
        <button className="btn bg-sun" onClick={submitGuess} disabled={won}>
          Guess
        </button>
        {!won && (
          <button className="btn" onClick={() => setGuess(String(mid))}>
            💡 Middle is {mid}
          </button>
        )}
        <button className="btn" onClick={reset}>
          🔁 New number
        </button>
        <span className="ml-auto chip bg-white">🏆 best {best}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tries.map((t, i) => (
          <span key={i} className={`chip ${t.hint.includes("correct") ? "bg-mint" : "bg-white"} font-mono`}>
            #{i + 1}: {t.g} → {t.hint}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted">Green = numbers still possible ({hi - lo + 1} left). Each smart guess cuts it in half.</p>
    </div>
  );
}

function BotGuesses() {
  const [lo, setLo] = useState(1);
  const [hi, setHi] = useState(MAX);
  const [steps, setSteps] = useState(0);
  const [state, setState] = useState<"ready" | "asking" | "done" | "cheat">("ready");
  const mid = Math.floor((lo + hi) / 2);

  const answer = (a: "higher" | "lower" | "yes") => {
    setSteps((s) => s + 1);
    if (a === "yes") {
      setState("done");
      celebrate();
      return;
    }
    const nlo = a === "higher" ? mid + 1 : lo;
    const nhi = a === "lower" ? mid - 1 : hi;
    if (nlo > nhi) setState("cheat");
    setLo(nlo);
    setHi(nhi);
  };
  const reset = () => {
    setLo(1);
    setHi(MAX);
    setSteps(0);
    setState("ready");
  };

  return (
    <div className="flex flex-col gap-5">
      {state === "ready" && (
        <>
          <MascotSays mood="cool">Think of a number between 1 and {MAX}. Keep it secret. I bet I find it in 10 guesses or fewer!</MascotSays>
          <button className="btn self-start bg-sun" onClick={() => setState("asking")}>
            I&apos;ve got my number!
          </button>
        </>
      )}
      {state !== "ready" && (
        <>
          <MascotSays mood={state === "done" ? "cool" : state === "cheat" ? "sad" : "think"}>
            {state === "done"
              ? `Found it in ${steps} guesses! That's the power of O(log n).`
              : state === "cheat"
                ? "Hmm… the range is empty. Did you change your number? 🤨"
                : `Guess #${steps + 1}: is it ${mid}? (I'm searching ${lo}–${hi}, ${hi - lo + 1} numbers left)`}
          </MascotSays>
          <RangeBar lo={Math.min(lo, hi)} hi={Math.max(lo, hi)} mark={state === "asking" ? mid : undefined} />
          <div className="mt-4 flex flex-wrap gap-2">
            {state === "asking" && (
              <>
                <button className="btn bg-sky" onClick={() => answer("lower")}>
                  ⬇ Lower
                </button>
                <button className="btn bg-mint" onClick={() => answer("yes")}>
                  ✅ Yes, that&apos;s it!
                </button>
                <button className="btn bg-peach" onClick={() => answer("higher")}>
                  ⬆ Higher
                </button>
              </>
            )}
            <button className="btn" onClick={reset}>
              🔁 Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function NumberGuess() {
  const [mode, setMode] = useState<"you" | "bot">("you");
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex gap-2">
        <button className={`btn ${mode === "you" ? "bg-ink text-white" : ""}`} onClick={() => setMode("you")}>
          🙋 You guess
        </button>
        <button className={`btn ${mode === "bot" ? "bg-ink text-white" : ""}`} onClick={() => setMode("bot")}>
          🤖 Bot guesses
        </button>
      </div>
      <div className="card p-6">{mode === "you" ? <YouGuess /> : <BotGuesses />}</div>
    </div>
  );
}
