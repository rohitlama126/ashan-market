// Pure domain rules shared by web, mobile and server. No I/O here.
import type { FulfillmentMethod, ShippingClass } from '@ashan/schemas';

export const DEFAULT_FREE_SHIPPING_THRESHOLD_CENTS = 4900;

export interface FreeShippingProgress {
  qualified: boolean;
  remainingCents: number;
  /** 0..1, for progress bars. */
  ratio: number;
}

export function freeShippingProgress(
  subtotalCents: number,
  thresholdCents: number = DEFAULT_FREE_SHIPPING_THRESHOLD_CENTS,
): FreeShippingProgress {
  const remainingCents = Math.max(0, thresholdCents - subtotalCents);
  return {
    qualified: remainingCents === 0,
    remainingCents,
    ratio: thresholdCents <= 0 ? 1 : Math.min(1, Math.max(0, subtotalCents / thresholdCents)),
  };
}

/** Chilled and frozen goods never go by parcel carrier; only local delivery or pickup. */
export function isMethodAllowed(shippingClass: ShippingClass, method: FulfillmentMethod): boolean {
  return shippingClass === 'ambient' || method !== 'ship';
}
