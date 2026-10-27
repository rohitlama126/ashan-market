import { describe, expect, it } from 'vitest';
import { freeShippingProgress, isMethodAllowed } from './index.ts';

describe('freeShippingProgress', () => {
  it('reports remaining amount below the threshold', () => {
    expect(freeShippingProgress(3700, 4900)).toEqual({
      qualified: false,
      remainingCents: 1200,
      ratio: 3700 / 4900,
    });
  });
  it('qualifies at and above the threshold', () => {
    expect(freeShippingProgress(4900, 4900).qualified).toBe(true);
    expect(freeShippingProgress(8000, 4900)).toEqual({
      qualified: true,
      remainingCents: 0,
      ratio: 1,
    });
  });
  it('handles an empty cart and a zero threshold', () => {
    expect(freeShippingProgress(0).ratio).toBe(0);
    expect(freeShippingProgress(0, 0).qualified).toBe(true);
  });
});

describe('isMethodAllowed', () => {
  it('ships ambient goods by any method', () => {
    expect(isMethodAllowed('ambient', 'ship')).toBe(true);
    expect(isMethodAllowed('ambient', 'pickup')).toBe(true);
  });
  it('keeps frozen and chilled goods local', () => {
    expect(isMethodAllowed('frozen', 'ship')).toBe(false);
    expect(isMethodAllowed('chilled', 'ship')).toBe(false);
    expect(isMethodAllowed('frozen', 'local_delivery')).toBe(true);
    expect(isMethodAllowed('chilled', 'pickup')).toBe(true);
  });
});
