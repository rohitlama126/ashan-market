import { createI18n, isLocale } from '@ashan/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SignInForm } from '../../../components/auth/sign-in-form.tsx';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/sign-in'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? { title: createI18n(locale).t('auth.signIn'), robots: { index: false } }
    : {};
}

export default async function SignInPage({ params }: PageProps<'/[locale]/sign-in'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t('auth.signInTitle')}</h1>
      {/* useSearchParams needs a Suspense boundary under Cache Components. */}
      <Suspense>
        <SignInForm locale={locale} />
      </Suspense>
    </main>
  );
}
