'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@ashan/db';
import { requireSupabaseEnv } from './env.ts';

export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
