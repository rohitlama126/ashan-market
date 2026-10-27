'use client';
import { createI18n, type Locale } from '@ashan/i18n';
import { useMemo } from 'react';

export function useT(locale: Locale) {
  return useMemo(() => createI18n(locale).t, [locale]);
}
