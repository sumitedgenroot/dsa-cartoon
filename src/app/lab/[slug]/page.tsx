import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/PageSkeleton";
import { PROBLEMS, getProblem } from "@/labs";
import { getTopic } from "@/data/topics";
import { Difficulty } from "@/components/ui";
import { Mascot } from "@/components/Mascot";
import { LabClient } from "@/components/lab/LabClient";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProblem(slug);
  return { title: p ? `${p.title} — Lab` : "Lab" };
}

export default function LabPage(props: PageProps<"/lab/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LabContent params={props.params} />
    </Suspense>
  );
}

async function LabContent({ params }: { params: PageProps<"/lab/[slug]">["params"] }) {
  const { slug } = await params;
  const p = getProblem(slug);
  if (!p) notFound();
  const topic = getTopic(p.topic);
  return (
    <div className="flex flex-col gap-6">
      <section className="card bg-sun-soft px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/lab" className="chip bg-white hover:bg-sun-soft">
                ← all labs
              </Link>
              <Difficulty level={p.level} />
              {topic && (
                <Link href={`/topics/${topic.slug}`} className="chip whitespace-normal bg-white hover:bg-sun-soft">
                  {topic.emoji} learn {topic.title}
                </Link>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold">
              {p.emoji} {p.title}
            </h1>
            <p className="mt-1 max-w-3xl text-lg text-ink-soft">{p.statement}</p>
            <p className="mt-2 font-hand text-xl">
              {p.approaches.length} ways to solve it: {p.approaches.map((a) => a.name).join(" · ")}
            </p>
          </div>
          <Mascot mood="think" size={100} className="hidden shrink-0 animate-float sm:block" />
        </div>
      </section>
      <LabClient slug={p.slug} />
    </div>
  );
}
