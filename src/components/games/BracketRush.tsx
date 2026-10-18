"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHighScore } from "@/lib/progress";
import { MascotSays } from "@/components/Mascot";
import { celebrate, EndScreen, ScoreBar, StartScreen, TimerBar } from "./kit";

const OPEN = "([{";
const CLOSE_OF: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
const OPEN_OF: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

function makeString(len: number, valid: boolean): string {
  const st: string[] = [];
  let s = "";
  while (s.length < len) {
    const canClose = st.length > 0;
    const mustClose = st.length >= len - s.length;
    if (mustClose || (canClose && Math.random() < 0.45)) s += CLOSE_OF[st.pop()!];
    else {
      const c = OPEN[Math.floor(Math.random() * 3)];
      st.push(c);
      s += c;
    }
  }
  if (valid) return s;
  // break it: swap one closer for a wrong type, or drop a closer at the end
  const arr = [...s];
  const closers = arr.map((c, i) => (OPEN.includes(c) ? -1 : i)).filter((i) => i >= 0);
  if (Math.random() < 0.5 && closers.length) {
    const i = closers[Math.floor(Math.random() * closers.length)];
    const wrong = [")", "]", "}"].filter((x) => x !== arr[i]);
    arr[i] = wrong[Math.floor(Math.random() * 2)];
    return arr.join("");
  }
  return arr.slice(0, -1).join("") + OPEN[Math.floor(Math.random() * 3)];
}

type Action = "push" | "pop" | "invalid";

