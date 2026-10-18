"use client";

import { useState } from "react";
import Link from "next/link";
import { DECISION, getPattern } from "@/data/patterns";
import { MascotSays } from "./Mascot";

export function DecisionWizard() {
  const [path, setPath] = useState<{ node: string; choice: string }[]>([]);
  const [node, setNode] = useState("start");
  const [result, setResult] = useState<string[] | null>(null);
  const cur = DECISION[node];

  const restart = () => {
    setPath([]);
    setNode("start");
    setResult(null);
  };

  return (
    <div className="card grid gap-6 bg-white p-5 sm:p-7 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-4">
        <MascotSays mood={result ? "cool" : "think"} size={70}>
          {result ? "Here's what I'd try first — and why." : cur.q}
        </MascotSays>
        {path.length > 0 && (
          <ol className="flex flex-col gap-1 border-l-[3px] border-dashed border-ink/30 pl-4 text-sm">
            {path.map((p, i) => (
              <li key={i}>
                <span className="text-muted">{DECISION[p.node].q}</span> → <b>{p.choice}</b>
              </li>
            ))}
          </ol>
        )}
        {path.length > 0 && (
          <button className="btn btn-sm self-start" onClick={restart}>
            🔁 Start over
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {!result &&
          cur.options.map((o) => (
            <button
              key={o.label}
              className="btn justify-start whitespace-normal py-3 text-left"
              onClick={() => {
                setPath([...path, { node, choice: o.label }]);
                if (o.result) setResult(o.result);
                else if (o.next) setNode(o.next);
              }}
            >
              <span className="text-muted">→</span> {o.label}
            </button>
          ))}
        {result &&
          result.map((id, i) => {
            const p = getPattern(id);
            return (
              <Link key={id} href={`/topics/${p.topic}`} className={`card-flat card-hover flex flex-col gap-1 p-4 ${i === 0 ? "bg-mint-soft" : "bg-white"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.emoji}</span>
                  <b className="text-lg">{p.name}</b>
                  {i === 0 && <span className="chip bg-mint text-xs">best bet</span>}
                  <span className="ml-auto chip bg-white font-mono text-xs">{p.typical}</span>
                </div>
                <p className="text-sm text-ink-soft">{p.when}</p>
                <span className="text-sm font-semibold">Learn it →</span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
