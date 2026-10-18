import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/PageSkeleton";
import { GAMES, getGame } from "@/data/games";
import { getTopic } from "@/data/topics";
import { SOFT } from "@/components/ui";
import { GameSwitch } from "@/components/games/GameSwitch";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/games/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGame(slug);
  return { title: g ? g.title : "Game", description: g?.blurb };
}

export default function GamePage(props: PageProps<"/games/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <GameContent params={props.params} />
    </Suspense>
  );
}

async function GameContent({ params }: { params: PageProps<"/games/[slug]">["params"] }) {
  const { slug } = await params;
  const g = getGame(slug);
  if (!g) notFound();
  const topic = getTopic(g.topic);
  return (
    <div className="flex flex-col gap-6">
      <section className={`card ${SOFT[g.tone]} flex flex-wrap items-center gap-4 px-6 py-5`}>
        <span className="text-5xl">{g.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Link href="/games" className="chip bg-white hover:bg-sun-soft">
              ← all games
            </Link>
            <span className="chip bg-white">skill: {g.skill}</span>
            {topic && (
              <Link href={`/topics/${topic.slug}`} className="chip whitespace-normal bg-white hover:bg-sun-soft">
                {topic.emoji} learn {topic.title}
              </Link>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold">{g.title}</h1>
          <p className="text-ink-soft">{g.blurb}</p>
        </div>
      </section>
      <GameSwitch slug={g.slug} />
    </div>
  );
}