export default function BracketRush() {
  const { best, submit } = useHighScore("bracket-rush");
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [level, setLevel] = useState(1);
  const [s, setS] = useState("");
  const [pos, setPos] = useState(0);
  const [stack, setStack] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [msg, setMsg] = useState<{ text: string; good: boolean } | null>(null);
  const [left, setLeft] = useState(5);
  const timePer = Math.max(1.6, 5 - level * 0.4);

  const newLevel = useCallback((lv: number) => {
    setS(makeString(Math.min(6 + lv * 2, 20), Math.random() < 0.6));
    setPos(0);
    setStack([]);
    setLeft(Math.max(1.6, 5 - lv * 0.4));
  }, []);

  const start = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setMsg(null);
    newLevel(1);
    setPhase("play");
  };

  // what the correct action is at the current character
  const atEnd = pos >= s.length;
  const c = s[pos];
  const expected: Action | "valid" = atEnd
    ? stack.length === 0
      ? "valid"
      : "invalid"
    : OPEN.includes(c)
      ? "push"
      : stack.length && stack[stack.length - 1] === OPEN_OF[c]
        ? "pop"
        : "invalid";

  const fail = useCallback(
    (text: string) => {
      setMsg({ text, good: false });
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) {
          submit(score);
          setPhase("end");
        }
        return nl;
      });
      newLevel(level);
    },
    [newLevel, score, submit, level],
  );

  const act = useCallback(
    (a: Action | "valid") => {
      if (phase !== "play") return;
      if (a !== expected) {
        const why =
          expected === "push"
            ? `'${c}' is an opener — it should be pushed.`
            : expected === "pop"
              ? `'${c}' matches the top '${stack[stack.length - 1]}' — pop it!`
              : expected === "valid"
                ? "The stack is empty at the end — the string was valid."
                : atEnd
                  ? `Leftover openers ${stack.join("")} — invalid!`
                  : stack.length
                    ? `'${c}' can't close '${stack[stack.length - 1]}' — invalid!`
                    : `'${c}' has nothing to close — invalid!`;
        fail(why);
        return;
      }
      if (a === "push") {
        setStack((st) => [...st, c]);
        setPos((p) => p + 1);
        setScore((x) => x + 5);
      } else if (a === "pop") {
        setStack((st) => st.slice(0, -1));
        setPos((p) => p + 1);
        setScore((x) => x + 5);
      } else {
        // correct verdict
        setScore((x) => x + 20 + level * 5);
        setMsg({ text: a === "valid" ? "Balanced! ✔" : "Nice catch — invalid! 🕵️", good: true });
        const nl = level + 1;
        setLevel(nl);
        if (nl % 3 === 0) celebrate();
        newLevel(nl);
        return;
      }
      setLeft(timePer);
    },
    [phase, expected, c, stack, atEnd, fail, level, newLevel, timePer],
  );

  useEffect(() => {
    if (phase !== "play") return;
    const id = setTimeout(() => {
      if (left <= 0.1) fail("Too slow! ⏰");
      else setLeft((l) => +(l - 0.1).toFixed(1));
    }, 100);
    return () => clearTimeout(id);
  }, [left, phase, fail]);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "u") act("push");
      if (e.key === "ArrowDown" || e.key === "p") act("pop");
      if (e.key === "x") act("invalid");
      if (e.key === "v" || e.key === "Enter") act("valid");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, act]);

  if (phase === "start")
    return (
      <StartScreen
        title="Bracket Rush 🥞"
        rules={[
          "Brackets arrive one by one. You are the stack!",
          "Opener ( [ { → PUSH it.  Closer that matches the top → POP.",
          "Closer that doesn't match (or empty stack) → INVALID!",
          "At the end: empty stack → VALID, leftovers → INVALID.",
          "Keys: ↑ push · ↓ pop · X invalid · V valid",
        ]}
        onStart={start}
      />
    );
  if (phase === "end")
    return (
      <EndScreen title="Stack overflow! 😵" score={score} best={best} mood="sad" onRestart={start}>
        <p className="text-ink-soft">You reached level {level}. Valid Parentheses is literally this game, in code.</p>
      </EndScreen>
    );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ScoreBar score={score} best={best} lives={lives} extra={<span className="chip bg-grape-soft text-sm">level {level}</span>} />
      </div>
      <TimerBar left={left} total={timePer} />
      <div className="card flex flex-wrap items-center justify-center gap-1.5 p-5">
        {[...s].map((ch, i) => (
          <span
            key={i}
            className={`flex h-11 w-9 items-center justify-center rounded-lg border-2 border-ink font-mono text-xl font-bold transition ${
              i < pos ? "bg-line/50 text-muted" : i === pos ? "-translate-y-1 scale-110 bg-sun shadow-[2px_2px_0_#1f1d2b]" : "bg-white"
            }`}
          >
            {ch}
          </span>
        ))}
        <span className={`ml-2 rounded-lg border-2 border-dashed border-ink px-2 py-2 font-hand text-lg ${atEnd ? "bg-sun" : ""}`}>END</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="btn bg-sky py-4 text-lg" onClick={() => act("push")} disabled={atEnd}>
              ⬆ PUSH
            </button>
            <button className="btn bg-mint py-4 text-lg" onClick={() => act("pop")} disabled={atEnd}>
              ⬇ POP
            </button>
            <button className="btn bg-cherry py-4 text-lg" onClick={() => act("invalid")}>
              ✗ INVALID
            </button>
            <button className="btn bg-sun py-4 text-lg" onClick={() => act("valid")} disabled={!atEnd}>
              ✔ VALID
            </button>
          </div>
          {msg && <MascotSays mood={msg.good ? "happy" : "sad"}>{msg.text}</MascotSays>}
        </div>
        <div className="card-flat flex min-h-[220px] flex-col-reverse items-center gap-1 bg-peach-soft p-3">
          <div className="h-2 w-28 rounded-full bg-ink" />
          <AnimatePresence>
            {stack.map((ch, i) => (
              <motion.div
                key={`${i}-${ch}`}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                className={`w-24 rounded-xl border-2 border-ink py-1 text-center font-mono text-lg font-bold ${i === stack.length - 1 ? "bg-sun" : "bg-white"}`}
              >
                {ch}
              </motion.div>
            ))}
          </AnimatePresence>
          <span className="mb-auto font-hand text-muted">your stack 🥞</span>
        </div>
      </div>
    </div>
  );
}
