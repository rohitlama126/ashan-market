import { createServerClient } from '@supabase/ssr';
import type { Database } from '@ashan/db';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseEnv } from './env.ts';

/** Refreshes the auth cookies on every request so Server Components see a valid session. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const env = supabaseEnv();
  if (!env) return response;

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });
  // Validates the JWT and triggers a refresh when it is close to expiry. Do not remove.
  await supabase.auth.getUser();
  return response;
}
