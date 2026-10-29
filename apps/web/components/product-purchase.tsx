'use client';
import { formatMoney, type Locale } from '@ashan/i18n';
import { Check, Minus, Plus, Snowflake, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import type { VariantView } from '../lib/catalog.ts';
import { cart, MAX_QTY } from '../lib/cart.ts';
import { useT } from '../lib/i18n-client.ts';

export function ProductPurchase({
  locale,
  productName,
  variants,
}: {
  locale: Locale;
  productName: string;
  variants: VariantView[];
}) {
  const t = useT(locale);
  const router = useRouter();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const ids = { size: useId(), qty: useId() };
  const v = variants.find((x) => x.id === variantId) ?? variants[0];
  if (!v) return null;

  const max = Math.max(0, Math.min(MAX_QTY, v.available));
  const soldOut = max === 0;
  const add = () => {
    cart.add(v.id, qty);
    setAdded(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatMoney(v.priceCents)}</span>
        {v.compareAtCents ? (
          <>
            <s className="text-text-muted">{formatMoney(v.compareAtCents)}</s>
            <span className="bg-sale text-primary-text rounded-full px-2 py-0.5 text-xs font-bold">
              {t('product.save', { amount: formatMoney(v.compareAtCents - v.priceCents) })}
            </span>
          </>
        ) : null}
      </p>

      {variants.length > 1 && (
        <fieldset>
          <legend id={ids.size} className="mb-2 font-medium">
            {t('product.size')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((option) => (
              <label
                key={option.id}
                className="glass-subtle has-[:checked]:border-primary has-[:checked]:text-primary has-[:focus-visible]:outline-focus inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 px-4 text-sm font-medium has-[:focus-visible]:outline-3"
              >
                <input
                  type="radio"
                  name="variant"
                  value={option.id}
                  checked={option.id === variantId}
                  onChange={() => {
                    setVariantId(option.id);
                    setQty(1);
                    setAdded(false);
                  }}
                  className="sr-only"
                />
                {option.title} · {formatMoney(option.priceCents)}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor={ids.qty} className="mb-2 block font-medium">
          {t('product.quantity')}
        </label>
        <div className="glass-subtle inline-flex items-center rounded-full">
          <button
            type="button"
            aria-label={t('product.decrease')}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="grid size-11 place-items-center rounded-full disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>
          <input
            id={ids.qty}
            inputMode="numeric"
            value={qty}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/\D/g, ''));
              setQty(Math.max(1, Math.min(max || 1, n || 1)));
            }}
            className="w-12 bg-transparent text-center font-semibold"
          />
          <button
            type="button"
            aria-label={t('product.increase')}
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max}
            className="grid size-11 place-items-center rounded-full disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
        <p className={`mt-2 text-sm ${soldOut ? 'text-danger' : 'text-success'}`}>
          {soldOut
            ? t('product.outOfStock')
            : v.available <= 10
              ? t('product.lowStock', { count: v.available })
              : t('product.inStock')}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={add}
          disabled={soldOut}
          className="bg-primary text-primary-text hover:bg-primary-hover inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 font-semibold transition disabled:opacity-50"
        >
          {added ? <Check aria-hidden="true" className="size-5" /> : null}
          {added ? t('product.added') : t('product.addToCart')}
        </button>
        <button
          type="button"
          onClick={() => {
            add();
            router.push(`/${locale}/checkout`);
          }}
          disabled={soldOut}
          className="border-primary text-primary hover:bg-primary/10 inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-semibold transition disabled:opacity-50"
        >
          {t('product.buyNow')}
        </button>
      </div>
      <p role="status" className="text-sm">
        {added ? (
          <>
            {t('product.added')}: {productName} ×{qty}.{' '}
            <Link href={`/${locale}/cart`} className="text-primary font-semibold underline">
              {t('product.viewCart')}
            </Link>
          </>
        ) : null}
      </p>

      <p className="text-text-muted flex items-center gap-2 text-sm">
        {v.shippingClass === 'ambient' ? (
          <>
            <Truck aria-hidden="true" className="size-4 shrink-0" />
            {t('product.shipsNationwide')}
          </>
        ) : (
          <>
            <Snowflake aria-hidden="true" className="text-info size-4 shrink-0" />
            {t('product.frozenNote')}
          </>
        )}
      </p>
    </div>
  );
}
