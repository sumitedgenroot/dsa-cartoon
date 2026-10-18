"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Dice5, Pause, Play, RotateCcw, SkipForward, Square, Zap } from "lucide-react";
import { getProblem, parseInput } from "@/labs";
import { Tracer } from "@/labs/tracer";
import type { Approach, Frame, Input, Problem } from "@/labs/types";
import { detectComplexity, fmt, humanTime, matchesClaim, type Point } from "@/labs/complexity";
import { DualCode } from "@/components/CodeBlock";
import { MascotSays } from "@/components/Mascot";
import { FrameView } from "./views";
import { ComplexityChart } from "./ComplexityChart";

const COLORS = ["#ff7a7a", "#8ecbff", "#8fe3a8", "#c3b1ff", "#ffb37a", "#ffd84d"];
const BADGE_CLS: Record<string, string> = {
  "Brute Force": "bg-cherry-soft",
  Better: "bg-sky-soft",
  Optimal: "bg-mint",
  Greedy: "bg-sun",
  DP: "bg-grape",
  Recursion: "bg-peach-soft",
  Classic: "bg-sky",
};

type Run = { id: string; frames: Frame[]; ops: number; result: string; truncated: boolean; error?: string };

function formatInput(p: Problem, input: Input): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of p.fields) {
    const v = input[f.key];
    out[f.key] =
      f.kind === "nums"
        ? (v as unknown[]).map((x) => (x === null ? "null" : String(x))).join(", ")
        : f.kind === "grid"
          ? (v as number[][]).map((r) => r.join("")).join("\n")
          : String(v);
  }
  return out;
}

function runAll(p: Problem, input: Input): Run[] {
  return p.approaches.map((a) => {
    const t = new Tracer(true, 700);
    try {
      const result = a.run(structuredClone(input), t);
      return { id: a.id, frames: t.frames, ops: t.ops, result, truncated: t.truncated };
    } catch (e) {
      return { id: a.id, frames: t.frames, ops: t.ops, result: "error", truncated: t.truncated, error: (e as Error).message };
    }
  });
}

const placeholder = (run: Run): Frame => ({ step: "", msg: `Result: ${run.result}`, ops: run.ops, mood: "happy" });

