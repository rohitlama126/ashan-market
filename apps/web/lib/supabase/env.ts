/** Public Supabase settings. Returns null when unset so the storefront still renders without a backend. */
export function supabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
}

export function requireSupabaseEnv(): { url: string; anonKey: string } {
  const env = supabaseEnv();
  if (!env) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. Run `pnpm db:start` and copy the values into apps/web/.env.local.',
    );
  }
  return env;
}
