"use client";

import { useLang, type Lang } from "@/lib/lang";

const OPTS: { id: Lang; label: string }[] = [
  { id: "java", label: "☕ Java" },
  { id: "cpp", label: "⚡ C++" },
];

export function LangToggle({ small = false }: { small?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex rounded-xl border-2 border-ink bg-white p-0.5 ${small ? "text-xs" : "text-sm"}`}
      role="radiogroup"
      aria-label="Code language"
    >
      {OPTS.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={lang === o.id}
          onClick={() => setLang(o.id)}
          className={`rounded-[9px] px-2.5 py-1 font-semibold transition ${
            lang === o.id ? "bg-ink text-white" : "hover:bg-sun-soft"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
