import { NextResponse, type NextRequest } from 'next/server';
import { localeFromPath, negotiateLocale } from './lib/locale.ts';

const LOCALE_COOKIE = 'am_locale';

// Redirects locale-less paths to /en or /ne (cookie first, then Accept-Language).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (localeFromPath(pathname)) return NextResponse.next();

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value ?? null;
  const locale =
    localeFromPath(`/${cookie}`) ?? negotiateLocale(request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
