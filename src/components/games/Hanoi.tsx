"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MascotSays } from "@/components/Mascot";
import { DualCode } from "@/components/CodeBlock";
import { celebrate } from "./kit";

const COLORS = ["#ff7a7a", "#ffb37a", "#ffd84d", "#8fe3a8", "#8ecbff", "#c3b1ff", "#ff9ec4"];

const JAVA = `void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;                    // base case
    hanoi(n - 1, from, via, to);           // move n-1 out of the way
    System.out.println(from + " -> " + to); // move the biggest disk
    hanoi(n - 1, via, to, from);           // put n-1 back on top
}
// moves = 2^n - 1   ->   O(2^n)`;
const CPP = `void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;                    // base case
    hanoi(n - 1, from, via, to);           // move n-1 out of the way
    cout << from << " -> " << to << "\\n";  // move the biggest disk
    hanoi(n - 1, via, to, from);           // put n-1 back on top
}
// moves = 2^n - 1   ->   O(2^n)`;

function solve(n: number, from: number, to: number, via: number, out: [number, number][]) {
  if (n === 0) return;
  solve(n - 1, from, via, to, out);
  out.push([from, to]);
  solve(n - 1, via, to, from, out);
}

export default function Hanoi() {
  const [n, setN] = useState(4);
  const [pegs, setPegs] = useState<number[][]>(() => [Array.from({ length: 4 }, (_, i) => 4 - i), [], []]);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [auto, setAuto] = useState(false);
  const [warn, setWarn] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const optimal = 2 ** n - 1;
  const won = pegs[2].length === n;

  const reset = (k = n) => {
    if (timer.current) clearInterval(timer.current);
    setAuto(false);
    setN(k);
    setPegs([Array.from({ length: k }, (_, i) => k - i), [], []]);
    setHeld(null);
    setMoves(0);
    setWarn("");
  };

  useEffect(() => {
    if (won && !auto && moves > 0) celebrate();
  }, [won, auto, moves]);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const click = (p: number) => {
    if (auto || won) return;
    setWarn("");
    if (held === null) {
      if (pegs[p].length) setHeld(p);
      return;
    }
    if (held === p) {
      setHeld(null);
      return;
    }
    const disk = pegs[held][pegs[held].length - 1];
    const top = pegs[p][pegs[p].length - 1];
    if (top !== undefined && top < disk) {
      setWarn("A bigger disk can't sit on a smaller one!");
      setHeld(null);
      return;
    }
    const next = pegs.map((x) => [...x]);
    next[held].pop();
    next[p].push(disk);
    setPegs(next);
    setMoves((m) => m + 1);
    setHeld(null);
  };

  const autoSolve = () => {
    reset();
    const plan: [number, number][] = [];
    solve(n, 0, 2, 1, plan);
    setAuto(true);
    let i = 0;
    const local = [Array.from({ length: n }, (_, k) => n - k), [], []] as number[][];
    timer.current = setInterval(
      () => {
        if (i >= plan.length) {
          clearInterval(timer.current!);
          setAuto(false);
          return;
        }
        const [a, b] = plan[i++];
        local[b].push(local[a].pop()!);
        setPegs(local.map((x) => [...x]));
        setMoves(i);
      },
      Math.max(80, 700 - n * 80),
    );
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">Disks:</span>
        {[3, 4, 5, 6, 7].map((k) => (
          <button key={k} className={`btn btn-sm ${k === n ? "bg-ink text-white" : ""}`} onClick={() => reset(k)}>
            {k}
          </button>
        ))}
        <span className="chip ml-2 bg-sun">moves {moves}</span>
        <span className="chip bg-white">minimum 2ⁿ−1 = {optimal}</span>
        <button className="btn btn-sm ml-auto bg-grape" onClick={autoSolve} disabled={auto}>
          🤖 Watch recursion solve it
        </button>
        <button className="btn btn-sm" onClick={() => reset()}>
          🔁 Reset
        </button>
      </div>
      <div className="card grid grid-cols-3 gap-2 bg-white p-4">
        {pegs.map((peg, p) => (
          <button
            key={p}
            onClick={() => click(p)}
            className={`relative flex h-64 flex-col-reverse items-center rounded-xl border-2 pb-2 transition ${held === p ? "border-ink bg-sun-soft" : "border-transparent hover:bg-sun-soft/50"}`}
            aria-label={`Peg ${"ABC"[p]}`}
          >
            <div className="absolute bottom-2 h-3 w-[90%] rounded-full border-2 border-ink bg-peach" />
            <div className="absolute bottom-4 h-52 w-3 rounded-t-full border-2 border-ink bg-peach" />
            <div className="relative z-10 mb-3 flex w-full flex-col-reverse items-center gap-0.5">
              {peg.map((d, i) => (
                <motion.div
                  layout
                  layoutId={`disk-${d}`}
                  key={d}
                  className={`h-6 rounded-full border-2 border-ink ${held === p && i === peg.length - 1 ? "-translate-y-3" : ""}`}
                  style={{ width: `${18 + d * 11}%`, background: COLORS[(d - 1) % COLORS.length] }}
                />
              ))}
            </div>
            <span className="absolute -bottom-6 font-bold">{"ABC"[p]}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <MascotSays mood={won ? (moves === optimal ? "cool" : "happy") : warn ? "sad" : "think"}>
          {won
            ? moves === optimal
              ? `Perfect! ${moves} moves = 2^${n} − 1. That's exactly what the recursion does.`
              : `Solved in ${moves} moves. The minimum is ${optimal} — try again with the recursive idea!`
            : warn ||
              "Move all disks from A to C. Click a peg to lift its top disk, click another to drop it. Secret: to move n disks, first move n−1 out of the way…"}
        </MascotSays>
        <DualCode java={JAVA} cpp={CPP} title="Recursive solution" />
      </div>
    </div>
  );
}
