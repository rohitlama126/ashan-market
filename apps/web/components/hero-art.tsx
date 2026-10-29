// Original hero illustration of Nepal at dawn: the snow-capped Himalaya (with a fishtail peak in the
// style of Machhapuchhre), green terraced hills, a five-tier pagoda on a stepped brick plinth, a white
// stupa with Buddha eyes and prayer flags, and rhododendrons (the national flower). Decorative only.

// Traditional prayer-flag order: sky, air, fire, water, earth.
const FLAG_COLORS = ['#3A7FD0', '#FBF7F2', '#CF3F35', '#2E8B57', '#F2BE5B'];

/** Flags hung along a sagging line from (x1,y1) to (x2,y2). */
function FlagLine({
  x1,
  y1,
  x2,
  y2,
  count,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count: number;
}) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + 10;
  const point = (t: number) => ({
    x: (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2,
    y: (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2,
  });
  return (
    <g>
      <path
        d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
        stroke="#5D3515"
        strokeOpacity="0.55"
        strokeWidth="0.8"
        fill="none"
      />
      {Array.from({ length: count }, (_, i) => {
        const { x, y } = point((i + 0.6) / (count + 0.4));
        return (
          <rect
            key={i}
            x={x - 2.6}
            y={y}
            width="5.2"
            height="6.5"
            fill={FLAG_COLORS[i % FLAG_COLORS.length]}
          />
        );
      })}
    </g>
  );
}

function Pagoda({ x, ground }: { x: number; ground: number }) {
  // Stepped brick plinth (five terraces) with a central stair.
  const steps = [
    { w: 84, h: 11 },
    { w: 70, h: 10 },
    { w: 57, h: 9 },
    { w: 46, h: 8 },
    { w: 36, h: 7 },
  ];
  let top = ground;
  const plinth = steps.map(({ w, h }, i) => {
    top -= h;
    return (
      <rect
        key={i}
        x={x - w / 2}
        y={top}
        width={w}
        height={h}
        fill={i % 2 ? '#B44A35' : '#A4422F'}
      />
    );
  });
  const plinthTop = top;

  // Five roofs, each with a wooden body beneath and a gold eave line.
  const roofs = [
    { body: 26, roof: 54, bh: 14, rh: 12 },
    { body: 22, roof: 46, bh: 10, rh: 11 },
    { body: 18, roof: 39, bh: 8, rh: 10 },
    { body: 14, roof: 32, bh: 7, rh: 9 },
    { body: 11, roof: 25, bh: 6, rh: 8 },
  ];
  let y = plinthTop;
  const tiers = roofs.map(({ body, roof, bh, rh }, i) => {
    y -= bh;
    const bodyY = y;
    y -= rh - 3;
    const roofBottom = bodyY + 3;
    return (
      <g key={i}>
        <rect x={x - body / 2} y={bodyY} width={body} height={bh} fill="#7A3B22" />
        <rect
          x={x - body / 2 + body * 0.3}
          y={bodyY + 2}
          width={body * 0.4}
          height={bh - 2}
          fill="#4A2214"
        />
        <path
          d={`M${x - roof / 2} ${roofBottom} L${x + roof / 2} ${roofBottom} L${x + roof / 2 - rh * 0.9} ${y} L${x - roof / 2 + rh * 0.9} ${y} Z`}
          fill="#5B2E1C"
        />
        <path
          d={`M${x - roof / 2} ${roofBottom} L${x + roof / 2} ${roofBottom}`}
          stroke="#E8A33D"
          strokeWidth="1.4"
        />
      </g>
    );
  });

  return (
    <g>
      {plinth}
      <rect x={x - 6} y={plinthTop} width="12" height={ground - plinthTop} fill="#8A3526" />
      {tiers}
      {/* Gilded finial (gajur) */}
      <path d={`M${x} ${y - 18} L${x + 3.2} ${y} L${x - 3.2} ${y} Z`} fill="#F2BE5B" />
      <circle cx={x} cy={y - 12} r="2.6" fill="#E8A33D" />
    </g>
  );
}

function Stupa({ x, ground }: { x: number; ground: number }) {
  const domeBase = ground - 19;
  const harmikaTop = domeBase - 48;
  const spireTop = harmikaTop - 36;
  return (
    <g>
      <FlagLine x1={x} y1={spireTop + 4} x2={x - 78} y2={ground - 2} count={9} />
      <FlagLine x1={x} y1={spireTop + 4} x2={x + 78} y2={ground - 2} count={9} />
      <rect x={x - 62} y={ground - 10} width="124" height="10" fill="#E3DCD3" />
      <rect x={x - 50} y={ground - 19} width="100" height="9" fill="#F1ECE6" />
      <path d={`M${x - 44} ${domeBase} A44 34 0 0 1 ${x + 44} ${domeBase} Z`} fill="#FBF7F2" />
      <path
        d={`M${x - 44} ${domeBase} A44 34 0 0 1 ${x + 44} ${domeBase}`}
        fill="none"
        stroke="#E3DCD3"
        strokeWidth="1.2"
      />
      {/* Harmika with the watchful eyes */}
      <rect x={x - 13} y={harmikaTop} width="26" height="15" fill="#F2BE5B" />
      <path
        d={`M${x - 9} ${harmikaTop + 8} q3 -3.5 6 0 M${x + 3} ${harmikaTop + 8} q3 -3.5 6 0`}
        stroke="#161C25"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx={x - 6} cy={harmikaTop + 7.2} r="1" fill="#161C25" />
      <circle cx={x + 6} cy={harmikaTop + 7.2} r="1" fill="#161C25" />
      <path
        d={`M${x} ${harmikaTop + 9} q1.5 2 0 3.5`}
        stroke="#3A7FD0"
        strokeWidth="1"
        fill="none"
      />
      {/* Thirteen-step golden spire and canopy */}
      <path
        d={`M${x - 9} ${harmikaTop} L${x + 9} ${harmikaTop} L${x + 4} ${spireTop + 6} L${x - 4} ${spireTop + 6} Z`}
        fill="#F2BE5B"
      />
      {Array.from({ length: 6 }, (_, i) => {
        const yy = harmikaTop - 4 - i * 4.6;
        const half = 8.4 - i * 0.75;
        return (
          <path
            key={i}
            d={`M${x - half} ${yy} L${x + half} ${yy}`}
            stroke="#D18620"
            strokeWidth="0.9"
          />
        );
      })}
      <path
        d={`M${x - 8} ${spireTop + 6} L${x + 8} ${spireTop + 6} L${x} ${spireTop - 2} Z`}
        fill="#E8A33D"
      />
      <path d={`M${x} ${spireTop - 2} L${x} ${spireTop - 10}`} stroke="#E8A33D" strokeWidth="1.6" />
      <circle cx={x} cy={spireTop - 11} r="1.8" fill="#F2BE5B" />
    </g>
  );
}

function Rhododendron({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-9 4 Q-4 -2 0 2 Q4 -2 9 4 Q4 8 0 5 Q-4 8 -9 4 Z" fill="#2F6B48" />
      {[
        [-3, -2],
        [3, -2],
        [0, -5],
      ].map(([dx, dy], i) => (
        <circle key={i} cx={dx} cy={dy} r="3.6" fill="#D63A6E" />
      ))}
      <circle cx="0" cy="-3" r="1.2" fill="#F2BE5B" />
    </g>
  );
}

export function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="hero-clip">
          <rect width="480" height="300" rx="22" />
        </clipPath>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE3C4" />
          <stop offset="0.6" stopColor="#F6C99A" />
          <stop offset="1" stopColor="#EFB089" />
        </linearGradient>
        <linearGradient id="hero-range" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9AAFC8" />
          <stop offset="1" stopColor="#6C84A3" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF4DC" />
          <stop offset="0.55" stopColor="#F7D58B" />
          <stop offset="1" stopColor="#F2BE5B" />
        </radialGradient>
      </defs>

      <g clipPath="url(#hero-clip)">
        <rect width="480" height="300" fill="url(#hero-sky)" />
        <circle cx="300" cy="92" r="58" fill="#FFF4DC" opacity="0.35" />
        <circle cx="300" cy="92" r="34" fill="url(#hero-sun)" />

        {/* Himalaya, with a twin-tipped "fishtail" peak */}
        <path
          d="M0 186 L42 148 L70 162 L110 108 L136 128 L158 96 L170 66 L177 80 L186 62 L202 100 L232 124 L266 88 L300 128 L338 102 L380 138 L420 110 L480 148 L480 230 L0 230 Z"
          fill="url(#hero-range)"
        />
        <g fill="#FFFFFF">
          <path d="M97 126 L110 108 L124 126 L115 121 L109 129 Z" />
          <path d="M162 92 L170 66 L177 80 L186 62 L197 92 L188 87 L180 95 L171 89 Z" />
          <path d="M252 106 L266 88 L281 107 L271 103 L262 110 Z" />
          <path d="M327 116 L338 102 L351 117 L343 114 Z" />
          <path d="M408 124 L420 110 L434 126 L425 122 Z" />
        </g>

        {/* Terraced hills */}
        <path d="M0 222 Q80 186 160 208 T320 198 T480 204 L480 300 L0 300 Z" fill="#5C9B6E" />
        <g stroke="#7FB98C" strokeOpacity="0.7" strokeWidth="1.4" fill="none">
          <path d="M0 234 Q80 200 160 220 T320 211 T480 216" />
          <path d="M0 246 Q80 214 160 232 T320 224 T480 228" />
        </g>
        <path d="M0 262 Q120 238 240 256 T480 250 L480 300 L0 300 Z" fill="#2F6B48" />

        <Pagoda x={118} ground={272} />
        <Stupa x={362} ground={274} />

        <Rhododendron x={34} y={284} />
        <Rhododendron x={58} y={292} s={0.8} />
        <Rhododendron x={232} y={288} s={0.9} />
        <Rhododendron x={452} y={290} />
      </g>
    </svg>
  );
}