export function LabClient({ slug }: { slug: string }) {
  const p = getProblem(slug)!;
  const [raw, setRaw] = useState<Record<string, string>>(p.defaults);
  const [applied, setApplied] = useState<Record<string, string>>(p.defaults);
  const [tab, setTab] = useState<"step" | "race" | "growth">("step");
  const [ai, setAi] = useState(0);
  const parsed = useMemo(() => parseInput(p, applied), [p, applied]);
  const liveError = useMemo(() => parseInput(p, raw).error, [p, raw]);
  const runs = useMemo(() => (parsed.input ? runAll(p, parsed.input) : []), [p, parsed]);
  const n = useMemo(() => {
    if (!parsed.input) return 0;
    const first = parsed.input[p.fields[0].key];
    if (Array.isArray(first)) return p.fields[0].kind === "grid" ? first.length * (first[0]?.length ?? 0) : first.length;
    if (typeof first === "string") return first.length;
    return Number(first);
  }, [parsed, p]);

  const apply = () => {
    if (!liveError) setApplied(raw);
  };
  const randomize = () => {
    const small = p.slug === "islands" ? 30 : p.slug === "tree-traversal" ? 15 : p.slug === "lcs" ? 6 : 9;
    const next = formatInput(p, p.gen(small));
    setRaw(next);
    if (!parseInput(p, next).error) setApplied(next);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* input editor */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-3">
          {p.fields.map((f) => (
            <label key={f.key} className={`flex flex-col gap-1 ${f.kind === "num" ? "w-28" : "min-w-[220px] flex-1"}`}>
              <span className="text-sm font-semibold">
                {f.label} {f.hint && <span className="font-normal text-muted">({f.hint})</span>}
              </span>
              {f.kind === "grid" ? (
                <textarea
                  className="input min-h-[110px] leading-tight"
                  value={raw[f.key]}
                  onChange={(e) => setRaw({ ...raw, [f.key]: e.target.value })}
                />
              ) : (
                <input
                  className="input"
                  value={raw[f.key]}
                  onChange={(e) => setRaw({ ...raw, [f.key]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && apply()}
                />
              )}
            </label>
          ))}
          <div className="flex gap-2">
            <button className="btn bg-sun" onClick={apply} disabled={!!liveError}>
              <Play size={16} /> Run
            </button>
            <button className="btn" onClick={randomize} title="Random input">
              <Dice5 size={16} /> Random
            </button>
            <button
              className="btn"
              onClick={() => {
                setRaw(p.defaults);
                setApplied(p.defaults);
              }}
              title="Reset to example"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        {liveError && <p className="mt-2 text-sm font-semibold text-cherry">⚠ {liveError}</p>}
      </div>

      {/* tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "step", label: "🎬 Step-by-step", note: "watch one approach think" },
          { id: "race", label: "🏎️ Side-by-side", note: "same input, all approaches" },
          { id: "growth", label: "📈 Complexity race", note: "real Big-O, measured live" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`card-flat px-4 py-2 text-left transition ${tab === t.id ? "bg-ink text-white" : "bg-white hover:bg-sun-soft"}`}
          >
            <div className="font-bold">{t.label}</div>
            <div className={`text-xs ${tab === t.id ? "text-white/70" : "text-muted"}`}>{t.note}</div>
          </button>
        ))}
      </div>

      {runs.length > 0 && tab === "step" && (
        <StepView p={p} runs={runs} ai={ai} setAi={setAi} n={n} key={`${JSON.stringify(applied)}-${ai}`} />
      )}
      {runs.length > 0 && tab === "race" && <LockstepRace p={p} runs={runs} key={JSON.stringify(applied)} />}
      {tab === "growth" && <GrowthRace p={p} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function usePlayer(length: number, autoStart = false) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(4);
  useEffect(() => {
    if (!playing) return;
    const delay = Math.round(1400 / (speed * speed * 0.5 + 0.5));
    const id = setInterval(() => {
      setIdx((i) => {
        if (i >= length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, delay);
    return () => clearInterval(id);
  }, [playing, speed, length]);
  return { idx, setIdx, playing, setPlaying, speed, setSpeed };
}

function ApproachTabs({ p, runs, ai, setAi }: { p: Problem; runs: Run[]; ai: number; setAi: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.approaches.map((a, i) => (
        <button
          key={a.id}
          onClick={() => setAi(i)}
          className={`card-flat flex items-center gap-2 px-3 py-2 text-left transition ${i === ai ? "-translate-y-0.5 bg-sun shadow-[3px_3px_0_#1f1d2b]" : "bg-white hover:bg-sun-soft"}`}
        >
          <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink" style={{ background: COLORS[i % COLORS.length] }} />
          <span>
            <span className="block font-bold leading-tight">{a.name}</span>
            <span className="flex items-center gap-1.5 text-xs">
              <span className={`rounded border border-ink px-1 ${BADGE_CLS[a.badge]}`}>{a.badge}</span>
              <span className="font-mono">{a.time}</span>
              <span className="text-muted">· {fmt(runs[i].ops)} ops</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function OpsMeter({ ops, total, n, a }: { ops: number; total: number; n: number; a: Approach }) {
  const refs = [
    { label: "n", v: n },
    { label: "n log n", v: Math.round(n * Math.log2(Math.max(2, n))) },
    { label: "n²", v: n * n },
  ];
  const max = Math.max(total, ...refs.map((r) => r.v), 1);
  return (
    <div className="card-flat bg-white p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-muted">operations so far</span>
        <span className="font-mono text-2xl font-bold">
          {fmt(ops)} <span className="text-sm text-muted">/ {fmt(total)}</span>
        </span>
      </div>
      <div className="relative mt-2 h-4 rounded-full border-2 border-ink bg-line/40">
        <div className="h-full rounded-full bg-sun transition-all duration-150" style={{ width: `${(ops / max) * 100}%` }} />
        {refs.map((r) => {
          const pct = Math.min(100, (r.v / max) * 100);
          return (
            <div key={r.label} className="absolute -top-1 h-5 w-[2px] bg-ink" style={{ left: `${pct}%` }}>
              <span className={`absolute top-5 whitespace-nowrap font-mono text-[10px] text-muted ${pct > 75 ? "right-1" : "left-1"}`}>
                {r.label}={fmt(r.v)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 text-xs text-muted">
        n = {n}. Claimed <b className="font-mono text-ink">{a.time}</b> time, <b className="font-mono text-ink">{a.space}</b> extra space.
      </div>
    </div>
  );
}

function StepView({ p, runs, ai, setAi, n }: { p: Problem; runs: Run[]; ai: number; setAi: (i: number) => void; n: number }) {
  const a = p.approaches[ai];
  const run = runs[ai];
  const frames = run.frames.length ? run.frames : [placeholder(run)];
  const { idx, setIdx, playing, setPlaying, speed, setSpeed } = usePlayer(frames.length);
  const f = frames[Math.min(idx, frames.length - 1)];
  const atEnd = idx >= frames.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") setIdx((i) => Math.min(frames.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((x) => !x);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [frames.length, setIdx, setPlaying]);

  return (
    <div className="flex flex-col gap-4">
      <ApproachTabs p={p} runs={runs} ai={ai} setAi={setAi} />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="card flex min-w-0 flex-col gap-4 p-4 sm:p-5">
          <MascotSays mood={f.mood ?? "happy"} size={58}>
            {f.msg}
          </MascotSays>
          <div className="min-h-[160px]">
            <FrameView f={f} uid={`step-${a.id}`} />
          </div>
          {/* controls */}
          <div className="flex flex-wrap items-center gap-2 border-t-2 border-dashed border-line pt-4">
            <button className="btn btn-sm" onClick={() => { setIdx(0); setPlaying(false); }} aria-label="Restart">
              <RotateCcw size={15} />
            </button>
            <button className="btn btn-sm" onClick={() => setIdx(Math.max(0, idx - 1))} aria-label="Previous step">
              <ChevronLeft size={15} />
            </button>
            <button
              className="btn btn-sm bg-sun px-4"
              onClick={() => {
                if (atEnd) setIdx(0);
                setPlaying(!playing);
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? "Pause" : atEnd ? "Replay" : "Play"}
            </button>
            <button className="btn btn-sm" onClick={() => setIdx(Math.min(frames.length - 1, idx + 1))} aria-label="Next step">
              <ChevronRight size={15} />
            </button>
            <button className="btn btn-sm" onClick={() => { setIdx(frames.length - 1); setPlaying(false); }} aria-label="Jump to end">
              <SkipForward size={15} />
            </button>
            <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
              🐢
              <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-24 accent-[#1f1d2b]" />
              🐇
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={frames.length - 1}
              value={idx}
              onChange={(e) => {
                setIdx(Number(e.target.value));
                setPlaying(false);
              }}
              className="flex-1 accent-[#1f1d2b]"
              aria-label="Scrub through steps"
            />
            <span className="font-mono text-sm text-muted">
              step {idx + 1}/{frames.length}
            </span>
          </div>
          {run.truncated && (
            <p className="text-xs text-muted">
              The animation shows the first {frames.length} steps; the full run did {fmt(run.ops)} operations. Try a smaller input to see it all.
            </p>
          )}
          <p className="text-xs text-muted">Tip: ← → to step, space to play/pause.</p>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <DualCode java={a.java} cpp={a.cpp} title={a.name} activeStep={f.step} maxHeight={380} />
          <OpsMeter ops={f.ops} total={run.ops} n={n} a={a} />
          <div className="card-flat bg-sky-soft/60 p-3 text-[15px]">
            <div className="font-bold">💡 Idea</div>
            <p className="text-ink-soft">{a.idea}</p>
            <div className="mt-2 font-mono text-sm">
              result → <b>{run.result}</b>
              {run.error && <span className="text-cherry"> ({run.error})</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function frameAt(frames: Frame[], ops: number) {
  let lo = 0,
    hi = frames.length - 1,
    ans = 0;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (frames[m].ops <= ops) {
      ans = m;
      lo = m + 1;
    } else hi = m - 1;
  }
  return frames[ans];
}

function LockstepRace({ p, runs }: { p: Problem; runs: Run[] }) {
  const maxOps = Math.max(1, ...runs.map((r) => r.ops));
  const [clock, setClock] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const done = clock >= maxOps;

  useEffect(() => {
    if (!playing) return;
    const perTick = Math.max(maxOps / ((seconds * 1000) / 50), 0.25);
    const id = setInterval(() => {
      setClock((c) => {
        const next = c + perTick;
        if (next >= maxOps) {
          setPlaying(false);
          return maxOps;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [playing, seconds, maxOps]);

  const ranking = [...runs].sort((a, b) => a.ops - b.ops).map((r) => r.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <button
          className="btn bg-sun"
          onClick={() => {
            if (done) setClock(0);
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? "Pause" : done ? "Race again" : clock > 0 ? "Resume" : "Start race"}
        </button>
        <button className="btn" onClick={() => { setClock(0); setPlaying(false); }}>
          <RotateCcw size={16} /> Reset
        </button>
        <span className="font-hand text-lg">
          Every approach gets the same &quot;work clock&quot;: one tick = one operation. Less work → finishes first.
        </span>
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
          race length
          <select className="input w-auto py-1" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
            {[5, 10, 20, 40].map((s) => (
              <option key={s} value={s}>
                {s}s
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {p.approaches.map((a, i) => {
          const run = runs[i];
          const frames = run.frames.length ? run.frames : [placeholder(run)];
          const finished = clock >= run.ops;
          const f = finished ? frames[frames.length - 1] : frameAt(frames, clock);
          const shown = Math.min(clock, run.ops);
          const rank = ranking.indexOf(a.id);
          return (
            <div key={a.id} className={`card flex min-w-0 flex-col gap-3 p-4 ${finished ? "bg-mint-soft/50" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-ink" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="font-bold">{a.name}</span>
                <span className={`chip ${BADGE_CLS[a.badge]}`}>{a.time}</span>
                <span className="ml-auto text-2xl">{finished ? ["🥇", "🥈", "🥉", "🏅", "🏅"][rank] : "🏃"}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold">{fmt(shown)}</span>
                <span className="text-sm text-muted">ops {finished && `· result ${run.result}`}</span>
              </div>
              <div className="h-3 rounded-full border-2 border-ink bg-white">
                <div className="h-full rounded-full transition-all duration-75" style={{ width: `${(shown / maxOps) * 100}%`, background: COLORS[i % COLORS.length] }} />
              </div>
              <div className="min-h-[60px] overflow-hidden">
                <FrameView f={f} compact uid={`race-${a.id}`} />
              </div>
              <p className="font-hand text-[17px] leading-snug text-ink-soft">{f.msg}</p>
            </div>
          );
        })}
      </div>
      <div className="card-flat bg-sun-soft p-4">
        <b>📌 When to use which?</b> <span className="text-ink-soft">{p.takeaway}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type RaceStatus = "waiting" | "running" | "done" | "capped" | "slow";

function GrowthRace({ p }: { p: Problem }) {
  const [points, setPoints] = useState<Record<string, Point[]>>({});
  const [status, setStatus] = useState<Record<string, RaceStatus>>({});
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState<{ n: number; id: string } | null>(null);
  const [log, setLog] = useState(true);
  const [metric, setMetric] = useState<"ops" | "ms">("ops");
  const [exp, setExp] = useState(6);
  const cancel = useRef(false);

  useEffect(() => () => void (cancel.current = true), []);

  const start = useCallback(async () => {
    cancel.current = false;
    setRunning(true);
    const pts: Record<string, Point[]> = Object.fromEntries(p.approaches.map((a) => [a.id, []]));
    const st: Record<string, RaceStatus> = Object.fromEntries(p.approaches.map((a) => [a.id, "waiting" as RaceStatus]));
    setPoints({ ...pts });
    setStatus({ ...st });
    for (const n of p.sizes) {
      const input = p.gen(n);
      for (const a of p.approaches) {
        if (cancel.current) break;
        if (st[a.id] === "slow" || st[a.id] === "capped") continue;
        if (a.maxN && n > a.maxN) {
          st[a.id] = "capped";
          setStatus({ ...st });
          continue;
        }
        st[a.id] = "running";
        setStatus({ ...st });
        setCurrent({ n, id: a.id });
        await new Promise((r) => setTimeout(r, 25));
        const t = new Tracer(false);
        const copy = structuredClone(input);
        const t0 = performance.now();
        try {
          a.run(copy, t);
        } catch {
          st[a.id] = "slow";
        }
        const ms = performance.now() - t0;
        pts[a.id] = [...pts[a.id], { n, ops: t.ops, ms }];
        if (ms > 900) st[a.id] = "slow";
        else if (st[a.id] === "running") st[a.id] = "waiting";
        setPoints({ ...pts });
        setStatus({ ...st });
      }
      if (cancel.current) break;
    }
    for (const a of p.approaches) if (st[a.id] === "waiting" || st[a.id] === "running") st[a.id] = "done";
    setStatus({ ...st });
    setCurrent(null);
    setRunning(false);
  }, [p]);

  const series = p.approaches.map((a, i) => ({ id: a.id, name: a.name, color: COLORS[i % COLORS.length], points: points[a.id] ?? [] }));
  const detections = Object.fromEntries(p.approaches.map((a) => [a.id, detectComplexity(points[a.id] ?? [])]));
  const hasData = series.some((s) => s.points.length);
  const N = 10 ** exp;

  return (
    <div className="flex flex-col gap-4">
      <div className="card flex flex-wrap items-center gap-3 p-4">
        {!running ? (
          <button className="btn bg-sun" onClick={start}>
            <Zap size={16} /> {hasData ? "Run again" : "Start the complexity race"}
          </button>
        ) : (
          <button className="btn bg-cherry" onClick={() => (cancel.current = true)}>
            <Square size={16} /> Stop
          </button>
        )}
        <div className="flex rounded-xl border-2 border-ink p-0.5 text-sm">
          {(["ops", "ms"] as const).map((m) => (
            <button key={m} onClick={() => setMetric(m)} className={`rounded-[9px] px-2.5 py-1 font-semibold ${metric === m ? "bg-ink text-white" : ""}`}>
              {m === "ops" ? "operations" : "real time (ms)"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={log} onChange={(e) => setLog(e.target.checked)} className="h-4 w-4 accent-[#1f1d2b]" /> log scale
        </label>
        <span className="text-sm text-muted">
          {running && current
            ? `Running ${p.approaches.find((a) => a.id === current.id)?.name} on ${p.sizeLabel ?? "n"} = ${fmt(current.n)}…`
            : `Runs every approach on random inputs of growing size (${p.sizes.map(fmt).join(", ")}) and counts the work.`}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-4">
          {hasData ? (
            <ComplexityChart series={series} sizes={p.sizes} log={log} metric={metric} xLabel={p.sizeLabel ?? "n"} />
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <MascotSays mood="think" size={80}>
                Press <b>Start</b> and I&apos;ll feed bigger and bigger inputs to every approach, count every operation, and guess the Big-O from the numbers!
              </MascotSays>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-3">
            {series.map((s) => (
              <span key={s.id} className="flex items-center gap-1.5 text-sm font-semibold">
                <span className="h-3 w-6 rounded-full border-2 border-ink" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {p.approaches.map((a, i) => {
            const d = detections[a.id];
            const st = status[a.id];
            const ok = d && matchesClaim(a.time, d.label);
            return (
              <div key={a.id} className="card-flat p-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-ink" style={{ background: COLORS[i % COLORS.length] }} />
                  <b className="text-sm">{a.name}</b>
                  <span className="ml-auto text-xs text-muted">
                    {st === "running" ? "⏳ running" : st === "slow" ? "🐌 too slow — stopped" : st === "capped" ? "🛑 capped (exponential)" : st === "done" ? "✔ done" : ""}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="chip bg-white font-mono">claimed {a.time}</span>
                  {d ? (
                    <span className={`chip font-mono ${ok ? "bg-mint" : "bg-sun"}`}>
                      measured ≈ {d.label} {ok ? "✓" : "?"}
                    </span>
                  ) : (
                    <span className="chip bg-white text-muted">measuring…</span>
                  )}
                </div>
                {d && !ok && (
                  <p className="mt-1 text-xs text-muted">
                    Measured growth differs from the textbook worst case — usually because of the input shape (e.g. fixed alphabet, average case) or constant factors at small n.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hasData && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card overflow-x-auto p-4">
            <div className="mb-2 font-bold">📊 Raw measurements</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="py-1 pr-3">{p.sizeLabel ?? "n"}</th>
                  {p.approaches.map((a, i) => (
                    <th key={a.id} className="py-1 pr-3">
                      <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-ink" style={{ background: COLORS[i % COLORS.length] }} />
                      {a.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono">
                {p.sizes.map((n) => (
                  <tr key={n} className="border-t border-line">
                    <td className="py-1 pr-3 font-bold">{fmt(n)}</td>
                    {p.approaches.map((a) => {
                      const pt = points[a.id]?.find((x) => x.n === n);
                      return (
                        <td key={a.id} className="py-1 pr-3">
                          {pt ? (
                            <>
                              {fmt(pt.ops)} <span className="text-xs text-muted">{pt.ms < 0.1 ? "<0.1" : pt.ms.toFixed(1)}ms</span>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-4">
            <div className="mb-1 font-bold">🔮 What if {p.sizeLabel ?? "n"} were huge?</div>
            <p className="text-sm text-muted">Extrapolated from the measured curve, at ~10⁸ simple operations per second (typical online judge).</p>
            <label className="mt-3 flex items-center gap-3 font-semibold">
              {p.sizeLabel ?? "n"} = 10^{exp}
              <input type="range" min={2} max={9} value={exp} onChange={(e) => setExp(Number(e.target.value))} className="flex-1 accent-[#1f1d2b]" />
              <span className="font-mono">{fmt(N)}</span>
            </label>
            <div className="mt-3 flex flex-col gap-2">
              {p.approaches.map((a, i) => {
                const d = detections[a.id];
                if (!d) return null;
                const ops = d.coef * d.f(N);
                return (
                  <div key={a.id} className="flex items-center gap-2 rounded-xl border-2 border-ink px-3 py-1.5">
                    <span className="h-3 w-3 rounded-full border-2 border-ink" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm font-semibold">{a.name}</span>
                    <span className="ml-auto font-mono text-sm">{fmt(ops)} ops</span>
                    <span className="w-40 text-right text-sm font-bold">{humanTime(ops)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="card-flat bg-sun-soft p-4">
        <b>📌 When to use which?</b> <span className="text-ink-soft">{p.takeaway}</span>
      </div>
    </div>
  );
}
