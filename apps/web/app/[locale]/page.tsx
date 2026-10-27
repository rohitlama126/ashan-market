import { createI18n, isLocale, resources } from '@ashan/i18n';
import { notFound } from 'next/navigation';

const categorySlugs = Object.keys(
  resources.en.categories,
) as (keyof typeof resources.en.categories)[];

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);

  return (
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
  );
}
