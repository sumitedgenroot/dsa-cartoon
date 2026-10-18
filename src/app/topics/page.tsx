import Link from "next/link";
import type { Metadata } from "next";
import { ROADMAP, TIER_INFO, TOPICS, getTopic } from "@/data/topics";
import { PageHeader, SOFT } from "@/components/ui";
import { DoneDot, ProgressBar } from "@/components/DoneButton";

export const metadata: Metadata = { title: "All Topics" };

export default function TopicsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={<>All {TOPICS.length} DSA topics, one cartoon at a time</>}
        subtitle="Every topic has a real-life analogy, the thought process, when-to-use signals, and interview-ready code in Java and C++."
        mood="cool"
        tone="sky"
      >
        <div className="max-w-md">
          <ProgressBar ids={TOPICS.map((t) => t.slug)} />
        </div>
      </PageHeader>

      {ROADMAP.map((w) => (
        <section key={w.week}>
          <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-bold">
            <span className="scribble-underline">{w.week}</span>
            <span className="font-hand text-xl text-muted">{w.focus}</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {w.slugs.map((s) => {
              const t = getTopic(s)!;
              return (
                <Link key={t.slug} href={`/topics/${t.slug}`} className={`card card-hover relative ${SOFT[t.tone]} p-5`}>
                  <DoneDot id={t.slug} />
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{t.emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted">#{t.num}</span>
                        <span className={`chip ${TIER_INFO[t.tier].cls} text-[10px]`}>{TIER_INFO[t.tier].label}</span>
                      </div>
                      <h3 className="text-lg font-bold leading-snug">{t.title}</h3>
                    </div>
                  </div>
                  <p className="mt-2 text-[15px] text-ink-soft">{t.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {t.signals.slice(0, 4).map((s) => (
                      <span key={s} className="rounded-md border border-ink/30 bg-white/70 px-1.5 font-mono text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
