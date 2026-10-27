import { createI18n, isLocale, type Locale } from '@ashan/i18n';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DeleteAccount } from '../../../components/account/delete-account.tsx';
import { ProfileForm } from '../../../components/account/profile-form.tsx';
import { supabaseEnv } from '../../../lib/supabase/env.ts';
import { createSupabaseServerClient } from '../../../lib/supabase/server.ts';
import { signOut } from './actions.ts';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/account'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? { title: createI18n(locale).t('account.title'), robots: { index: false } }
    : {};
}

export default async function AccountPage({ params }: PageProps<'/[locale]/account'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = createI18n(locale);
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold">{t('account.title')}</h1>
      <Suspense>
        <AccountDetails locale={locale} />
      </Suspense>
    </main>
  );
}

// Reads cookies, so it renders per request inside the Suspense boundary.
async function AccountDetails({ locale }: { locale: Locale }) {
  const { t } = createI18n(locale);
  if (!supabaseEnv()) {
    return (
      <p role="status" className="text-text-muted mt-4">
        {t('account.unavailable')}
      </p>
    );
  }
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/${locale}/sign-in?next=/${locale}/account`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  if (!profile) redirect(`/${locale}/sign-in`);
  const identifier = data.user.email ?? data.user.phone ?? '';

  return (
    <>
      <p className="text-text-muted mt-2">{t('account.signedInAs', { identifier })}</p>
      <section
        aria-labelledby="profile-title"
        className="bg-surface border-border mt-8 rounded-xl border p-6"
      >
        <h2 id="profile-title" className="mb-4 text-xl font-semibold">
          {t('account.profile')}
        </h2>
        <ProfileForm locale={locale} profile={profile} />
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <form action={signOut.bind(null, locale)}>
          <button
            type="submit"
            className="border-border min-h-11 rounded-md border px-4 font-medium"
          >
            {t('auth.signOut')}
          </button>
        </form>
        <DeleteAccount locale={locale} />
      </div>
    </>
  );
}
