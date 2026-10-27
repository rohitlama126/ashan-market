import { createInstance, type i18n } from 'i18next';
import en from '../locales/en.json' with { type: 'json' };
import ne from '../locales/ne.json' with { type: 'json' };

export const locales = ['en', 'ne'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export type Messages = typeof en;
export const resources = { en, ne } satisfies Record<Locale, Messages>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Synchronously initialized i18next instance; safe to create per request (web) or once (mobile). */
export function createI18n(locale: Locale): i18n {
  const instance = createInstance();
  void instance.init({
    lng: locale,
    fallbackLng: defaultLocale,
    resources: { en: { translation: en }, ne: { translation: ne } },
    interpolation: { escapeValue: false },
    initAsync: false,
    returnNull: false,
  });
  return instance;
}

// Prices are always USD formatted for a US audience; Hermes and browsers agree on en-US output.
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(cents: number): string {
  if (!Number.isInteger(cents)) throw new Error(`Money must be integer cents, got ${cents}`);
  return usd.format(cents / 100);
}

const GRAMS_PER_OUNCE = 28.349523125;

/** "500 g (17.6 oz)": US labels need imperial; metric first matches Nepali packaging. */
export function formatWeight(grams: number): string {
  const oz = grams / GRAMS_PER_OUNCE;
  const metric = grams >= 1000 ? `${+(grams / 1000).toFixed(2)} kg` : `${Math.round(grams)} g`;
  const imperial = oz >= 16 ? `${+(oz / 16).toFixed(2)} lb` : `${+oz.toFixed(1)} oz`;
  return `${metric} (${imperial})`;
}
