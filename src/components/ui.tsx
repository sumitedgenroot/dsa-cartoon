import { Mascot, type Mood } from "./Mascot";

export type Tone = "sun" | "bubble" | "sky" | "mint" | "grape" | "peach" | "cherry" | "white";

export const SOFT: Record<Tone, string> = {
  sun: "bg-sun-soft",
  bubble: "bg-bubble-soft",
  sky: "bg-sky-soft",
  mint: "bg-mint-soft",
  grape: "bg-grape-soft",
  peach: "bg-peach-soft",
  cherry: "bg-cherry-soft",
  white: "bg-white",
};

export const SOLID: Record<Tone, string> = {
  sun: "bg-sun",
  bubble: "bg-bubble",
  sky: "bg-sky",
  mint: "bg-mint",
  grape: "bg-grape",
  peach: "bg-peach",
  cherry: "bg-cherry",
  white: "bg-white",
};

export const HEX: Record<Tone, string> = {
  sun: "#ffd84d",
  bubble: "#ff9ec4",
  sky: "#8ecbff",
  mint: "#8fe3a8",
  grape: "#c3b1ff",
  peach: "#ffb37a",
  cherry: "#ff7a7a",
  white: "#ffffff",
};

export function Callout({
  tone = "sun",
  icon,
  title,
  children,
  className = "",
}: {
  tone?: Tone;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-flat ${SOFT[tone]} px-4 py-3 ${className}`}>
      {title && (
        <div className="mb-1 flex items-center gap-2 font-bold">
          {icon && <span className="text-lg">{icon}</span>}
          {title}
        </div>
      )}
      <div className="text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  mood = "happy",
  tone = "sun",
  color,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  mood?: Mood;
  tone?: Tone;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`card ${SOFT[tone]} relative overflow-hidden px-6 py-7 sm:px-10 sm:py-9`}>
      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-lg text-ink-soft">{subtitle}</p>}
          {children && <div className="mt-4">{children}</div>}
        </div>
        <Mascot mood={mood} size={110} color={color} className="shrink-0 animate-float" />
      </div>
    </section>
  );
}

export function SectionTitle({ children, emoji, id }: { children: React.ReactNode; emoji?: string; id?: string }) {
  return (
    <h2 id={id} className="mb-4 mt-2 flex scroll-mt-24 items-center gap-2 text-2xl font-bold">
      {emoji && <span>{emoji}</span>}
      <span className="scribble-underline">{children}</span>
    </h2>
  );
}

export function Difficulty({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  const c = level === "Easy" ? "bg-mint" : level === "Medium" ? "bg-sun" : "bg-cherry";
  return <span className={`chip ${c}`}>{level}</span>;
}

export function ComplexityBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="chip bg-white font-mono">
      <span className="text-muted">{label}</span> {value}
    </span>
  );
}
