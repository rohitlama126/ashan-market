import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createI18n, isLocale, locales, resources } from '@ashan/i18n';
import { DhakaBorder, LogoMark } from '../../components/brand.tsx';

const categorySlugs = Object.keys(
  resources.en.categories,
) as (keyof typeof resources.en.categories)[];

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);

  return (
    <>
      <header className="bg-surface border-border border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href={`/${locale}`} className="flex min-h-11 items-center gap-3 rounded-md">
            <LogoMark size={40} />
            <span className="text-xl font-bold">{t('app.name')}</span>
          </Link>
          <nav aria-label={t('language.label')} className="flex gap-1">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                hrefLang={l}
                lang={l}
                aria-current={l === locale ? 'true' : undefined}
                className="text-text-muted aria-[current]:bg-surface-muted aria-[current]:text-text hover:bg-surface-muted inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm font-medium"
              >
                {t(`language.${l}`)}
              </Link>
            ))}
          </nav>
        </div>
        <DhakaBorder />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <section
          aria-labelledby="hero-title"
          className="bg-surface border-border rounded-xl border p-6 sm:p-10"
        >
          <h1 id="hero-title" className="text-3xl font-bold sm:text-4xl">
            {t('app.tagline')}
          </h1>
          <p className="bg-accent text-accent-text mt-6 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
            {t('app.comingSoon')}
          </p>
        </section>

        <section aria-labelledby="categories-title" className="mt-10">
          <h2 id="categories-title" className="text-2xl font-semibold">
            {t('nav.categories')}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categorySlugs.map((slug) => (
              <li
                key={slug}
                className="bg-surface border-border flex min-h-20 items-center justify-center rounded-lg border p-3 text-center font-medium"
              >
                {t(`categories.${slug}`)}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-surface-muted text-text-muted mt-auto py-6 text-center text-sm">
        © 2026 {t('app.name')}
      </footer>
    </>
  );
}
