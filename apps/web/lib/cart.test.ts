import { describe, expect, it } from 'vitest';
import { addTo, countItems, MAX_QTY, parseCart, setQtyIn } from './cart.ts';

describe('cart helpers', () => {
  it('adds a new line and increments an existing one', () => {
    const one = addTo([], 'v1');
    expect(one).toEqual([{ variantId: 'v1', qty: 1 }]);
    expect(addTo(one, 'v1', 2)).toEqual([{ variantId: 'v1', qty: 3 }]);
    expect(addTo(one, 'v2')).toHaveLength(2);
  });

  it('caps quantity', () => {
    expect(addTo([{ variantId: 'v1', qty: MAX_QTY }], 'v1', 5)[0]?.qty).toBe(MAX_QTY);
  });

  it('setting quantity to zero removes the line', () => {
    expect(setQtyIn([{ variantId: 'v1', qty: 2 }], 'v1', 0)).toEqual([]);
    expect(setQtyIn([{ variantId: 'v1', qty: 2 }], 'v1', 5)).toEqual([{ variantId: 'v1', qty: 5 }]);
  });

  it('counts units, not lines', () => {
    expect(
      countItems([
        { variantId: 'a', qty: 2 },
        { variantId: 'b', qty: 3 },
      ]),
    ).toBe(5);
  });

  it('parses stored JSON defensively', () => {
    expect(parseCart(null)).toEqual([]);
    expect(parseCart('not json')).toEqual([]);
    expect(parseCart('{"a":1}')).toEqual([]);
    expect(parseCart('[{"variantId":"v1","qty":2},{"variantId":"v2","qty":-1},{"qty":3}]')).toEqual(
      [{ variantId: 'v1', qty: 2 }],
    );
  });
});
