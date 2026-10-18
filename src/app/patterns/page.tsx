import Link from "next/link";
import type { Metadata } from "next";
import { CONSTRAINTS, PATTERNS } from "@/data/patterns";
import { Callout, PageHeader, SectionTitle } from "@/components/ui";
import { DecisionWizard } from "@/components/DecisionWizard";
import { MascotSays } from "@/components/Mascot";

export const metadata: Metadata = { title: "Which algorithm when?" };

const UMPIRE = [
  { l: "U", t: "Understand", d: "Repeat the problem in your words. Ask for an example. Ask about edge cases: empty? duplicates? negatives? huge n?", c: "bg-sun" },
  { l: "M", t: "Match", d: "Which pattern does it smell like? Sorted → binary search / two pointers. Subarray → window. Ways / min-max → DP. Grid → graph.", c: "bg-bubble" },
  { l: "P", t: "Plan", d: "Say the steps or pseudocode BEFORE coding. Get the interviewer's buy-in.", c: "bg-sky" },
  { l: "I", t: "Implement", d: "Clean code, meaningful names. Keep talking while you write.", c: "bg-mint" },
  { l: "R", t: "Review", d: "Dry-run one example line by line. Hunt off-by-one errors before they do.", c: "bg-grape" },
  { l: "E", t: "Evaluate", d: "State time & space. Ask yourself: can it be better?", c: "bg-peach" },
];

const LADDER = [
  { step: "1. Brute force", emoji: "🔨", text: "Try every possibility directly — nested loops, all subsets, all pairs. Say it out loud with its complexity. It proves you understand the problem and gives you a correctness oracle.", tone: "bg-cherry-soft" },
  { step: "2. Find the waste", emoji: "🔎", text: "Where does it repeat work? Re-scanning the same elements? Re-computing the same sub-answer? Searching linearly for something you saw before?", tone: "bg-sun-soft" },
  { step: "3. Apply a lever", emoji: "🔧", text: "Repeated lookups → HashMap. Unordered → sort then two pointers. Contiguous rescans → sliding window / prefix sums. Repeated subproblems → memo/DP. Repeated min/max → heap. Sorted search → binary search.", tone: "bg-sky-soft" },
  { step: "4. Optimal + trade-offs", emoji: "🏆", text: "Explain what you gave up (usually memory). Mention when the brute force would actually be fine (tiny n).", tone: "bg-mint-soft" },
];

const COMPARE = [
  { name: "Brute force", emoji: "🔨", when: "Always first in an interview. Fine for tiny n (≤ 10–20) or as a test oracle.", how: "Enumerate everything", cost: "Often O(n²), O(2ⁿ), O(n!)", ex: "Two Sum with two loops" },
  { name: "Recursion", emoji: "🪆", when: "The problem is defined by smaller copies of itself (trees, divide & conquer).", how: "Base case + smaller call", cost: "Depends; watch the call tree", ex: "Tree height, merge sort" },
  { name: "Backtracking", emoji: "🌀", when: "Need ALL valid arrangements / any arrangement satisfying constraints.", how: "Choose → explore → un-choose, prune early", cost: "Exponential, pruning helps", ex: "N-Queens, subsets, sudoku" },
  { name: "Dynamic Programming", emoji: "🧠", when: "Count ways / min / max, and the recursion repeats the same subproblems.", how: "Memoize recursion or fill a table", cost: "states × transitions", ex: "Coin change, LCS, knapsack" },
  { name: "Greedy", emoji: "🤑", when: "A local choice is provably safe; no counter-example exists.", how: "Sort, then take the best now", cost: "Usually O(n log n)", ex: "Interval scheduling, jump game" },
  { name: "Divide & Conquer", emoji: "✂️", when: "Split into independent halves, combine results.", how: "Split, solve, merge", cost: "Often O(n log n)", ex: "Merge sort, quick select" },
];

