"use client";

import { useEffect, useRef, useState } from "react";
import { MascotSays } from "@/components/Mascot";

const R = 15,
  C = 23;
const START: [number, number] = [1, 1];
const GOAL: [number, number] = [R - 2, C - 2];
const DIRS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

type Cell = 0 | 1; // 0 open, 1 wall
type Trace = { order: number[]; path: number[] };

const id = (r: number, c: number) => r * C + c;

function emptyGrid(): Cell[] {
  const g = new Array<Cell>(R * C).fill(0);
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) if (r === 0 || c === 0 || r === R - 1 || c === C - 1) g[id(r, c)] = 1;
  return g;
}

/** small seeded PRNG so the first maze is identical on server and client */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomMaze(rnd: () => number = Math.random): Cell[] {
  // recursive-backtracker maze, then knock out a few walls so multiple routes exist
  const g = new Array<Cell>(R * C).fill(1);
  const st: [number, number][] = [[1, 1]];
  g[id(1, 1)] = 0;
  while (st.length) {
    const [r, c] = st[st.length - 1];
    const nb = DIRS.map(([dr, dc]) => [r + dr * 2, c + dc * 2, dr, dc]).filter(
      ([nr, nc]) => nr > 0 && nc > 0 && nr < R - 1 && nc < C - 1 && g[id(nr, nc)] === 1,
    );
    if (!nb.length) {
      st.pop();
      continue;
    }
    const [nr, nc, dr, dc] = nb[Math.floor(rnd() * nb.length)];
    g[id(r + dr, c + dc)] = 0;
    g[id(nr, nc)] = 0;
    st.push([nr, nc]);
  }
  for (let k = 0; k < 28; k++) {
    const r = 1 + Math.floor(rnd() * (R - 2));
    const c = 1 + Math.floor(rnd() * (C - 2));
    g[id(r, c)] = 0;
  }
  g[id(...GOAL)] = 0;
  return g;
}

function search(g: Cell[], kind: "bfs" | "dfs"): Trace {
  const prev = new Array(R * C).fill(-1);
  const seen = new Array(R * C).fill(false);
  const order: number[] = [];
  const s = id(...START),
    t = id(...GOAL);
  const frontier = [s];
  seen[s] = true;
  while (frontier.length) {
    const cur = kind === "bfs" ? frontier.shift()! : frontier.pop()!;
    order.push(cur);
    if (cur === t) break;
    const r = Math.floor(cur / C),
      c = cur % C;
    const dirs = kind === "dfs" ? [...DIRS].reverse() : DIRS;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      const n = id(nr, nc);
      if (nr < 0 || nc < 0 || nr >= R || nc >= C || g[n] || seen[n]) continue;
      seen[n] = true;
      prev[n] = cur;
      frontier.push(n);
    }
  }
  const path: number[] = [];
  if (seen[t]) for (let x = t; x !== -1; x = prev[x]) path.push(x);
  return { order, path: path.reverse() };
}

function Board({ g, trace, tick, onPaint, label, color }: { g: Cell[]; trace: Trace | null; tick: number; onPaint?: (i: number, e: React.PointerEvent) => void; label: string; color: string }) {
  const visited = new Set(trace ? trace.order.slice(0, tick) : []);
  const done = trace && tick >= trace.order.length;
  const pathSet = new Set(done ? trace!.path : []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <b>{label}</b>
        {trace && (
          <span className="font-mono text-xs">
            explored {Math.min(tick, trace.order.length)} {done && `· path ${trace.path.length ? trace.path.length - 1 : "✗"}`}
          </span>
        )}
      </div>
      <div
        className="card-flat grid touch-none select-none overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${C}, minmax(0, 1fr))` }}
      >
        {g.map((cell, i) => {
          const isStart = i === id(...START),
            isGoal = i === id(...GOAL);
          return (
            <div
              key={i}
              onPointerDown={(e) => onPaint?.(i, e)}
              onPointerEnter={(e) => e.buttons === 1 && onPaint?.(i, e)}
              className="aspect-square text-center text-[10px] leading-none sm:text-xs"
              style={{
                background: cell ? "#1f1d2b" : pathSet.has(i) ? "#ffd84d" : visited.has(i) ? color : "#fff",
                transition: "background 120ms",
              }}
            >
              {isStart ? "🐭" : isGoal ? "🧀" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MazeRace() {
  const [g, setG] = useState<Cell[]>(() => randomMaze(seeded(7)));
  const [traces, setTraces] = useState<{ bfs: Trace; dfs: Trace } | null>(null);
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const paintMode = useRef<Cell>(1);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    setTraces(null);
    setTick(0);
  };

  const paint = (i: number, e: React.PointerEvent) => {
    if (i === id(...START) || i === id(...GOAL)) return;
    const r = Math.floor(i / C),
      c = i % C;
    if (r === 0 || c === 0 || r === R - 1 || c === C - 1) return;
    if (e.type === "pointerdown") paintMode.current = g[i] ? 0 : 1;
    stop();
    setG((old) => {
      const n = [...old];
      n[i] = paintMode.current;
      return n;
    });
  };

  const race = () => {
    stop();
    const t = { bfs: search(g, "bfs"), dfs: search(g, "dfs") };
    setTraces(t);
    const max = Math.max(t.bfs.order.length, t.dfs.order.length);
    let k = 0;
    timer.current = setInterval(() => {
      k += 2;
      setTick(k);
      if (k >= max + 2) clearInterval(timer.current!);
    }, 30);
  };

  const finished = traces && tick >= Math.max(traces.bfs.order.length, traces.dfs.order.length);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button className="btn bg-sun" onClick={race}>
          🏁 Race!
        </button>
        <button className="btn" onClick={() => { stop(); setG(randomMaze()); }}>
          🎲 Random maze
        </button>
        <button className="btn" onClick={() => { stop(); setG(emptyGrid()); }}>
          🧽 Empty room
        </button>
        <span className="self-center font-hand text-lg text-muted">Click / drag on the left board to draw or erase walls.</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Board g={g} trace={traces?.bfs ?? null} tick={tick} onPaint={paint} label="🌊 BFS (queue)" color="#8ecbff" />
        <Board g={g} trace={traces?.dfs ?? null} tick={tick} label="🕳️ DFS (stack)" color="#ff9ec4" />
      </div>
      <MascotSays mood={finished ? "cool" : "think"}>
        {finished && traces
          ? traces.bfs.path.length === 0
            ? "No path to the cheese! Both searches explored everything reachable."
            : `BFS path: ${traces.bfs.path.length - 1} steps (always the shortest!). DFS path: ${traces.dfs.path.length - 1} steps. BFS explores in ripples, DFS dives deep and may take a long detour.`
          : "BFS spreads like ripples in water, so the first time it reaches the cheese is the SHORTEST route. DFS charges down one corridor at a time. Hit Race to compare!"}
      </MascotSays>
    </div>
  );
}
