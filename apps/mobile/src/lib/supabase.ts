import 'react-native-url-polyfill/auto';
import type { Database } from '@ashan/db';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { chunkedSecureStorage } from './secure-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// A placeholder URL keeps the app booting without a backend; auth calls then fail with a clear error.
export const supabase = createClient<Database>(
  url ?? 'http://127.0.0.1:54321',
  anonKey ?? 'missing',
  {
    auth: {
      storage: chunkedSecureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  },
);

// Refresh tokens only while the app is in the foreground (Supabase guidance for React Native).
AppState.addEventListener('change', (state) => {
  if (state === 'active') void supabase.auth.startAutoRefresh();
  else void supabase.auth.stopAutoRefresh();
});