export default function PatternsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="🧭 Which algorithm, when?"
        subtitle="The real skill isn't memorising 500 solutions — it's recognising the pattern. Answer a few questions and Bitu will point you to the right technique."
        mood="think"
        tone="grape"
      />

      <section>
        <SectionTitle emoji="🧙">The pattern finder</SectionTitle>
        <DecisionWizard />
      </section>

      <section>
        <SectionTitle emoji="🔨">Brute force → optimal: the thinking ladder</SectionTitle>
        <div className="grid gap-4 md:grid-cols-4">
          {LADDER.map((l, i) => (
            <div key={l.step} className={`card relative ${l.tone} p-5`}>
              <div className="text-4xl">{l.emoji}</div>
              <h3 className="mt-2 text-lg font-bold">{l.step}</h3>
              <p className="mt-1 text-[15px] text-ink-soft">{l.text}</p>
              {i < LADDER.length - 1 && <span className="absolute -right-5 top-1/2 z-10 hidden text-3xl md:block">➜</span>}
            </div>
          ))}
        </div>
        <Callout tone="mint" icon="🇮🇳" title="Desi tip" className="mt-4">
          <span className="font-hand text-xl text-ink">Brute force pehle: ek working solution bolo, phir optimize karo. Kuch na dena se accha hai. Optimal ke chakkar me freeze mat ho!</span>
        </Callout>
        <p className="mt-3 text-ink-soft">
          See it live: the <Link href="/lab/two-sum" className="font-bold underline">Two Sum lab</Link> runs brute force, HashMap and two pointers on the same input, and the{" "}
          <Link href="/lab/coin-change" className="font-bold underline">Coin Change lab</Link> shows greedy failing where DP succeeds.
        </p>
      </section>

      <section>
        <SectionTitle emoji="⚖️">Brute force vs Recursion vs Backtracking vs DP vs Greedy</SectionTitle>
        <div className="card overflow-x-auto bg-white">
          <table className="w-full min-w-[760px] text-[15px]">
            <thead className="border-b-[2.5px] border-ink bg-sun-soft text-left">
              <tr>
                <th className="px-4 py-3">Technique</th>
                <th className="px-4 py-3">Use it when…</th>
                <th className="px-4 py-3">How</th>
                <th className="px-4 py-3">Typical cost</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((c) => (
                <tr key={c.name} className="border-t-2 border-line align-top">
                  <td className="px-4 py-3 font-bold">
                    {c.emoji} {c.name}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{c.when}</td>
                  <td className="px-4 py-3">{c.how}</td>
                  <td className="px-4 py-3 font-mono text-sm">{c.cost}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <MascotSays mood="wink">
            DP or Greedy? Try to break greedy with a tiny counter-example (coins [1,3,4], amount 6). If you can break it → DP. If a sort + simple rule always works and you can justify it in one line → greedy.
          </MascotSays>
          <MascotSays mood="think" color="#c3b1ff">
            Backtracking or DP? If they want ALL the answers listed → backtracking. If they want a COUNT or the BEST one → usually DP.
          </MascotSays>
        </div>
      </section>

      <section>
        <SectionTitle emoji="📏">Read the constraints — they tell you the target complexity</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CONSTRAINTS.map((c) => (
            <div key={c.n} className="card-flat bg-white p-4">
              <div className="font-mono text-lg font-bold">{c.n}</div>
              <div className="chip mt-1 bg-sun font-mono">{c.ok}</div>
              <p className="mt-2 text-sm text-ink-soft">{c.ex}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle emoji="🔔">Signal words → technique</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERNS.map((p) => (
            <Link key={p.id} href={`/topics/${p.topic}`} className="card-flat card-hover flex flex-col gap-2 bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p.emoji}</span>
                <b>{p.name}</b>
                <span className="ml-auto font-mono text-xs text-muted">{p.typical}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.signals.map((s) => (
                  <span key={s} className="rounded-md border border-ink/30 bg-sun-soft px-1.5 font-mono text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-ink-soft">
          Practice the reflex in <Link href="/games/pattern-detective" className="font-bold underline">Pattern Detective 🕵️</Link>.
        </p>
      </section>

      <section>
        <SectionTitle emoji="🎤">UMPIRE — think out loud in every interview</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UMPIRE.map((u) => (
            <div key={u.l} className="card flex gap-3 bg-white p-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-ink text-2xl font-bold ${u.c}`}>{u.l}</span>
              <div>
                <b>{u.t}</b>
                <p className="text-sm text-ink-soft">{u.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Callout tone="mint" icon="✅" title="Interview day — do">
          <ul className="flex flex-col gap-1">
            <li>• Think out loud — silence shows the interviewer nothing.</li>
            <li>• Give a brute force first, then optimise.</li>
            <li>• Clarify assumptions and edge cases.</li>
            <li>• Dry-run your code on an example before saying &quot;done&quot;.</li>
            <li>• State time & space without being asked.</li>
          </ul>
        </Callout>
        <Callout tone="cherry" icon="🚫" title="Don't">
          <ul className="flex flex-col gap-1">
            <li>• Don&apos;t recite a memorised answer — a small twist will break it.</li>
            <li>• Don&apos;t freeze chasing the optimal solution.</li>
            <li>• Don&apos;t ignore hints — a hint means that direction is right.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
