// Soft, blurred color fields behind the frosted surfaces: crimson, marigold and rhododendron.
// Purely decorative and fixed to the viewport.
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-primary animate-drift absolute -top-40 -left-32 size-[34rem] rounded-full opacity-25 blur-3xl dark:opacity-30" />
      <div className="bg-accent animate-drift absolute -top-24 right-[-10rem] size-[30rem] rounded-full opacity-30 blur-3xl [animation-delay:-7s] dark:opacity-20" />
      <div className="bg-sale animate-drift absolute bottom-[-12rem] left-1/3 size-[36rem] rounded-full opacity-15 blur-3xl [animation-delay:-14s] dark:opacity-20" />
    </div>
  );
}

/** Original hero illustration: layered Himalayan ridges, a rising sun and a string of prayer flags. */
export function HeroArt({ className = '' }: { className?: string }) {
  const flags = ['#3A7FD0', '#FBF7F2', '#CF3F35', '#2E8B57', '#E8A33D'];
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2BE5B" />
          <stop offset="1" stopColor="#E8A33D" />
        </linearGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EE9A93" />
          <stop offset="1" stopColor="#CF3F35" />
        </linearGradient>
        <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B3261E" />
          <stop offset="1" stopColor="#761C17" />
        </linearGradient>
      </defs>
      <circle cx="272" cy="96" r="44" fill="url(#sun)" />
      <path
        d="M0 200 L70 120 L118 166 L176 92 L236 160 L300 108 L400 190 L400 260 L0 260 Z"
        fill="url(#far)"
      />
      <path
        d="M176 92 L192 112 L178 108 L162 112 Z M300 108 L314 126 L300 122 L287 126 Z"
        fill="#FBF7F2"
        opacity="0.85"
      />
      <path
        d="M0 236 L60 176 L104 214 L168 150 L232 220 L296 168 L360 214 L400 196 L400 260 L0 260 Z"
        fill="url(#near)"
      />
      {/* Prayer-flag string */}
      <path
        d="M24 70 Q140 112 250 58"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        fill="none"
      />
      {Array.from({ length: 10 }, (_, i) => {
        const t = (i + 0.5) / 10;
        const x = (1 - t) ** 2 * 24 + 2 * (1 - t) * t * 140 + t ** 2 * 250;
        const y = (1 - t) ** 2 * 70 + 2 * (1 - t) * t * 112 + t ** 2 * 58;
        return (
          <path
            key={i}
            d={`M${x - 7} ${y} L${x + 7} ${y} L${x + 5} ${y + 16} L${x - 5} ${y + 16} Z`}
            fill={flags[i % flags.length]}
            opacity="0.9"
          />
        );
      })}
    </svg>
  );
}
