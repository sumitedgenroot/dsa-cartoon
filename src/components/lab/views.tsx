"use client";

import { motion } from "motion/react";
import type {
  ArrayState,
  BarsState,
  CellTone,
  Frame,
  GridState,
  ListState,
  MapState,
  StackState,
  TableState,
  TreeState,
} from "@/labs/types";

export const TONE_CLS: Record<CellTone, string> = {
  active: "bg-sun",
  compare: "bg-sky",
  found: "bg-mint",
  done: "bg-grape-soft",
  dim: "opacity-30",
  window: "bg-mint-soft",
  warn: "bg-cherry",
  sorted: "bg-grape",
  pivot: "bg-peach",
};

const TONE_HEX: Record<CellTone, string> = {
  active: "#ffd84d",
  compare: "#8ecbff",
  found: "#8fe3a8",
  done: "#ece6ff",
  dim: "#f3f2f7",
  window: "#dcf8e5",
  warn: "#ff7a7a",
  sorted: "#c3b1ff",
  pivot: "#ffb37a",
};

const POINTER_CLS = ["bg-bubble", "bg-sky", "bg-mint", "bg-grape", "bg-peach"];

export function ArrayView({ s, compact = false, uid }: { s: ArrayState; compact?: boolean; uid: string }) {
  const n = s.values.length;
  const size = compact ? 30 : n > 24 ? 30 : n > 14 ? 38 : 46;
  const ptrs = Object.entries(s.pointers ?? {});
  return (
    <div className="min-w-0">
      {s.label && <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">{s.label}</div>}
      <div className="code-scroll overflow-x-auto pb-1">
        <div className="flex w-max gap-1.5 px-0.5 pt-0.5">
          {s.values.map((v, i) => {
            const inWin = s.window && i >= s.window[0] && i <= s.window[1];
            const tone = s.tones?.[i];
            const here = ptrs.filter(([, idx]) => idx === i);
            return (
              <div key={i} className="flex flex-col items-center" style={{ width: size }}>
                {!compact && <span className="mb-0.5 font-mono text-[10px] text-muted">{i}</span>}
                <div
                  className={`flex items-center justify-center rounded-lg border-2 border-ink font-mono font-bold transition-all duration-200 ${
                    tone ? TONE_CLS[tone] : inWin ? "bg-mint-soft" : "bg-white"
                  } ${inWin ? "ring-2 ring-mint ring-offset-1" : ""} ${tone === "active" || tone === "found" ? "-translate-y-1 shadow-[2px_2px_0_#1f1d2b]" : ""}`}
                  style={{ width: size, height: size, fontSize: compact ? 11 : String(v).length > 3 ? 11 : 15 }}
                >
                  {String(v)}
                </div>
                {s.sub && <span className="mt-0.5 font-mono text-[10px] text-muted">{s.sub[i]}</span>}
                {!compact && (
                  <div className="mt-1 flex min-h-[22px] flex-col items-center gap-0.5">
                    {here.map(([name]) => (
                      <motion.div
                        key={name}
                        layoutId={`${uid}-ptr-${s.label ?? ""}-${name}`}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className={`flex flex-col items-center`}
                      >
                        <span className="text-xs leading-none">▲</span>
                        <span
                          className={`rounded-md border-2 border-ink px-1 font-mono text-[10px] font-bold leading-tight ${
                            POINTER_CLS[ptrs.findIndex(([p]) => p === name) % POINTER_CLS.length]
                          }`}
                        >
                          {name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MapView({ s }: { s: MapState }) {
  const hl = new Set(s.highlight ?? []);
  return (
    <div className="card-flat bg-sun-soft/50 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
        {s.kind === "set" ? "🧺" : "🗂️"} {s.title}
        <span className="ml-auto font-mono normal-case">size {s.entries.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {s.entries.length === 0 && <span className="font-hand text-muted">empty</span>}
        {s.entries.map(([k, v]) => (
          <motion.span
            key={k}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-1 rounded-lg border-2 border-ink px-2 py-0.5 font-mono text-sm ${
              hl.has(k) ? "bg-mint font-bold" : "bg-white"
            }`}
          >
            {k}
            {s.kind !== "set" && (
              <>
                <span className="text-muted">→</span>
                {v}
              </>
            )}
          </motion.span>
        ))}
        {s.miss !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-lg border-2 border-dashed border-cherry px-2 py-0.5 font-mono text-sm text-cherry">
            {s.miss}? ✗
          </span>
        )}
      </div>
    </div>
  );
}

export function StackView({ s }: { s: StackState }) {
  if (s.kind === "queue") {
    return (
      <div className="card-flat bg-sky-soft/60 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">🚶 {s.title}</div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-hand text-sm text-muted">front →</span>
          {s.items.length === 0 && <span className="font-hand text-muted">empty</span>}
          {s.items.map((x, i) => (
            <motion.span
              key={`${x}-${i}`}
              layout
              className={`rounded-lg border-2 border-ink px-2 py-0.5 font-mono text-sm ${i === 0 ? "bg-sun" : "bg-white"}`}
            >
              {x}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }
  const items = s.items.slice(-9);
  const hidden = s.items.length - items.length;
  return (
    <div className="card-flat bg-peach-soft/60 p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">🥞 {s.title}</div>
      <div className="flex flex-col-reverse items-center gap-1">
        <div className="h-1.5 w-28 rounded-full bg-ink" />
        {items.length === 0 && <span className="font-hand text-muted">empty</span>}
        {items.map((x, i) => {
          const realIdx = i + hidden;
          return (
            <motion.div
              key={`${realIdx}-${x}`}
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`w-28 rounded-lg border-2 border-ink py-0.5 text-center font-mono text-sm ${
                realIdx === s.highlight ? "bg-sun font-bold" : "bg-white"
              }`}
            >
              {x}
            </motion.div>
          );
        })}
        {hidden > 0 && <span className="text-xs text-muted">+{hidden} more below</span>}
      </div>
      {items.length > 0 && <div className="mt-1 text-center font-hand text-sm text-muted">top ↑</div>}
    </div>
  );
}

export function TableView({ s }: { s: TableState }) {
  const reads = new Set((s.reads ?? []).map(([r, c]) => `${r},${c}`));
  const many = (s.rows[0]?.length ?? 0) > 14;
  return (
    <div className="card-flat bg-grape-soft/40 p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">📋 {s.title}</div>
      <div className="code-scroll overflow-x-auto">
        <table className="border-separate border-spacing-1 font-mono text-sm">
          {s.colLabels && (
            <thead>
              <tr>
                {s.rowLabels && <th />}
                {s.colLabels.map((c, i) => (
                  <th key={i} className="px-1 text-[11px] font-semibold text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {s.rows.map((row, r) => (
              <tr key={r}>
                {s.rowLabels && <th className="pr-1 text-[11px] font-semibold text-muted">{s.rowLabels[r]}</th>}
                {row.map((v, c) => {
                  const active = s.active && s.active[0] === r && s.active[1] === c;
                  const read = reads.has(`${r},${c}`);
                  return (
                    <td
                      key={c}
                      className={`rounded-md border-2 text-center transition-colors ${many ? "h-7 min-w-7 text-xs" : "h-9 min-w-9"} ${
                        active
                          ? "border-ink bg-sun font-bold"
                          : read
                            ? "border-ink bg-sky"
                            : v === null || v === undefined
                              ? "border-line bg-white text-muted"
                              : "border-ink/40 bg-white"
                      }`}
                    >
                      {v === null || v === undefined ? "" : String(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(s.reads?.length ?? 0) > 0 && (
        <div className="mt-1 flex gap-3 text-xs text-muted">
          <span>
            <span className="mr-1 inline-block h-3 w-3 rounded border-2 border-ink bg-sun align-middle" />
            computing
          </span>
          <span>
            <span className="mr-1 inline-block h-3 w-3 rounded border-2 border-ink bg-sky align-middle" />
            reads from
          </span>
        </div>
      )}
    </div>
  );
}

const GRID_CLS = ["bg-sky-soft", "bg-peach", "bg-mint", "bg-grape-soft", "bg-sun"];
const GRID_EMOJI = ["", "🌴", "", "", "👣"];

export function GridView({ s, compact = false }: { s: GridState; compact?: boolean }) {
  const cols = s.cells[0]?.length ?? 0;
  const size = compact ? 18 : cols > 10 ? 30 : 40;
  return (
    <div>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}>
        {s.cells.flatMap((row, r) =>
          row.map((v, c) => (
            <div
              key={`${r}-${c}`}
              className={`flex items-center justify-center rounded-md border-2 border-ink font-mono text-xs font-bold transition-colors duration-200 ${GRID_CLS[v]}`}
              style={{ width: size, height: size }}
            >
              {compact ? "" : (s.labels?.[r]?.[c] ?? GRID_EMOJI[v])}
            </div>
          )),
        )}
      </div>
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
          {["water", "land", "visited", "waiting", "current"].map((l, i) => (
            <span key={l}>
              <span className={`mr-1 inline-block h-3 w-3 rounded border-2 border-ink align-middle ${GRID_CLS[i]}`} />
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function BarsView({ s, compact = false }: { s: BarsState; compact?: boolean }) {
  const max = Math.max(...s.values, 1);
  const h = compact ? 90 : 200;
  return (
    <div className="flex items-end gap-[3px]" style={{ height: h }}>
      {s.values.map((v, i) => {
        const tone = s.tones?.[i];
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end" style={{ height: h }}>
            {!compact && s.values.length <= 20 && <span className="font-mono text-[10px] text-muted">{v}</span>}
            <div
              className={`w-full rounded-t-md border-2 border-ink transition-all duration-150 ${tone ? TONE_CLS[tone] : "bg-white"}`}
              style={{ height: `${Math.max(4, (v / max) * (h - 16))}px` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function ListView({ s }: { s: ListState }) {
  const n = s.values.length;
  const gap = 84;
  const W = 40 + n * gap;
  const y = 70;
  const x = (i: number) => 40 + i * gap;
  const ptrByNode: Record<number, string[]> = {};
  const nullPtrs: string[] = [];
  for (const [name, idx] of Object.entries(s.pointers)) {
    if (idx === null) nullPtrs.push(name);
    else (ptrByNode[idx] ||= []).push(name);
  }
  return (
    <div className="code-scroll overflow-x-auto">
      <svg width={W + 40} height={170} className="block">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f1d2b" />
          </marker>
        </defs>
        {s.next.map((j, i) => {
          if (j === null) {
            return (
              <text key={`n${i}`} x={x(i)} y={y - 30} textAnchor="middle" className="fill-muted font-mono text-[10px]">
                → null
              </text>
            );
          }
          const forward = j > i;
          const x1 = x(i) + (forward ? 20 : -20);
          const x2 = x(j) + (forward ? -22 : 22);
          if (Math.abs(j - i) === 1)
            return (
              <path
                key={`e${i}`}
                d={forward ? `M ${x1} ${y - 4} L ${x2} ${y - 4}` : `M ${x1} ${y + 6} Q ${(x1 + x2) / 2} ${y + 26} ${x2} ${y + 6}`}
                stroke={forward ? "#1f1d2b" : "#e0457b"}
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#arrow)"
              />
            );
          const mid = (x1 + x2) / 2;
          return (
            <path
              key={`e${i}`}
              d={`M ${x1} ${y - 14} Q ${mid} ${y - 60} ${x2} ${y - 14}`}
              stroke="#e0457b"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrow)"
            />
          );
        })}
        {s.values.map((v, i) => {
          const tone = s.tones?.[i];
          return (
            <g key={i}>
              <rect
                x={x(i) - 20}
                y={y - 20}
                width={40}
                height={36}
                rx={10}
                fill={tone ? TONE_HEX[tone] : "#fff"}
                stroke="#1f1d2b"
                strokeWidth="2.5"
              />
              <text x={x(i)} y={y + 4} textAnchor="middle" className="font-mono text-sm font-bold" fill="#1f1d2b">
                {v}
              </text>
              {(ptrByNode[i] ?? []).map((p, k) => (
                <g key={p}>
                  <text x={x(i)} y={y + 44 + k * 18} textAnchor="middle" className="font-mono text-[11px] font-bold" fill="#e0457b">
                    ↑ {p}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
        {nullPtrs.length > 0 && (
          <text x={x(n) - 10} y={y + 4} className="font-mono text-[11px] font-bold" fill="#77738c">
            {nullPtrs.join(", ")} = null
          </text>
        )}
      </svg>
    </div>
  );
}

export function TreeView({ s, compact = false }: { s: TreeState; compact?: boolean }) {
  const vals = s.values;
  const depth = Math.max(1, Math.floor(Math.log2(Math.max(1, vals.length))) + 1);
  const W = compact ? 260 : Math.max(320, Math.min(720, 2 ** (depth - 1) * 52));
  const levelH = compact ? 40 : 62;
  const H = depth * levelH + 10;
  const r = compact ? 12 : 17;
  const pos = (i: number) => {
    const d = Math.floor(Math.log2(i + 1));
    const p = i - (2 ** d - 1);
    return { x: ((p + 0.5) / 2 ** d) * W, y: d * levelH + r + 6 };
  };
  return (
    <div>
      {s.title && <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">{s.title}</div>}
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full" style={{ maxWidth: W }}>
          {vals.map((v, i) => {
            if (v === null || i === 0) return null;
            const parent = (i - 1) >> 1;
            if (vals[parent] === null) return null;
            const a = pos(parent),
              b = pos(i);
            return <line key={`l${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1f1d2b" strokeWidth="2.5" />;
          })}
          {vals.map((v, i) => {
            if (v === null) return null;
            const p = pos(i);
            const tone = s.tones?.[i];
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={r} fill={tone ? TONE_HEX[tone] : "#fff"} stroke="#1f1d2b" strokeWidth="2.5" />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#1f1d2b" className={`font-mono font-bold ${compact ? "text-[10px]" : "text-[13px]"}`}>
                  {v}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {s.output && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">output</span>
          {s.output.length === 0 && <span className="font-hand text-muted">[]</span>}
          {s.output.map((v, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="rounded-md border-2 border-ink bg-mint px-1.5 font-mono text-sm"
            >
              {v}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export function VarsView({ vars }: { vars: Frame["vars"] }) {
  if (!vars) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(vars).map(([k, v]) => (
        <span key={k} className="rounded-lg border-2 border-ink bg-white px-2 py-0.5 font-mono text-xs">
          <span className="text-muted">{k} =</span> <b>{String(v)}</b>
        </span>
      ))}
    </div>
  );
}

/** Renders every structure present in a frame. */
export function FrameView({ f, compact = false, uid }: { f: Frame; compact?: boolean; uid: string }) {
  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {f.arrays?.slice(-1).map((a, i) => <ArrayView key={i} s={a} compact uid={uid} />)}
        {f.bars && <BarsView s={f.bars} compact />}
        {f.grid && <GridView s={f.grid} compact />}
        {f.tree && <TreeView s={{ ...f.tree, title: undefined }} compact />}
        {f.list && <ListView s={f.list} />}
        {!f.arrays && !f.bars && !f.grid && !f.tree && !f.list && f.table && <TableView s={f.table} />}
        {!f.arrays && !f.bars && !f.grid && !f.tree && !f.list && !f.table && <VarsView vars={f.vars} />}
      </div>
    );
  }
  const side = (f.maps?.length ?? 0) + (f.stacks?.length ?? 0) > 0;
  return (
    <div className="flex flex-col gap-4">
      {f.arrays?.map((a, i) => <ArrayView key={i} s={a} uid={uid} />)}
      {f.bars && <BarsView s={f.bars} />}
      {f.list && <ListView s={f.list} />}
      <div className={`grid gap-4 ${side && (f.tree || f.grid || f.table) ? "md:grid-cols-[1fr_auto]" : ""}`}>
        {(f.tree || f.grid || f.table) && (
          <div className="flex min-w-0 flex-col gap-4">
            {f.tree && <TreeView s={f.tree} />}
            {f.grid && <GridView s={f.grid} />}
            {f.table && <TableView s={f.table} />}
          </div>
        )}
        {side && (
          <div className={`flex flex-col gap-3 ${f.tree || f.grid || f.table ? "md:w-56" : ""}`}>
            {f.maps?.map((m, i) => <MapView key={i} s={m} />)}
            {f.stacks?.map((m, i) => <StackView key={i} s={m} />)}
          </div>
        )}
      </div>
      <VarsView vars={f.vars} />
    </div>
  );
}
