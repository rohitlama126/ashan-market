import { describe, expect, it } from 'vitest';
import { createI18n, formatMoney, formatWeight, isLocale, resources } from './index.ts';

function keyPaths(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keyPaths(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('catalogs', () => {
  it('ne has exactly the same keys as en', () => {
    expect(keyPaths(resources.ne).sort()).toEqual(keyPaths(resources.en).sort());
  });

  it('keeps interpolation placeholders in sync', () => {
    const placeholders = (s: string) => (s.match(/{{\w+}}/g) ?? []).sort();
    const get = (obj: object, path: string) =>
      path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], obj) as string;
    for (const path of keyPaths(resources.en)) {
      expect(placeholders(get(resources.ne, path)), path).toEqual(
        placeholders(get(resources.en, path)),
      );
    }
  });
});

describe('createI18n', () => {
  it('translates and interpolates in both locales', () => {
    expect(createI18n('en').t('cart.freeShippingProgress', { amount: '$12.00' })).toBe(
      "You're $12.00 away from free shipping",
    );
    expect(createI18n('ne').t('nav.cart')).toBe('कार्ट');
  });
});

describe('isLocale', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('ne')).toBe(true);
    expect(isLocale('hi')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe('formatMoney', () => {
  it('formats integer cents as USD', () => {
    expect(formatMoney(1299)).toBe('$12.99');
    expect(formatMoney(0)).toBe('$0.00');
  });
  it('rejects fractional cents', () => {
    expect(() => formatMoney(12.5)).toThrow();
  });
});

describe('formatWeight', () => {
  it('shows metric and imperial', () => {
    expect(formatWeight(75)).toBe('75 g (2.6 oz)');
    expect(formatWeight(400)).toBe('400 g (14.1 oz)');
    expect(formatWeight(500)).toBe('500 g (1.1 lb)');
    expect(formatWeight(1000)).toBe('1 kg (2.2 lb)');
  });
});
