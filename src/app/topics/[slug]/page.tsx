import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/PageSkeleton";
import { TIER_INFO, TOPICS, getTopic } from "@/data/topics";
import { lcUrl } from "@/data/types";
import { getProblem } from "@/labs";
import { GAMES } from "@/data/games";
import { Callout, ComplexityBadge, Difficulty, SOFT, SectionTitle } from "@/components/ui";
import { MascotSays } from "@/components/Mascot";
import { Mascot } from "@/components/Mascot";
import { DualCode } from "@/components/CodeBlock";
import { DoneButton } from "@/components/DoneButton";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopic(slug);
  return { title: t ? t.title : "Topic", description: t?.tagline };
}

const NAV = [
  { id: "story", label: "🎨 Story" },
  { id: "concept", label: "📖 Concept" },
  { id: "when", label: "🧭 When to use" },
  { id: "think", label: "🧠 Thought process" },
  { id: "code", label: "💻 Code" },
  { id: "gotchas", label: "⚠️ Gotchas" },
  { id: "practice", label: "🏋️ Practice" },
];

export default function TopicPage(props: PageProps<"/topics/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TopicContent params={props.params} />
    </Suspense>
  );
}

async function TopicContent({ params }: { params: PageProps<"/topics/[slug]">["params"] }) {
  const { slug } = await params;
  const t = getTopic(slug);
  if (!t) notFound();
  const idx = TOPICS.findIndex((x) => x.slug === t.slug);
  const prev = TOPICS[idx - 1];
  const next = TOPICS[idx + 1];
  const labs = (t.labs ?? []).map((s) => getProblem(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const games = GAMES.filter((g) => (t.games ?? []).includes(g.slug));

  return (
    <div className="flex flex-col gap-8">
      <section className={`card relative overflow-hidden ${SOFT[t.tone]} px-6 py-7 sm:px-10`}>
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/topics" className="chip bg-white hover:bg-sun-soft">
                ← all topics
              </Link>
              <span className="chip bg-white font-mono">topic #{t.num}</span>
              <span className={`chip ${TIER_INFO[t.tier].cls}`}>
                {TIER_INFO[t.tier].label} · {TIER_INFO[t.tier].note}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              <span className="mr-2">{t.emoji}</span>
              {t.title}
            </h1>
            <p className="mt-2 font-hand text-2xl text-ink-soft">{t.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DoneButton id={t.slug} />
              {labs[0] && (
                <Link href={`/lab/${labs[0].slug}`} className="btn bg-sun">
                  🧪 Play with it in the Lab
                </Link>
              )}
            </div>
          </div>
          <div className="relative shrink-0">
            <Mascot mood="happy" size={120} className="animate-float" />
            <span className="absolute -right-2 -top-2 text-4xl">{t.emoji}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded-lg border-2 border-transparent px-3 py-1.5 font-semibold hover:border-ink hover:bg-sun-soft">
                {n.label}
              </a>
            ))}
            {labs.length > 0 && (
              <a href="#lab" className="rounded-lg border-2 border-transparent px-3 py-1.5 font-semibold hover:border-ink hover:bg-sun-soft">
                🧪 Lab & games
              </a>
            )}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-10">
          <section id="story" className="scroll-mt-24">
            <SectionTitle emoji="🎨">The cartoon version</SectionTitle>
            <MascotSays mood="wink" size={76}>
              {t.analogy}
            </MascotSays>
          </section>

          <section id="concept" className="scroll-mt-24">
            <SectionTitle emoji="📖">Concept</SectionTitle>
            <p className="text-lg leading-relaxed text-ink-soft">{t.concept}</p>
            {t.template && (
              <div className="card-flat mt-4 bg-white p-4">
                <div className="mb-2 font-bold">🧩 Template / cheat-lines</div>
                <ol className="flex flex-col gap-1.5">
                  {t.template.map((s, i) => (
                    <li key={i} className="flex gap-2 font-mono text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun text-xs font-bold">{i + 1}</span>
                      <span className="pt-0.5">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {t.ops && (
              <div className="card-flat mt-4 overflow-x-auto bg-white">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="border-b-2 border-ink bg-sky-soft text-left">
                    <tr>
                      <th className="px-3 py-2">Operation</th>
                      <th className="px-3 py-2">☕ Java</th>
                      <th className="px-3 py-2">⚡ C++</th>
                      <th className="px-3 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.ops.map((o) => (
                      <tr key={o.op} className="border-t border-line">
                        <td className="px-3 py-2 font-semibold">{o.op}</td>
                        <td className="px-3 py-2 font-mono text-[13px]">{o.java}</td>
                        <td className="px-3 py-2 font-mono text-[13px]">{o.cpp}</td>
                        <td className="px-3 py-2 font-mono text-[13px] font-bold">{o.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section id="when" className="scroll-mt-24">
            <SectionTitle emoji="🧭">When should I use it?</SectionTitle>
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <ul className="flex flex-col gap-2">
                {t.whenToUse.map((w) => (
                  <li key={w} className="card-flat flex gap-2 bg-white px-3 py-2">
                    <span>✅</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <Callout tone="bubble" icon="🔔" title="Words that should ring the bell">
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {t.signals.map((s) => (
                    <span key={s} className="rounded-lg border-2 border-ink bg-white px-2 py-0.5 font-mono text-[13px] text-ink">
                      &quot;{s}&quot;
                    </span>
                  ))}
                </div>
              </Callout>
            </div>
          </section>

          <section id="think" className="scroll-mt-24">
            <SectionTitle emoji="🧠">Thought process</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <Callout tone="sun" icon="💭" title="What should run in your head">
                {t.thought}
              </Callout>
              <Callout tone="mint" icon="🇮🇳" title="Desi dost ki tip (Hinglish)">
                <span className="font-hand text-xl leading-snug text-ink">{t.desi}</span>
              </Callout>
            </div>
          </section>

          <section id="code" className="scroll-mt-24">
            <SectionTitle emoji="💻">Code — Java & C++</SectionTitle>
            <p className="-mt-2 mb-4 text-sm text-muted">Switch language with the toggle in the header or on any code block. Your choice is remembered.</p>
            <div className="flex flex-col gap-6">
              {t.examples.map((ex) => (
                <div key={ex.title} className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold">{ex.title}</h3>
                    <ComplexityBadge label="time" value={ex.time} />
                    <ComplexityBadge label="space" value={ex.space} />
                  </div>
                  {ex.logic && <p className="text-ink-soft">🧩 {ex.logic}</p>}
                  <DualCode java={ex.java} cpp={ex.cpp} title={ex.title} />
                </div>
              ))}
            </div>
          </section>

          <section id="gotchas" className="scroll-mt-24">
            <SectionTitle emoji="⚠️">Gotchas</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              {t.gotchas.map((g) => (
                <div key={g} className="card-flat flex gap-2 bg-cherry-soft px-4 py-3">
                  <span>🙈</span>
                  <span className="text-ink-soft">{g}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="practice" className="scroll-mt-24">
            <SectionTitle emoji="🏋️">Practice on LeetCode</SectionTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              {t.practice.map((p) => (
                <a
                  key={p.name}
                  href={lcUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  className="card-flat card-hover flex items-center gap-2 bg-white px-3 py-2"
                >
                  <Difficulty level={p.level} />
                  <span className="font-semibold">{p.name}</span>
                  <span className="ml-auto text-muted">↗</span>
                </a>
              ))}
            </div>
          </section>

          {(labs.length > 0 || games.length > 0) && (
            <section id="lab" className="scroll-mt-24">
              <SectionTitle emoji="🧪">Play with it</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {labs.map((p) => (
                  <Link key={p.slug} href={`/lab/${p.slug}`} className="card card-hover bg-sun-soft p-4">
                    <div className="text-3xl">{p.emoji}</div>
                    <div className="font-bold">Lab: {p.title}</div>
                    <div className="text-sm text-muted">{p.approaches.map((a) => a.name).join(" vs ")}</div>
                  </Link>
                ))}
                {games.map((g) => (
                  <Link key={g.slug} href={`/games/${g.slug}`} className="card card-hover bg-bubble-soft p-4">
                    <div className="text-3xl">{g.emoji}</div>
                    <div className="font-bold">Game: {g.title}</div>
                    <div className="text-sm text-muted">{g.blurb}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap justify-between gap-3 border-t-2 border-dashed border-line pt-6">
            {prev ? (
              <Link href={`/topics/${prev.slug}`} className="btn">
                ← {prev.emoji} {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/topics/${next.slug}`} className="btn bg-sun">
                {next.emoji} {next.title} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
