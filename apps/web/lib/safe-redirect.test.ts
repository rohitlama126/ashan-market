import { describe, expect, it } from 'vitest';
import { safeNextPath } from './safe-redirect.ts';

describe('safeNextPath', () => {
  it('keeps same-origin paths', () => {
    expect(safeNextPath('/ne/account', '/en')).toBe('/ne/account');
  });
  it.each([null, '', 'https://evil.example', '//evil.example', '/\\evil.example'])(
    'falls back for %s',
    (next) => {
      expect(safeNextPath(next, '/en')).toBe('/en');
    },
  );
});
