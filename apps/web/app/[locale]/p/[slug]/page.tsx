import { createI18n, isLocale, type Locale } from '@ashan/i18n';
import { ChevronRight, Flame, Leaf } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { ProductArt } from '../../../../components/product-art.tsx';
import { ProductCard } from '../../../../components/product-card.tsx';
import { ProductPurchase } from '../../../../components/product-purchase.tsx';
import { getProduct } from '../../../../lib/catalog.ts';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/p/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  await connection();
  const result = await getProduct(locale, slug).catch(() => null);
  return result ? { title: result.product.name, description: result.product.description } : {};
}

export default function ProductPage({ params }: PageProps<'/[locale]/p/[slug]'>) {
  // Product slugs aren't known at build time, so params are read inside the Suspense boundary.
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Suspense fallback={<div className="glass h-96 animate-pulse rounded-xl" />}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  await connection();
  const result = await getProduct(locale, slug);
  if (!result) notFound();
  const { product: p, related } = result;
  const { t } = createI18n(locale);
  const c = p.compliance;

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-text-muted mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link
              href={`/${locale}`}
              className="hover:text-text underline-offset-2 hover:underline"
            >
              {t('product.home')}
            </Link>
          </li>
          <ChevronRight aria-hidden="true" className="size-4" />
          <li>
            <Link
              href={`/${locale}#categories`}
              className="hover:text-text underline-offset-2 hover:underline"
            >
              {p.categoryName}
            </Link>
          </li>
          <ChevronRight aria-hidden="true" className="size-4" />
          <li aria-current="page" className="text-text line-clamp-1">
            {p.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass h-fit overflow-hidden rounded-xl">
          <ProductArt categorySlug={p.categorySlug} brand={p.brand} size="lg" className="w-full" />
        </div>

        <div className="glass flex flex-col gap-5 rounded-xl p-6 sm:p-8">
          <div>
            <p className="text-primary text-sm font-semibold">{p.brand}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-balance">{p.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.dietary.map((d) => (
                <span
                  key={d}
                  className="glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                >
                  <Leaf aria-hidden="true" className="text-success size-3.5" />
                  {t(`product.${d}`, { defaultValue: d })}
                </span>
              ))}
              {p.spiceLevel !== null && p.spiceLevel > 0 ? (
                <span className="glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
                  <Flame aria-hidden="true" className="text-danger size-3.5" />
                  {t(`product.spice_${p.spiceLevel}`)}
                </span>
              ) : null}
            </div>
          </div>
          <p className="text-text-muted leading-relaxed">{p.description}</p>
          <ProductPurchase locale={locale} productName={p.name} variants={p.variants} />
        </div>
      </div>

      {c && (
        <section aria-labelledby="details-title" className="glass mt-8 rounded-xl p-6 sm:p-8">
          <h2 id="details-title" className="text-xl font-semibold">
            {t('product.details')}
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-text-muted text-sm">{t('product.ingredients')}</dt>
              <dd lang="en">{c.ingredients}</dd>
            </div>
            <div>
              <dt className="text-text-muted text-sm">{t('product.contains')}</dt>
              <dd lang="en" className="font-semibold capitalize">
                {c.allergens.length ? c.allergens.join(', ') : '—'}
              </dd>
              {c.mayContain.length > 0 && (
                <>
                  <dt className="text-text-muted mt-3 text-sm">{t('product.mayContain')}</dt>
                  <dd lang="en" className="capitalize">
                    {c.mayContain.join(', ')}
                  </dd>
                </>
              )}
            </div>
            <div>
              <dt className="text-text-muted text-sm">{t('product.origin')}</dt>
              <dd>{c.countryOfOrigin}</dd>
            </div>
            <div>
              <dt className="text-text-muted text-sm">{t('product.brand')}</dt>
              <dd>{p.brand}</dd>
            </div>
          </dl>
          <p className="text-text-muted mt-6 text-sm">{t('product.labelNote')}</p>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-12">
          <h2 id="related-title" className="text-2xl font-semibold tracking-tight">
            {t('product.related')}
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {related.map((r) => (
              <li key={r.id}>
                <ProductCard product={r} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
