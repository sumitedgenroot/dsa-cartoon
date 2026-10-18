"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlightLines, parseSteps } from "@/lib/highlight";
import { useLang, LANG_LABEL } from "@/lib/lang";
import { LangToggle } from "./LangToggle";

export function Code({
  code,
  activeLines = [],
  title,
  maxHeight,
  right,
}: {
  code: string;
  activeLines?: number[];
  title?: React.ReactNode;
  maxHeight?: number;
  right?: React.ReactNode;
}) {
  const lines = useMemo(() => highlightLines(code), [code]);
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const active = new Set(activeLines);
  const first = activeLines[0];

  // keep the highlighted line visible inside scrollable code panes
  useEffect(() => {
    if (first === undefined || !maxHeight || !preRef.current) return;
    const el = preRef.current.querySelector<HTMLElement>(`[data-line="${first}"]`);
    if (!el) return;
    const pre = preRef.current;
    const top = el.offsetTop - pre.offsetTop;
    if (top < pre.scrollTop || top > pre.scrollTop + pre.clientHeight - 30) {
      pre.scrollTo({ top: top - pre.clientHeight / 3, behavior: "smooth" });
    }
  }, [first, maxHeight]);

  return (
    <div className="card-flat overflow-hidden bg-cream">
      <div className="flex items-center gap-2 border-b-2 border-ink bg-white px-3 py-1.5">
        <span className="flex gap-1">
          <span className="h-3 w-3 rounded-full border-2 border-ink bg-cherry" />
          <span className="h-3 w-3 rounded-full border-2 border-ink bg-sun" />
          <span className="h-3 w-3 rounded-full border-2 border-ink bg-mint" />
        </span>
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="ml-auto flex items-center gap-2">
          {right}
          <button
            className="rounded-lg border-2 border-ink p-1 hover:bg-sun-soft"
            aria-label="Copy code"
            onClick={() => {
              navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      <pre
        ref={preRef}
        className="code-scroll relative overflow-auto py-2 font-mono text-[13px] leading-[1.6]"
        style={maxHeight ? { maxHeight } : undefined}
      >
        {lines.map((toks, i) => (
          <div
            key={i}
            data-line={i}
            className={`flex pr-4 transition-colors duration-150 ${
              active.has(i) ? "bg-sun/80 shadow-[inset_4px_0_0_#1f1d2b]" : ""
            }`}
          >
            <span className="w-10 shrink-0 select-none pr-3 text-right text-muted/60">{i + 1}</span>
            <code className="whitespace-pre">
              {toks.length === 0
                ? " "
                : toks.map((t, j) => (
                    <span key={j} className={t.c}>
                      {t.t}
                    </span>
                  ))}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}

/** Java / C++ tabbed code block that follows the global language toggle. */
export function DualCode({
  java,
  cpp,
  title,
  activeStep,
  maxHeight,
}: {
  java: string;
  cpp: string;
  title?: string;
  activeStep?: string;
  maxHeight?: number;
}) {
  const { lang } = useLang();
  const parsed = useMemo(() => parseSteps(lang === "java" ? java : cpp), [lang, java, cpp]);
  const activeLines = activeStep ? parsed.steps[activeStep] || [] : [];
  return (
    <Code
      code={parsed.code}
      activeLines={activeLines}
      maxHeight={maxHeight}
      title={
        <>
          {title ? `${title} · ` : ""}
          <span className="text-muted">{LANG_LABEL[lang]}</span>
        </>
      }
      right={<LangToggle small />}
    />
  );
}
