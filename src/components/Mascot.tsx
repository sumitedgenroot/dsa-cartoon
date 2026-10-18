export type Mood = "happy" | "think" | "wow" | "sad" | "cool" | "wink";

/** Bitu — the doodle mascot. A round blob with an antenna that holds a bit. */
export function Mascot({
  mood = "happy",
  size = 96,
  color = "#ffd84d",
  className = "",
}: {
  mood?: Mood;
  size?: number;
  color?: string;
  className?: string;
}) {
  const ink = "#1f1d2b";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`Bitu the mascot looking ${mood}`}
    >
      {/* antenna */}
      <path d="M60 22 C 58 14, 64 10, 66 6" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="67" cy="6" r="5" fill="#ff9ec4" stroke={ink} strokeWidth="2.5" />
      {/* body */}
      <path
        d="M20 66 C 18 36, 36 20, 60 21 C 86 22, 102 38, 101 66 C 100 92, 84 106, 60 106 C 34 106, 21 92, 20 66 Z"
        fill={color}
        stroke={ink}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* feet */}
      <path d="M44 105 q -2 7 -10 7" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M76 105 q 2 7 10 7" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* arms */}
      <path d="M21 70 q -11 -2 -14 -12" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      {mood === "think" ? (
        <path d="M100 72 q 4 -14 -14 -12" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === "wow" || mood === "happy" ? (
        <path d="M100 66 q 11 -4 13 -16" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M100 72 q 10 4 12 12" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {/* cheeks */}
      <ellipse cx="36" cy="72" rx="6" ry="4" fill="#ff9ec4" opacity="0.75" />
      <ellipse cx="85" cy="72" rx="6" ry="4" fill="#ff9ec4" opacity="0.75" />
      {/* eyes */}
      {mood === "cool" ? (
        <g>
          <path d="M33 52 h 54 l -3 10 q -10 6 -18 0 l -3 -6 h -6 l -3 6 q -8 6 -18 0 Z" fill={ink} />
          <path d="M40 54 l 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : mood === "wink" ? (
        <g>
          <path d="M38 58 q 6 -6 12 0" stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="74" cy="57" rx="6" ry="7.5" fill={ink} />
          <circle cx="76" cy="54" r="2.2" fill="#fff" />
        </g>
      ) : mood === "sad" ? (
        <g>
          <ellipse cx="45" cy="59" rx="5.5" ry="6.5" fill={ink} />
          <ellipse cx="75" cy="59" rx="5.5" ry="6.5" fill={ink} />
          <path d="M37 48 l 12 4" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M83 48 l -12 4" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M80 66 q 2 6 0 8 q -3 -2 0 -8" fill="#8ecbff" stroke={ink} strokeWidth="1.5" />
        </g>
      ) : (
        <g>
          <ellipse cx="45" cy="57" rx={mood === "wow" ? 7.5 : 6} ry={mood === "wow" ? 9 : 7.5} fill={ink} />
          <ellipse cx="75" cy="57" rx={mood === "wow" ? 7.5 : 6} ry={mood === "wow" ? 9 : 7.5} fill={ink} />
          <circle cx="47" cy="54" r="2.4" fill="#fff" />
          <circle cx="77" cy="54" r="2.4" fill="#fff" />
          {mood === "think" && (
            <path d="M66 44 q 9 -6 18 -1" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </g>
      )}
      {/* mouth */}
      {mood === "happy" || mood === "wink" || mood === "cool" ? (
        <path
          d="M50 75 q 10 10 20 0"
          stroke={ink}
          strokeWidth="3.5"
          fill="#ff7a7a"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : mood === "wow" ? (
        <ellipse cx="60" cy="79" rx="6" ry="7" fill="#ff7a7a" stroke={ink} strokeWidth="3" />
      ) : mood === "sad" ? (
        <path d="M51 82 q 9 -8 18 0" stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M52 79 q 5 -3 9 0 t 8 0" stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** Mascot with a comic speech bubble. */
export function MascotSays({
  children,
  mood = "happy",
  size = 64,
  color,
  className = "",
}: {
  children: React.ReactNode;
  mood?: Mood;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <Mascot mood={mood} size={size} color={color} className="shrink-0" />
      <div className="relative card-flat mb-3 min-w-0 flex-1 px-4 py-2.5 font-hand text-lg leading-snug">
        <span className="absolute -left-[9px] bottom-3 h-4 w-4 rotate-45 border-b-2 border-l-2 border-ink bg-white" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
