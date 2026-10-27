'use client';
import type { Locale } from '@ashan/i18n';
import { EmailSchema, OtpCodeSchema, UsPhoneSchema } from '@ashan/schemas';
import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useT } from '../../lib/i18n-client.ts';
import { safeNextPath } from '../../lib/safe-redirect.ts';
import { createSupabaseBrowserClient } from '../../lib/supabase/client.ts';
import { supabaseEnv } from '../../lib/supabase/env.ts';

type Channel = 'email' | 'phone';
type Step = { kind: 'enter' } | { kind: 'verify'; target: string };

const inputClass =
  'border-border bg-surface text-text placeholder:text-text-muted min-h-11 w-full rounded-md border px-3 text-base';
const primaryButton =
  'bg-primary text-primary-text hover:bg-primary-hover min-h-11 w-full rounded-md px-4 font-semibold disabled:opacity-60';
const secondaryButton =
  'border-border bg-surface text-text hover:bg-surface-muted min-h-11 w-full rounded-md border px-4 font-medium';

export function SignInForm({ locale }: { locale: Locale }) {
  const t = useT(locale);
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get('next'), `/${locale}/account`);
  const [channel, setChannel] = useState<Channel>('email');
  const [step, setStep] = useState<Step>({ kind: 'enter' });
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ids = { target: useId(), code: useId(), error: useId() };

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    const parsed =
      channel === 'email' ? EmailSchema.safeParse(value) : UsPhoneSchema.safeParse(value);
    if (!parsed.success) {
      setError(t(channel === 'email' ? 'auth.errorInvalidEmail' : 'auth.errorInvalidPhone'));
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const options = { shouldCreateUser: true, data: { locale } };
    const { error } =
      channel === 'email'
        ? await supabase.auth.signInWithOtp({ email: parsed.data, options })
        : await supabase.auth.signInWithOtp({ phone: parsed.data, options });
    setBusy(false);
    if (error) setError(t('auth.errorGeneric'));
    else setStep({ kind: 'verify', target: parsed.data });
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    if (step.kind !== 'verify') return;
    setError(null);
    const token = OtpCodeSchema.safeParse(code);
    if (!token.success) {
      setError(t('auth.errorInvalidCode'));
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } =
      channel === 'email'
        ? await supabase.auth.verifyOtp({ email: step.target, token: token.data, type: 'email' })
        : await supabase.auth.verifyOtp({ phone: step.target, token: token.data, type: 'sms' });
    setBusy(false);
    if (error) {
      setError(t('auth.errorInvalidCode'));
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function oauth(provider: 'apple' | 'google') {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const callback = new URL('/auth/callback', window.location.origin);
    callback.searchParams.set('next', next);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callback.toString() },
    });
    if (error) setError(t('auth.errorGeneric'));
  }

  if (!supabaseEnv()) {
    return (
      <p role="status" className="text-text-muted">
        {t('account.unavailable')}
      </p>
    );
  }

  const errorBox = error ? (
    <p id={ids.error} role="alert" className="text-danger text-sm">
      {error}
    </p>
  ) : null;

  if (step.kind === 'verify') {
    return (
      <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
        <p>
          {t('auth.codeSentTo', { target: step.target })}{' '}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => {
              setStep({ kind: 'enter' });
              setCode('');
              setError(null);
            }}
          >
            {t('auth.changeTarget')}
          </button>
        </p>
        <label htmlFor={ids.code} className="font-medium">
          {t('auth.codeLabel')}
        </label>
        <input
          id={ids.code}
          className={`${inputClass} tracking-[0.4em]`}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? ids.error : undefined}
          autoFocus
        />
        {errorBox}
        <button type="submit" className={primaryButton} disabled={busy}>
          {t('auth.verify')}
        </button>
        <button
          type="button"
          className={secondaryButton}
          onClick={() => void sendCode()}
          disabled={busy}
        >
          {t('auth.resend')}
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button type="button" className={secondaryButton} onClick={() => void oauth('apple')}>
        {t('auth.continueWithApple')}
      </button>
      <button type="button" className={secondaryButton} onClick={() => void oauth('google')}>
        {t('auth.continueWithGoogle')}
      </button>
      <p className="text-text-muted flex items-center gap-3 text-sm before:h-px before:flex-1 before:bg-current after:h-px after:flex-1 after:bg-current">
        {t('auth.or')}
      </p>
      <form onSubmit={sendCode} className="flex flex-col gap-4" noValidate>
        <label htmlFor={ids.target} className="font-medium">
          {t(channel === 'email' ? 'auth.emailLabel' : 'auth.phoneLabel')}
        </label>
        <input
          id={ids.target}
          className={inputClass}
          type={channel === 'email' ? 'email' : 'tel'}
          inputMode={channel === 'email' ? 'email' : 'tel'}
          autoComplete={channel === 'email' ? 'email' : 'tel-national'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? ids.error : undefined}
        />
        {errorBox}
        <button type="submit" className={primaryButton} disabled={busy}>
          {t('auth.sendCode')}
        </button>
      </form>
      <button
        type="button"
        className="text-primary self-start underline"
        onClick={() => {
          setChannel(channel === 'email' ? 'phone' : 'email');
          setValue('');
          setError(null);
        }}
      >
        {t(channel === 'email' ? 'auth.usePhone' : 'auth.useEmail')}
      </button>
      <p className="text-text-muted text-sm">{t('auth.legal')}</p>
    </div>
  );
}
