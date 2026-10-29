import { createI18n, isLocale } from '@ashan/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CartView } from '../../../components/cart-view.tsx';

export async function generateMetadata({ params }: PageProps<'/[locale]/cart'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? { title: createI18n(locale).t('cart.title'), robots: { index: false } }
    : {};
}

export default async function CartPage({ params }: PageProps<'/[locale]/cart'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">{t('cart.title')}</h1>
      <CartView locale={locale} />
    </main>
  );
}
