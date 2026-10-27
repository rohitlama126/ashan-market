'use client';
import type { Profile } from '@ashan/db';
import { locales, type Locale } from '@ashan/i18n';
import { useActionState, useId } from 'react';
import { updateProfile, type ProfileFormState } from '../../app/[locale]/account/actions.ts';
import { useT } from '../../lib/i18n-client.ts';

const field = 'border-border bg-surface text-text min-h-11 w-full rounded-md border px-3';

export function ProfileForm({ locale, profile }: { locale: Locale; profile: Profile }) {
  const t = useT(locale);
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(updateProfile, {
    status: 'idle',
  });
  const id = useId();
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-name`} className="font-medium">
          {t('account.fullName')}
        </label>
        <input
          id={`${id}-name`}
          name="full_name"
          autoComplete="name"
          maxLength={100}
          defaultValue={profile.full_name ?? ''}
          className={field}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-zip`} className="font-medium">
          {t('account.homeZip')}
        </label>
        <input
          id={`${id}-zip`}
          name="home_zip"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="\d{5}"
          maxLength={5}
          defaultValue={profile.home_zip ?? ''}
          className={`${field} max-w-40`}
        />
      </div>
      <fieldset className="flex flex-col gap-1">
        <legend className="font-medium">{t('language.label')}</legend>
        <div className="flex gap-4">
          {locales.map((l) => (
            <label key={l} lang={l} className="flex min-h-11 items-center gap-2">
              <input type="radio" name="locale" value={l} defaultChecked={profile.locale === l} />
              {t(`language.${l}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex min-h-11 items-center gap-3">
        <input type="checkbox" name="marketing_opt_in" defaultChecked={profile.marketing_opt_in} />
        {t('account.marketing')}
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-primary-text hover:bg-primary-hover min-h-11 rounded-md px-6 font-semibold disabled:opacity-60"
        >
          {t('account.save')}
        </button>
        <p role="status" className={state.status === 'error' ? 'text-danger' : 'text-success'}>
          {state.status === 'saved' && t('account.saved')}
          {state.status === 'error' && t('account.errorSave')}
        </p>
      </div>
    </form>
  );
}
