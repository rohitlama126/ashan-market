import { createI18n, formatIdentifier, isLocale, type Locale } from '@ashan/i18n';
import { MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { CheckoutSummary } from '../../../components/checkout-summary.tsx';
import { createSupabaseServerClient } from '../../../lib/supabase/server.ts';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/checkout'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? { title: createI18n(locale).t('checkout.title'), robots: { index: false } }
    : {};
}

export default async function CheckoutPage({ params }: PageProps<'/[locale]/checkout'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">{t('checkout.title')}</h1>
      <Suspense>
        <CheckoutGate locale={locale} />
      </Suspense>
    </main>
  );
}

// Browsing and the cart are open to everyone; paying requires an account.
async function CheckoutGate({ locale }: { locale: Locale }) {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/${locale}/sign-in?next=/${locale}/checkout`);

  const { t } = createI18n(locale);
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, home_zip')
    .eq('id', data.user.id)
    .single();

  return (
    <div className="mt-6 flex flex-col gap-6">
      <section aria-labelledby="deliver-title" className="glass rounded-xl p-6">
        <h2 id="deliver-title" className="flex items-center gap-2 text-lg font-semibold">
          <MapPin aria-hidden="true" className="size-4" />
          {t('checkout.deliverTo')}
        </h2>
        <p className="mt-2 font-medium">{profile?.full_name || formatIdentifier(data.user)}</p>
        {profile?.home_zip ? (
          <p className="text-text-muted text-sm">ZIP {profile.home_zip}</p>
        ) : null}
        <p className="text-text-muted mt-2 text-sm">{t('checkout.noAddressYet')}</p>
      </section>
      <CheckoutSummary locale={locale} />
    </div>
  );
}
