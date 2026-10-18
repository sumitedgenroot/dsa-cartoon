import type { Metadata } from "next";
import { DSA_OOP, JAVA_VS_CPP, PILLARS, SOLID } from "@/data/oops";
import { Callout, PageHeader, SOFT, SectionTitle } from "@/components/ui";
import { DualCode } from "@/components/CodeBlock";
import { MascotSays } from "@/components/Mascot";

export const metadata: Metadata = { title: "OOPs for DSA" };

export default function OopsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="🧱 OOPs — objects, but make it cartoon"
        subtitle="The 4 pillars with real-life analogies, Java vs C++ side by side, and exactly where OOP shows up in DSA interviews."
        mood="cool"
        tone="peach"
      />

      <section>
        <SectionTitle emoji="🤔">When do I need OOP in DSA?</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <Callout tone="mint" icon="✅" title="Use OOP when…">
            <ul className="flex flex-col gap-1">
              <li>• The question says &quot;Design …&quot; (LRU Cache, Min Stack, Trie, Twitter feed).</li>
              <li>• You implement a data structure with its own invariants.</li>
              <li>• You store custom objects in heaps / sorted maps (need comparators).</li>
              <li>• Low-level design (LLD) rounds: parking lot, elevator, library.</li>
            </ul>
          </Callout>
          <Callout tone="sun" icon="🤷" title="Skip heavy OOP when…">
            <ul className="flex flex-col gap-1">
              <li>• It&apos;s a single function problem (Two Sum, Binary Search).</li>
              <li>• A small helper class/struct (Node, Pair) is enough.</li>
              <li>• Interviewers want the algorithm, not a class hierarchy.</li>
            </ul>
          </Callout>
          <MascotSays mood="wink">Think of a class as a tiny robot that guards its own data and only answers through buttons (methods).</MascotSays>
        </div>
      </section>

      <section>
        <SectionTitle emoji="🏛️">The 4 pillars</SectionTitle>
        <div className="flex flex-col gap-8">
          {PILLARS.map((p, i) => (
            <div key={p.name} className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
              <div className={`card ${SOFT[p.tone]} flex flex-col gap-3 p-6`}>
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{p.emoji}</span>
                  <div>
                    <span className="font-mono text-xs font-bold text-muted">pillar {i + 1}</span>
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                  </div>
                </div>
                <p className="font-hand text-xl leading-snug">🎨 {p.analogy}</p>
                <p className="text-ink-soft">{p.idea}</p>
              </div>
              <DualCode java={p.java} cpp={p.cpp} title={p.name} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle emoji="🧩">OOP inside DSA problems</SectionTitle>
        <div className="flex flex-col gap-8">
          {DSA_OOP.map((d) => (
            <div key={d.title} className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">{d.title}</h3>
              <p className="text-ink-soft">💡 {d.why}</p>
              <DualCode java={d.java} cpp={d.cpp} title={d.title} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle emoji="☕⚡">Java vs C++ OOP differences</SectionTitle>
        <div className="card overflow-x-auto bg-white">
          <table className="w-full min-w-[640px] text-[15px]">
            <thead className="border-b-[2.5px] border-ink bg-sky-soft text-left">
              <tr>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">☕ Java</th>
                <th className="px-4 py-3">⚡ C++</th>
              </tr>
            </thead>
            <tbody>
              {JAVA_VS_CPP.map((r) => (
                <tr key={r.topic} className="border-t-2 border-line">
                  <td className="px-4 py-3 font-bold">{r.topic}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.java}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.cpp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionTitle emoji="🧱">SOLID in one breath</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SOLID.map((s) => (
            <div key={s.l} className="card flex flex-col gap-2 bg-white p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-[2.5px] border-ink bg-grape text-2xl font-bold">{s.l}</span>
              <b>{s.name}</b>
              <p className="text-sm text-ink-soft">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
