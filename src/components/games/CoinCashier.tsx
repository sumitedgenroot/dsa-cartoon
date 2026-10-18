"use client";

import { useState } from "react";
import { useHighScore } from "@/lib/progress";
import { MascotSays } from "@/components/Mascot";
import { celebrate, EndScreen, ScoreBar, StartScreen } from "./kit";

const SETS = [
  [1, 2, 5, 10],
  [1, 3, 4],
  [1, 5, 6, 9],
  [1, 7, 10],
  [2, 5, 10, 20],
  [1, 4, 6, 9],
  [1, 5, 10, 25],
];

function dpMin(coins: number[], amount: number): { count: number; pick: number[] } {
  const INF = 1e9;
  const dp = new Array(amount + 1).fill(INF);
  const from = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++)
    for (const c of coins)
      if (c <= x && dp[x - c] + 1 < dp[x]) {
        dp[x] = dp[x - c] + 1;
        from[x] = c;
      }
  if (dp[amount] >= INF) return { count: -1, pick: [] };
  const pick: number[] = [];
  for (let x = amount; x > 0; x -= from[x]) pick.push(from[x]);
  return { count: dp[amount], pick: pick.sort((a, b) => b - a) };
}

function greedy(coins: number[], amount: number) {
  const pick: number[] = [];
  let left = amount;
  for (const c of [...coins].sort((a, b) => b - a))
    while (left >= c) {
      left -= c;
      pick.push(c);
    }
  return left === 0 ? pick : null;
}

function makeRound() {
  // prefer rounds where greedy fails, about half the time
  for (let tries = 0; tries < 200; tries++) {
    const coins = SETS[Math.floor(Math.random() * SETS.length)];
    const amount = 6 + Math.floor(Math.random() * 30);
    const opt = dpMin(coins, amount);
    if (opt.count < 0) continue;
    const g = greedy(coins, amount);
    const greedyFails = !g || g.length > opt.count;
    if (greedyFails || Math.random() < 0.35) return { coins, amount, opt, greedy: g };
  }
  return { coins: [1, 3, 4], amount: 6, opt: dpMin([1, 3, 4], 6), greedy: greedy([1, 3, 4], 6) };
}

export default function CoinCashier() {
  const { best, submit } = useHighScore("coin-change");
  const [phase, setPhase] = useState<"start" | "play" | "end">("start");
  const [round, setRound] = useState(makeRound);
  const [ri, setRi] = useState(0);
  const [hand, setHand] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const total = hand.reduce((a, b) => a + b, 0);

  const start = () => {
    setRound(makeRound());
    setRi(0);
    setHand([]);
    setChecked(false);
    setScore(0);
    setPerfect(0);
    setPhase("play");
  };
  const check = () => {
    setChecked(true);
    if (total === round.amount) {
      if (hand.length === round.opt.count) {
        setScore((s) => s + 30);
        setPerfect((p) => p + 1);
      } else setScore((s) => s + 10);
    }
  };
  const next = () => {
    if (ri + 1 >= 8) {
      submit(score);
      if (perfect >= 6) celebrate();
      setPhase("end");
      return;
    }
    setRi(ri + 1);
    setRound(makeRound());
    setHand([]);
    setChecked(false);
  };

  if (phase === "start")
    return (
      <StartScreen
        title="Coin Cashier 🪙"
        rules={[
          "A customer needs exact change. Use the FEWEST coins possible.",
          "Some coin systems are tricky — grabbing the biggest coin first doesn't always work!",
          "Fewest coins = 30 pts, correct total but more coins = 10 pts.",
          "8 customers per shift.",
        ]}
        onStart={start}
      />
    );
  if (phase === "end")
    return (
      <EndScreen title={perfect >= 6 ? "Cashier of the month! 🏆" : "Shift over!"} score={score} best={best} mood={perfect >= 6 ? "cool" : "happy"} onRestart={start}>
        <p className="text-ink-soft">
          {perfect}/8 perfect. Moral: greedy works for &quot;nice&quot; coin systems like 1-2-5-10, but DP (dp[x] = 1 + min dp[x − coin]) is always right.
        </p>
      </EndScreen>
    );

  const ok = checked && total === round.amount;
  const optimal = ok && hand.length === round.opt.count;
  const greedyWorse = !round.greedy || round.greedy.length > round.opt.count;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ScoreBar score={score} best={best} />
        <span className="font-mono text-sm text-muted">customer {ri + 1}/8</span>
      </div>
      <div className="card flex flex-col items-center gap-2 bg-sun-soft p-6 text-center">
        <span className="font-hand text-2xl">&quot;Change of {round.amount}, please!&quot; 🧑‍🦱</span>
        <div className="font-mono text-5xl font-bold">
          {total}
          <span className="text-2xl text-muted"> / {round.amount}</span>
        </div>
        <div className="flex min-h-12 flex-wrap justify-center gap-1.5">
          {hand.map((c, i) => (
            <button
              key={i}
              disabled={checked}
              onClick={() => setHand(hand.filter((_, j) => j !== i))}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-sun font-mono font-bold shadow-[2px_2px_0_#1f1d2b]"
              title="Remove"
            >
              {c}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted">{hand.length} coin(s) — tap a coin above to remove it</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {round.coins.map((c) => (
          <button
            key={c}
            disabled={checked || total + c > round.amount}
            onClick={() => setHand([...hand, c].sort((a, b) => b - a))}
            className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink bg-peach font-mono text-xl font-bold shadow-[3px_3px_0_#1f1d2b] transition hover:-translate-y-1 disabled:opacity-40"
          >
            {c}
          </button>
        ))}
      </div>
      {!checked ? (
        <button className="btn self-center bg-mint px-8" onClick={check} disabled={total !== round.amount}>
          💰 Hand over the change
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <MascotSays mood={optimal ? "cool" : "think"}>
            {optimal ? "Perfect — the fewest coins possible! " : `Works, but the minimum is ${round.opt.count} coin(s): ${round.opt.pick.join(" + ")}. `}
            {greedyWorse
              ? `Greedy (biggest first) would give ${round.greedy ? `${round.greedy.join(" + ")} = ${round.greedy.length} coins` : "no answer at all"} — that's why this needs DP!`
              : "Here greedy (biggest coin first) also finds the optimum."}
          </MascotSays>
          <button className="btn self-end bg-sun" onClick={next} autoFocus>
            Next customer →
          </button>
        </div>
      )}
    </div>
  );
}
