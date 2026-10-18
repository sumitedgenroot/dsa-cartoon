import Link from "next/link";
import { TOPICS, ROADMAP, getTopic } from "@/data/topics";
import { PROBLEMS } from "@/labs";
import { GAMES } from "@/data/games";
import { Mascot, MascotSays } from "@/components/Mascot";
import { SOFT, SectionTitle } from "@/components/ui";
import { ProgressBar } from "@/components/DoneButton";

const FEATURED = ["two-sum", "coin-change", "sorting-race", "climbing-stairs", "search-sorted", "islands"];

export default function Home() {
  const approaches = PROBLEMS.reduce((a, p) => a + p.approaches.length, 0);
  return (
    <div className="flex flex-col gap-16">
      {/* hero */}
      <section className="relative grid items-center gap-8 pt-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <span className="chip self-start bg-bubble-soft">✨ Java + C++ · Hinglish tips · zero boring slides</span>
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
            Learn <span className="scribble-underline">DSA</span> by
            <br />
            watching, racing &amp; <span className="text-bubble [-webkit-text-stroke:2px_#1f1d2b]">playing.</span>
          </h1>
          <p className="max-w-xl text-xl text-ink-soft">
            Run brute force, HashMap and two-pointer solutions on the <b>same</b> input, watch every step, and see their time complexity measured live. Then
            pick the right algorithm for any question like it&apos;s a reflex.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/lab/two-sum" className="btn bg-sun px-5 py-3 text-lg">
              🧪 Try Two Sum, 3 ways
            </Link>
            <Link href="/topics" className="btn px-5 py-3 text-lg">
              📚 Start learning
            </Link>
            <Link href="/games" className="btn bg-bubble-soft px-5 py-3 text-lg">
              🎮 Play
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            {[
              [TOPICS.length, "topics"],
              [PROBLEMS.length, "interactive labs"],
              [approaches, "approaches to compare"],
              [GAMES.length, "games"],
            ].map(([n, l]) => (
              <span key={l} className="card-flat bg-white px-3 py-1.5">
                <b className="font-mono text-lg">{n}</b> {l}
              </span>
            ))}
          </div>
        </div>
        <div className="relative mx-auto h-[380px] w-full max-w-[460px]">
          <div className="card absolute left-2 top-6 rotate-[-6deg] bg-cherry-soft px-4 py-3 font-mono text-sm">
            for i… for j… <b>O(n²)</b> 🐌
          </div>
          <div className="card absolute right-0 top-0 rotate-[5deg] bg-mint-soft px-4 py-3 font-mono text-sm">
            seen.get(target − x) <b>O(n)</b> ⚡
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Mascot mood="cool" size={210} className="animate-float" />
          </div>
          <div className="card absolute bottom-10 left-0 rotate-[3deg] bg-sky-soft px-4 py-3 font-mono text-sm">
            lo + (hi − lo) / 2 <b>O(log n)</b>
          </div>
          <div className="card absolute bottom-2 right-4 rotate-[-4deg] bg-grape-soft px-4 py-3 font-mono text-sm">
            dp[i] = dp[i−1] + dp[i−2] 🧠
          </div>
        </div>
      </section>

      {/* how it works */}
      <section>
        <SectionTitle emoji="🗺️">How DSA Quest works</SectionTitle>
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { e: "📚", t: "1. Understand", d: "A cartoon analogy, the concept, when to use it, and the thought process — in Java and C++.", href: "/topics", tone: "sky" as const },
            { e: "🎬", t: "2. Watch", d: "Step through each approach with the exact code line highlighted and every variable visible.", href: "/lab", tone: "sun" as const },
            { e: "📈", t: "3. Measure", d: "Race the approaches on bigger and bigger inputs. The site counts operations and detects the Big-O.", href: "/lab/sorting-race", tone: "mint" as const },
            { e: "🎮", t: "4. Play", d: "Games that turn pattern recognition, stacks, recursion and bits into muscle memory.", href: "/games", tone: "bubble" as const },
          ].map((s) => (
            <Link key={s.t} href={s.href} className={`card card-hover ${SOFT[s.tone]} p-5`}>
              <div className="text-4xl">{s.e}</div>
              <h3 className="mt-2 text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-ink-soft">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* featured labs */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <SectionTitle emoji="🧪">Same problem, different algorithms</SectionTitle>
          <Link href="/lab" className="btn btn-sm mb-4">
            all {PROBLEMS.length} labs →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((slug) => {
            const p = PROBLEMS.find((x) => x.slug === slug)!;
            return (
              <Link key={slug} href={`/lab/${slug}`} className="card card-hover flex flex-col gap-3 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{p.emoji}</span>
                  <h3 className="text-lg font-bold leading-tight">{p.title}</h3>
                </div>
                <div className="flex flex-col gap-1.5">
                  {p.approaches.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 truncate">{a.name}</span>
                      <span className="rounded-md border-2 border-ink bg-sun-soft px-1.5 font-mono text-xs">{a.time}</span>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* which algo */}
      <section className="card grid items-center gap-6 bg-grape-soft p-6 sm:p-10 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-3xl font-bold">🧭 &quot;Which algorithm do I use here?&quot;</h2>
          <p className="mt-2 max-w-2xl text-lg text-ink-soft">
            Sorted → binary search or two pointers. Contiguous → sliding window. Number of ways → DP. Grid → BFS/DFS. Answer a few questions and the
            pattern finder tells you where to start — plus when brute force, DP, greedy or backtracking is the right call.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/patterns" className="btn bg-sun">
              Open the pattern finder
            </Link>
            <Link href="/games/pattern-detective" className="btn">
              🕵️ Train with Pattern Detective
            </Link>
          </div>
        </div>
        <Mascot mood="think" size={150} color="#c3b1ff" className="hidden md:block" />
      </section>

      {/* games */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <SectionTitle emoji="🎮">Fun games, real skills</SectionTitle>
          <Link href="/games" className="btn btn-sm mb-4">
            all games →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {GAMES.map((g, i) => (
            <Link
              key={g.slug}
              href={`/games/${g.slug}`}
              className={`card card-hover ${SOFT[g.tone]} flex flex-col items-center gap-1 p-4 text-center`}
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            >
              <span className="text-4xl">{g.emoji}</span>
              <span className="font-bold leading-tight">{g.title}</span>
              <span className="text-xs text-muted">{g.skill}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* roadmap */}
      <section>
        <SectionTitle emoji="🛣️">The 6-week roadmap</SectionTitle>
        <div className="mb-5 max-w-lg">
          <ProgressBar ids={TOPICS.map((t) => t.slug)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((w) => (
            <div key={w.week} className="card bg-white p-5">
              <div className="font-mono text-sm font-bold text-muted">{w.week}</div>
              <h3 className="text-xl font-bold">{w.focus}</h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {w.slugs.map((s) => {
                  const t = getTopic(s)!;
                  return (
                    <li key={s}>
                      <Link href={`/topics/${s}`} className="flex items-center gap-2 rounded-lg px-1 hover:bg-sun-soft">
                        <span>{t.emoji}</span>
                        <span className="font-semibold">{t.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <MascotSays mood="wink" size={90} className="mx-auto max-w-2xl">
        Bhai, ye site ratne ke liye nahi hai — samajhne ke liye hai. Brute force pehle, phir optimize. Think out loud, and have fun! 🚀
      </MascotSays>
    </div>
  );
}
