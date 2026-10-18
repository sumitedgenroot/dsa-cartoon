import Link from "next/link";
import type { Metadata } from "next";
import { PROBLEMS } from "@/labs";
import { getTopic } from "@/data/topics";
import { Difficulty, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Algo Lab" };

const BADGE: Record<string, string> = {
  "Brute Force": "bg-cherry-soft",
  Better: "bg-sky-soft",
  Optimal: "bg-mint",
  Greedy: "bg-sun",
  DP: "bg-grape",
  Recursion: "bg-peach-soft",
  Classic: "bg-sky",
};

export default function LabIndex() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={<>🧪 The Algo Lab</>}
        subtitle="Pick a problem, run every approach on the SAME input, watch each one step by step, then race them on growing inputs to measure the real time complexity."
        mood="wow"
        tone="sun"
      >
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="chip bg-white">🎬 step-by-step with code highlighting</span>
          <span className="chip bg-white">🏎️ side-by-side race</span>
          <span className="chip bg-white">📈 live Big-O detection</span>
          <span className="chip bg-white">✏️ your own inputs</span>
        </div>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p) => {
          const topic = getTopic(p.topic);
          return (
            <Link key={p.slug} href={`/lab/${p.slug}`} className="card card-hover flex flex-col gap-2 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{p.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{p.title}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <Difficulty level={p.level} />
                    {topic && <span className="text-xs text-muted">{topic.emoji} {topic.title}</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-ink-soft">{p.statement}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {p.approaches.map((a) => (
                  <span key={a.id} className={`rounded-md border-2 border-ink px-1.5 text-xs font-semibold ${BADGE[a.badge]}`}>
                    {a.name} <span className="font-mono">{a.time}</span>
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
