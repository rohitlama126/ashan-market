import { defaultLocale, isLocale, type Locale } from '@ashan/i18n';

/** Picks a supported locale from an Accept-Language header, honoring q-values. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { lang: tag.toLowerCase().split('-')[0], q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((x) => x.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) if (isLocale(lang)) return lang;
  return defaultLocale;
}

/** Returns the locale prefix of a pathname, or null when the path has none. */
export function localeFromPath(pathname: string): Locale | null {
  const first = pathname.split('/')[1];
  return isLocale(first) ? first : null;
}
