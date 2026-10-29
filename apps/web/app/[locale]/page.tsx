import { createI18n, isLocale, resources } from '@ashan/i18n';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { categoryIcons } from '../../components/category-icons.ts';
import { ProductCard } from '../../components/product-card.tsx';
import { getFeaturedProducts } from '../../lib/catalog.ts';
import { supabaseEnv } from '../../lib/supabase/env.ts';
import type { Locale } from '@ashan/i18n';
import heroImage from '../../public/brand/hero.jpg';

const categorySlugs = Object.keys(
  resources.en.categories,
) as (keyof typeof resources.en.categories)[];

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);

  return (
    <main className="flex-1">
      {/* Full-width hero photo. Fixed white text over a dark gradient keeps AA contrast in
          both light and dark mode, independent of the theme tokens. */}
      <section
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[30rem] items-center overflow-hidden sm:min-h-[36rem]"
      >
        <Image
          src={heroImage}
          alt={t('home.heroAlt')}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/10 max-sm:bg-gradient-to-t max-sm:from-black/85 max-sm:via-black/60 max-sm:to-black/20"
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="max-w-xl text-white">
            <p
              className={`text-sm font-semibold text-[#F7D58B] ${locale === 'en' ? 'tracking-[0.18em] uppercase' : ''}`}
            >
              {t('home.kicker')}
            </p>
            <h1
              id="hero-title"
              className="mt-3 text-4xl leading-tight font-bold tracking-tight text-balance drop-shadow-md sm:text-6xl"
            >
              {t('app.tagline')}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#popular"
                className="bg-primary text-primary-text hover:bg-primary-hover inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold shadow-lg shadow-black/30 transition"
              >
                {t('home.shopNow')}
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#categories"
                className="inline-flex min-h-12 items-center rounded-full border border-white/40 bg-white/10 px-6 font-semibold backdrop-blur-md transition hover:bg-white/20"
              >
                {t('home.browse')}
              </a>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Sparkles aria-hidden="true" className="size-4 text-[#F7D58B]" />
              {t('home.festivalNote')}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-12">
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

        <section aria-labelledby="popular-title" id="popular" className="mt-12 scroll-mt-24">
          <h2 id="popular-title" className="text-2xl font-semibold tracking-tight">
            {t('product.popular')}
          </h2>
          <Suspense fallback={<ProductGridSkeleton />}>
            <PopularProducts locale={locale} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

const gridClass = 'mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5';

// 5 x 5 on desktop. Reads live prices and stock, so it renders per request.
async function PopularProducts({ locale }: { locale: Locale }) {
  await connection();
  if (!supabaseEnv()) return null;
  const products = await getFeaturedProducts(locale, 25);
  return (
    <ul className={gridClass}>
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

function ProductGridSkeleton() {
  return (
    <ul className={gridClass} aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i} className="glass aspect-[3/4] animate-pulse rounded-lg" />
      ))}
    </ul>
  );
}
