import Link from "next/link";
import type { Metadata } from "next";
import { GAMES } from "@/data/games";
import { PageHeader, SOFT } from "@/components/ui";

export const metadata: Metadata = { title: "Games" };

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="🎮 Learn by playing"
        subtitle="Every game trains one interview skill — from reading Big-O at a glance to picking BFS over DFS without thinking."
        mood="wink"
        tone="bubble"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g, i) => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            className={`card card-hover flex flex-col gap-2 ${SOFT[g.tone]} p-6`}
            style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}
          >
            <span className="text-5xl">{g.emoji}</span>
            <h2 className="text-xl font-bold">{g.title}</h2>
            <p className="text-ink-soft">{g.blurb}</p>
            <span className="chip mt-auto self-start bg-white">🎯 {g.skill}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
