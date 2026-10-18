"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Mascot } from "./Mascot";
import { LangToggle } from "./LangToggle";

const LINKS = [
  { href: "/topics", label: "Topics", emoji: "📚" },
  { href: "/lab", label: "Algo Lab", emoji: "🧪" },
  { href: "/games", label: "Games", emoji: "🎮" },
  { href: "/patterns", label: "Which Algo?", emoji: "🧭" },
  { href: "/oops", label: "OOPs", emoji: "🧱" },
  { href: "/cheatsheet", label: "Cheatsheet", emoji: "📝" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b-[2.5px] border-ink bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <Mascot size={40} mood="happy" />
          <span className="text-xl font-bold tracking-tight">
            DSA<span className="text-bubble">.</span>Quest
          </span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => {
            const active = path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-xl border-2 px-3 py-1.5 font-semibold transition ${
                  active ? "border-ink bg-sun" : "border-transparent hover:border-ink hover:bg-sun-soft"
                }`}
              >
                <span className="mr-1">{l.emoji}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LangToggle />
          <button className="btn btn-sm xl:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid grid-cols-2 gap-2 border-t-2 border-ink bg-white px-4 py-3 sm:grid-cols-3 xl:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="card-flat px-3 py-2 font-semibold">
              {l.emoji} {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
