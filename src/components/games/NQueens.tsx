"use client";

import { useEffect, useRef, useState } from "react";
import { MascotSays } from "@/components/Mascot";
import { celebrate } from "./kit";

type Step = { board: number[]; row: number; col: number; kind: "try" | "place" | "back" | "done" };

function attacks(board: number[], r: number, c: number) {
  for (let i = 0; i < board.length; i++) {
    const q = board[i];
    if (q < 0 || i === r) continue;
    if (q === c || Math.abs(q - c) === Math.abs(i - r)) return true;
  }
  return false;
}

function solverSteps(n: number): Step[] {
  const steps: Step[] = [];
  const board = new Array(n).fill(-1);
  const go = (r: number): boolean => {
    if (r === n) {
      steps.push({ board: [...board], row: r, col: -1, kind: "done" });
      return true;
    }
    for (let c = 0; c < n; c++) {
      steps.push({ board: [...board], row: r, col: c, kind: "try" });
      if (attacks(board, r, c)) continue;
      board[r] = c;
      steps.push({ board: [...board], row: r, col: c, kind: "place" });
      if (go(r + 1)) return true;
      board[r] = -1;
      steps.push({ board: [...board], row: r, col: c, kind: "back" });
    }
    return false;
  };
  go(0);
  return steps;
}

export default function NQueens() {
  const [n, setN] = useState(6);
  const [board, setBoard] = useState<number[]>(() => new Array(6).fill(-1));
  const [step, setStep] = useState<Step | null>(null);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const placed = board.filter((x) => x >= 0).length;
  const conflicts = board.some((c, r) => c >= 0 && attacks(board, r, c));
  const solved = !step && placed === n && !conflicts;

  useEffect(() => {
    if (solved) celebrate();
  }, [solved]);
  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const reset = (k = n) => {
    if (timer.current) clearInterval(timer.current);
    setN(k);
    setBoard(new Array(k).fill(-1));
    setStep(null);
    setCount(0);
  };

  const toggle = (r: number, c: number) => {
    if (step) return;
    const b = [...board];
    b[r] = b[r] === c ? -1 : c;
    setBoard(b);
  };

  const watch = () => {
    reset();
    const steps = solverSteps(n);
    let i = 0;
    timer.current = setInterval(() => {
      const s = steps[i++];
      setStep(s);
      setBoard(s.board);
      setCount(i);
      if (i >= steps.length) {
        clearInterval(timer.current!);
        setTimeout(() => setStep(null), 600);
      }
    }, Math.max(40, 260 - n * 25));
  };

  const cell = Math.min(56, Math.floor(440 / n));
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">Board:</span>
        {[4, 5, 6, 7, 8].map((k) => (
          <button key={k} className={`btn btn-sm ${k === n ? "bg-ink text-white" : ""}`} onClick={() => reset(k)}>
            {k}×{k}
          </button>
        ))}
        <span className="chip ml-2 bg-sun">
          queens {placed}/{n}
        </span>
        <button className="btn btn-sm ml-auto bg-grape" onClick={watch}>
          🤖 Watch backtracking
        </button>
        <button className="btn btn-sm" onClick={() => reset()}>
          🔁 Clear
        </button>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-[auto_1fr]">
        <div className="card inline-grid p-2" style={{ gridTemplateColumns: `repeat(${n}, ${cell}px)` }}>
          {Array.from({ length: n }).flatMap((_, r) =>
            Array.from({ length: n }).map((__, c) => {
              const q = board[r] === c;
              const bad = q && attacks(board, r, c);
              const threatened = !q && board.some((qc, qr) => qc >= 0 && qr !== r && (qc === c || Math.abs(qc - c) === Math.abs(qr - r)));
              const isTry = step && step.row === r && step.col === c && step.kind === "try";
              const isBack = step && step.row === r && step.col === c && step.kind === "back";
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggle(r, c)}
                  className={`flex items-center justify-center border border-ink/20 text-2xl transition-colors ${
                    isTry ? "bg-sky" : isBack ? "bg-cherry" : bad ? "bg-cherry" : threatened && !step ? "bg-cherry-soft" : (r + c) % 2 ? "bg-peach-soft" : "bg-white"
                  }`}
                  style={{ width: cell, height: cell }}
                  aria-label={`row ${r + 1} column ${c + 1}`}
                >
                  {q ? "👑" : ""}
                </button>
              );
            }),
          )}
        </div>
        <div className="flex flex-col gap-3">
          <MascotSays mood={solved ? "cool" : conflicts ? "sad" : step ? "think" : "wink"}>
            {step
              ? step.kind === "try"
                ? `Row ${step.row + 1}: try column ${step.col + 1}…`
                : step.kind === "place"
                  ? `Safe! Place a queen in row ${step.row + 1} and move to the next row.`
                  : step.kind === "back"
                    ? `Dead end below → BACKTRACK: remove the queen from row ${step.row + 1} and try the next column.`
                    : "All rows filled — solution found! 🎉"
              : solved
                ? `You solved ${n}-Queens! 👑`
                : conflicts
                  ? "Two queens are attacking each other (red)."
                  : `Place ${n} queens so that no two share a row, column or diagonal. Pink squares are under attack.`}
          </MascotSays>
          {count > 0 && (
            <div className="card-flat bg-grape-soft p-3 text-sm">
              Backtracking steps so far: <b className="font-mono">{count}</b>. Brute force would check up to {n}
              <sup>{n}</sup> = {(n ** n).toLocaleString()} boards — backtracking prunes every branch the moment a conflict appears.
            </div>
          )}
          <div className="card-flat bg-white p-3 font-mono text-sm leading-relaxed">
            <div className="font-display font-bold">Backtracking template</div>
            for each column c in this row:
            <br />
            &nbsp;&nbsp;if safe(row, c):
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;place queen <span className="text-muted">{"// CHOOSE"}</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;solve(row + 1) <span className="text-muted">{"// EXPLORE"}</span>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;remove queen <span className="text-muted">{"// UN-CHOOSE"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
