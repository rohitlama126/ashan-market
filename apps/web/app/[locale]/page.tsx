import { createI18n, isLocale, resources } from '@ashan/i18n';
import { ArrowRight, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { HeroArt } from '../../components/backdrop.tsx';
import { categoryIcons } from '../../components/category-icons.ts';

const categorySlugs = Object.keys(
  resources.en.categories,
) as (keyof typeof resources.en.categories)[];

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
      <section
        aria-labelledby="hero-title"
        className="glass relative overflow-hidden rounded-xl p-6 sm:p-10 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-8"
      >
        <div className="relative z-10">
          <p
            className={`text-primary text-sm font-semibold ${locale === 'en' ? 'tracking-[0.18em] uppercase' : ''}`}
          >
            {t('home.kicker')}
          </p>
          <h1
            id="hero-title"
            className="mt-3 text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl"
          >
            {t('app.tagline')}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#categories"
              className="bg-primary text-primary-text hover:bg-primary-hover inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold shadow-lg shadow-black/10 transition"
            >
              {t('home.browse')}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <p className="glass-subtle inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium">
              <Sparkles aria-hidden="true" className="text-warning size-4" />
              {t('home.festivalNote')}
            </p>
          </div>
          <p className="text-text-muted mt-6 text-sm">{t('app.comingSoon')}</p>
        </div>
        <HeroArt className="text-text mt-8 h-48 w-full sm:h-56 lg:mt-0 lg:h-72" />
      </section>

      <section aria-labelledby="categories-title" id="categories" className="mt-12 scroll-mt-24">
        <h2 id="categories-title" className="text-2xl font-semibold tracking-tight">
          {t('nav.categories')}
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {categorySlugs.map((slug) => {
            const Icon = categoryIcons[slug];
            return (
              <li key={slug}>
                {/* Becomes a link to the category page in milestone 3. */}
                <div className="glass flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg p-4 text-center font-medium">
                  <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-full">
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
                  </span>
                  {t(`categories.${slug}`)}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
