// Original Ashan Market brand marks: a mountain-ridge logo and a Dhaka-weave inspired border.

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <circle cx="45" cy="19" r="6" className="fill-accent" />
      <path d="M8 48 L22 28 L30 38 L40 22 L56 48 Z" fill="#FBF7F2" />
      <path d="M22 28 L26 34 L22 33 L18 34 Z M40 22 L45 30 L40 29 L35 30 Z" fill="#E6DCCF" />
    </svg>
  );
}

/** Repeating diamond-and-chevron band, used as a thin decorative divider. */
export function DhakaBorder({ className = '' }: { className?: string }) {
  return (
    <svg className={`block h-3 w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="dhaka" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" className="fill-primary" />
          <path d="M12 1 L18 6 L12 11 L6 6 Z" className="fill-accent" />
          <path d="M12 4 L14.5 6 L12 8 L9.5 6 Z" className="fill-text" />
          <path d="M0 0 L3 6 L0 12 Z M24 0 L21 6 L24 12 Z" className="fill-surface" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill="url(#dhaka)" />
    </svg>
  );
}
