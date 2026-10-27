import { createI18n, defaultLocale, isLocale, type Locale } from '@ashan/i18n';
import { getLocales } from 'expo-localization';
import { useMemo, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

export function deviceLocale(): Locale {
  const code = getLocales()[0]?.languageCode;
  return isLocale(code) ? code : defaultLocale;
}

export function I18nProvider({ children, locale }: { children: ReactNode; locale?: Locale }) {
  const i18n = useMemo(() => createI18n(locale ?? deviceLocale()), [locale]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
