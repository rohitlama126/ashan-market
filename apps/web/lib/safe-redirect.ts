/** Only same-origin absolute paths are allowed as post-login destinations (prevents open redirects). */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\'))
    return fallback;
  return next;
}
