import { createI18n, locales, type Locale } from '@ashan/i18n';
import Image from 'next/image';
import Link from 'next/link';
import stupa from '../public/brand/stupa.png';
import { CartLink } from './cart-link.tsx';

export function SiteHeader({ locale }: { locale: Locale }) {
  const { t } = createI18n(locale);
  const navLink =
    'text-text-muted hover:text-text aria-[current]:glass-subtle aria-[current]:text-text inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium transition';
  return (
    <header className="glass sticky top-0 z-30 rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4">
        <Link href={`/${locale}`} className="flex min-h-11 items-center gap-3 rounded-md">
          <Image
            src={stupa}
            alt=""
            priority
            sizes="48px"
            className="size-12 rounded-lg bg-white object-contain p-0.5 shadow-sm ring-1 ring-black/5"
          />
          {/* Wordmark is set in capitals with CSS so screen readers still read the words; letter spacing
              would break Devanagari, so it applies to English only.
              Visually hidden on phones to fit the header; still the link's accessible name. */}
          <span
            className={`sr-only text-lg font-extrabold whitespace-nowrap sm:not-sr-only ${locale === 'en' ? 'tracking-[0.14em] uppercase' : ''}`}
          >
            {t('app.name')}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label={t('language.label')} className="flex gap-1">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                hrefLang={l}
                lang={l}
                aria-current={l === locale ? 'true' : undefined}
                className={navLink}
              >
                {t(`language.${l}`)}
              </Link>
            ))}
          </nav>
          <CartLink locale={locale} />
          <Link
            href={`/${locale}/account`}
            className="bg-primary text-primary-text hover:bg-primary-hover inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition"
          >
            {t('nav.account')}
          </Link>
        </div>
      </div>
    </header>
  );
}
