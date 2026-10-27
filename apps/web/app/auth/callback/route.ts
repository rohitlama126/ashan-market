import { NextResponse, type NextRequest } from 'next/server';
import { safeNextPath } from '../../../lib/safe-redirect.ts';
import { createSupabaseServerClient } from '../../../lib/supabase/server.ts';

// OAuth (Apple/Google) and email-link landing: exchanges the PKCE code for a session cookie.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get('next'), '/en/account');
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  const locale = next.split('/')[1] ?? 'en';
  return NextResponse.redirect(new URL(`/${locale}/sign-in?error=oauth`, origin));
}
