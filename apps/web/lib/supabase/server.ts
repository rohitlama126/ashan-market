import 'server-only';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@ashan/db';
import { cookies } from 'next/headers';
import { requireSupabaseEnv } from './env.ts';

/** Per-request client for Server Components, Server Actions and Route Handlers. */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireSupabaseEnv();
  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only; the proxy refreshes them.
        }
      },
    },
  });
}
