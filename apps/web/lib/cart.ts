// Guest cart kept in localStorage, so shoppers can add items before signing in. It stores only
// variant ids and quantities; prices are always re-read from the database. Moves server-side at
// checkout (milestone 5).
import { useSyncExternalStore } from 'react';

export interface CartItem {
  variantId: string;
  qty: number;
}

export const MAX_QTY = 99;
const KEY = 'am_cart_v1';
const listeners = new Set<() => void>();
const EMPTY: CartItem[] = [];
let cache: CartItem[] | null = null;

// ── Pure helpers (unit-tested) ────────────────────────────────────────────
export function addTo(items: CartItem[], variantId: string, qty = 1): CartItem[] {
  const existing = items.find((i) => i.variantId === variantId);
  if (!existing) return [...items, { variantId, qty: clampQty(qty) }];
  return items.map((i) => (i.variantId === variantId ? { ...i, qty: clampQty(i.qty + qty) } : i));
}

export function setQtyIn(items: CartItem[], variantId: string, qty: number): CartItem[] {
  if (qty <= 0) return items.filter((i) => i.variantId !== variantId);
  return items.map((i) => (i.variantId === variantId ? { ...i, qty: clampQty(qty) } : i));
}

export function countItems(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.flatMap((i) =>
      i && typeof i.variantId === 'string' && Number.isInteger(i.qty) && i.qty > 0
        ? [{ variantId: i.variantId, qty: clampQty(i.qty) }]
        : [],
    );
  } catch {
    return [];
  }
}

function clampQty(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.floor(qty)));
}

// ── Store ─────────────────────────────────────────────────────────────────
function read(): CartItem[] {
  if (cache) return cache;
  try {
    cache = parseCart(window.localStorage.getItem(KEY));
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Private mode / storage disabled: the cart still works for this page session.
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export const cart = {
  add: (variantId: string, qty = 1) => write(addTo(read(), variantId, qty)),
  setQty: (variantId: string, qty: number) => write(setQtyIn(read(), variantId, qty)),
  remove: (variantId: string) => write(setQtyIn(read(), variantId, 0)),
  clear: () => write([]),
};

/** Cart items; empty during server rendering. */
export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
