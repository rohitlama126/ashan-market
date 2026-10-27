import { NextResponse, type NextRequest } from 'next/server';
import { localeFromPath, negotiateLocale } from './lib/locale.ts';
import { updateSession } from './lib/supabase/session.ts';

const LOCALE_COOKIE = 'am_locale';

// 1. Redirects locale-less paths to /en or /ne (cookie first, then Accept-Language).
// 2. Refreshes the Supabase session cookies.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!localeFromPath(pathname)) {
    const cookie = request.cookies.get(LOCALE_COOKIE)?.value ?? null;
    const locale =
      localeFromPath(`/${cookie}`) ?? negotiateLocale(request.headers.get('accept-language'));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }
  return updateSession(request);
}

export const config = {
  matcher: ['/((?!api|auth/|_next|.*\\..*).*)'],
};
