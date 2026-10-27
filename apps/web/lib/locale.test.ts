import { describe, expect, it } from 'vitest';
import { localeFromPath, negotiateLocale } from './locale.ts';

describe('negotiateLocale', () => {
  it('defaults to English', () => {
    expect(negotiateLocale(null)).toBe('en');
    expect(negotiateLocale('fr-FR,fr;q=0.9')).toBe('en');
  });
  it('picks Nepali when preferred', () => {
    expect(negotiateLocale('ne-NP,ne;q=0.9,en;q=0.8')).toBe('ne');
  });
  it('respects q-values over order', () => {
    expect(negotiateLocale('en;q=0.5,ne;q=0.9')).toBe('ne');
    expect(negotiateLocale('ne;q=0,en-US')).toBe('en');
  });
});

describe('localeFromPath', () => {
  it('reads the first segment', () => {
    expect(localeFromPath('/ne/c/noodles')).toBe('ne');
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/')).toBeNull();
    expect(localeFromPath('/cart')).toBeNull();
  });
});
