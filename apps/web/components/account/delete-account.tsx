'use client';
import type { Locale } from '@ashan/i18n';
import { useRef, useTransition } from 'react';
import { deleteAccount } from '../../app/[locale]/account/actions.ts';
import { useT } from '../../lib/i18n-client.ts';

export function DeleteAccount({ locale }: { locale: Locale }) {
  const t = useT(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="border-danger text-danger min-h-11 rounded-md border px-4 font-medium"
      >
        {t('account.deleteTitle')}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        className="bg-surface text-text m-auto max-w-md rounded-xl p-6 backdrop:bg-black/50"
      >
        <h2 id="delete-title" className="text-xl font-bold">
          {t('account.deleteTitle')}
        </h2>
        <p className="text-text-muted mt-3">{t('account.deleteBody')}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            className="border-border min-h-11 rounded-md border px-4"
          >
            {t('account.cancel')}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => deleteAccount(locale))}
            className="bg-danger text-primary-text min-h-11 rounded-md px-4 font-semibold disabled:opacity-60"
          >
            {t('account.deleteConfirm')}
          </button>
        </div>
      </dialog>
    </>
  );
}
