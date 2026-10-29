// Original Ashan Market brand mark: a mountain-ridge logo.

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
