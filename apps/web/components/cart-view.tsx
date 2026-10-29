'use client';
import { freeShippingProgress } from '@ashan/core';
import { formatMoney, type Locale } from '@ashan/i18n';
import { Minus, Plus, Snowflake, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { cart, useCart, type CartItem } from '../lib/cart.ts';
import { getCartLines, type CartLineView } from '../lib/catalog.ts';
import { useT } from '../lib/i18n-client.ts';
import { ProductImage } from './product-image.tsx';

export interface PricedLine extends CartLineView {
  qty: number;
}

/** Joins the stored cart with live product data. `null` while loading. */
export function usePricedCart(locale: Locale): PricedLine[] | null {
  const items = useCart();
  const [lines, setLines] = useState<CartLineView[] | null>(null);
  const key = items
    .map((i) => i.variantId)
    .sort()
    .join(',');
  useEffect(() => {
    let cancelled = false;
    getCartLines(locale, key ? key.split(',') : [])
      .then((l) => !cancelled && setLines(l))
      .catch(() => !cancelled && setLines([]));
    return () => {
      cancelled = true;
    };
  }, [locale, key]);
  return useMemo(() => {
    if (!lines) return null;
    const byId = new Map(lines.map((l) => [l.variantId, l]));
    return items.flatMap((i: CartItem) => {
      const l = byId.get(i.variantId);
      return l ? [{ ...l, qty: i.qty }] : [];
    });
  }, [items, lines]);
}

export const subtotalOf = (lines: PricedLine[]) =>
  lines.reduce((s, l) => s + l.priceCents * l.qty, 0);

export function CartView({ locale }: { locale: Locale }) {
  const t = useT(locale);
  const lines = usePricedCart(locale);

  if (lines === null) {
    return (
      <p role="status" className="text-text-muted mt-6">
        {t('cart.loading')}
      </p>
    );
  }
  if (lines.length === 0) {
    return (
      <div className="glass mt-6 rounded-xl p-8 text-center">
        <p className="text-lg">{t('cart.empty')}</p>
        <Link
          href={`/${locale}`}
          className="bg-primary text-primary-text hover:bg-primary-hover mt-4 inline-flex min-h-11 items-center rounded-full px-5 font-semibold"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  const subtotal = subtotalOf(lines);
  const ship = freeShippingProgress(subtotal);
  const hasFrozen = lines.some((l) => l.shippingClass !== 'ambient');
  const units = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <ul className="flex flex-col gap-3">
        {lines.map((l) => (
          <li key={l.variantId} className="glass flex gap-4 rounded-lg p-3">
            <Link
              href={`/${locale}/p/${l.productSlug}`}
              className="w-20 shrink-0 overflow-hidden rounded-md sm:w-24"
            >
              <ProductImage
                image={l.image}
                categorySlug={l.categorySlug}
                brand={l.brand}
                size="sm"
                sizes="96px"
              />
              <span className="sr-only">{l.productName}</span>
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link
                href={`/${locale}/p/${l.productSlug}`}
                className="font-semibold hover:underline"
              >
                {l.productName}
              </Link>
              <p className="text-text-muted text-sm">
                {l.brand} · {l.variantTitle}
              </p>
              {l.shippingClass !== 'ambient' && (
                <p className="text-info flex items-center gap-1 text-xs">
                  <Snowflake aria-hidden="true" className="size-3.5" />
                  {t('product.frozenNote')}
                </p>
              )}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="glass-subtle inline-flex items-center rounded-full">
                  <button
                    type="button"
                    aria-label={`${t('product.decrease')}: ${l.productName}`}
                    onClick={() => cart.setQty(l.variantId, l.qty - 1)}
                    className="grid size-11 place-items-center rounded-full"
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </button>
                  <span aria-live="polite" className="w-8 text-center font-semibold">
                    {l.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`${t('product.increase')}: ${l.productName}`}
                    onClick={() => cart.setQty(l.variantId, l.qty + 1)}
                    disabled={l.qty >= l.available}
                    className="grid size-11 place-items-center rounded-full disabled:opacity-40"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <p className="font-bold">{formatMoney(l.priceCents * l.qty)}</p>
                <button
                  type="button"
                  onClick={() => cart.remove(l.variantId)}
                  className="text-text-muted hover:text-danger inline-flex min-h-11 items-center gap-1 text-sm"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  {t('cart.remove')}
                  <span className="sr-only">: {l.productName}</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside
        className="glass h-fit rounded-xl p-6 lg:sticky lg:top-24"
        aria-labelledby="cart-summary"
      >
        <h2 id="cart-summary" className="sr-only">
          {t('checkout.summary')}
        </h2>
        <div className="flex items-baseline justify-between">
          <span>
            {t('cart.subtotal')}{' '}
            <span className="text-text-muted text-sm">({t('cart.items', { count: units })})</span>
          </span>
          <span className="text-xl font-bold">{formatMoney(subtotal)}</span>
        </div>
        <div className="mt-4">
          <p className="text-sm">
            {ship.qualified
              ? t('cart.freeShippingUnlocked')
              : t('cart.freeShippingProgress', { amount: formatMoney(ship.remainingCents) })}
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(ship.ratio * 100)}
            aria-label={t('cart.freeShippingUnlocked')}
            className="bg-surface-muted mt-2 h-2 overflow-hidden rounded-full"
          >
            <div
              className="bg-success h-full rounded-full transition-all"
              style={{ width: `${ship.ratio * 100}%` }}
            />
          </div>
        </div>
        {hasFrozen && <p className="text-info mt-4 text-sm">{t('cart.frozenWarning')}</p>}
        <p className="text-text-muted mt-4 text-sm">{t('cart.shippingAtCheckout')}</p>
        <Link
          href={`/${locale}/checkout`}
          className="bg-primary text-primary-text hover:bg-primary-hover mt-5 flex min-h-12 w-full items-center justify-center rounded-full font-semibold"
        >
          {t('cart.checkout')}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-primary mt-3 block text-center text-sm font-medium underline"
        >
          {t('cart.continueShopping')}
        </Link>
      </aside>
    </div>
  );
}
