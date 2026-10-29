import { createI18n, isLocale, type Locale } from '@ashan/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { ImageCredit, ProductImage } from '../../../components/product-image.tsx';
import { getFeaturedProducts } from '../../../lib/catalog.ts';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/credits'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: createI18n(locale).t('credits.title') } : {};
}

export default async function CreditsPage({ params }: PageProps<'/[locale]/credits'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">{t('credits.title')}</h1>
      <p className="text-text-muted mt-2">{t('credits.intro')}</p>
      <Suspense>
        <CreditList locale={locale} />
      </Suspense>
    </main>
  );
}

async function CreditList({ locale }: { locale: Locale }) {
  await connection();
  const { t } = createI18n(locale);
  const withPhotos = (await getFeaturedProducts(locale, 200)).filter((p) => p.image);
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {withPhotos.map((p) => (
        <li key={p.id} className="glass flex items-center gap-3 overflow-hidden rounded-lg">
          <ProductImage
            image={p.image}
            categorySlug={p.categorySlug}
            brand={p.brand}
            sizes="80px"
            className="w-20 shrink-0"
          />
          <div className="min-w-0">
            <Link href={`/${locale}/p/${p.slug}`} className="px-4 font-medium hover:underline">
              {p.name}
            </Link>
            <ImageCredit image={p.image} label={t('product.photoCredit')} />
            {p.image?.credit.license && /^cc0|public domain/i.test(p.image.credit.license) ? (
              <p className="text-text-muted px-4 py-2 text-xs">{p.image.credit.license}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
