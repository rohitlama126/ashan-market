'use client';
import type { Locale } from '@ashan/i18n';
import { Check, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cart } from '../lib/cart.ts';
import { useT } from '../lib/i18n-client.ts';

/** Quick add for product cards. Announces the result to screen readers. */
export function AddToCartButton({
  locale,
  variantId,
  productName,
  disabled,
}: {
  locale: Locale;
  variantId: string;
  productName: string;
  disabled?: boolean;
}) {
  const t = useT(locale);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(id);
  }, [added]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-label={`${t('product.addToCart')}: ${productName}`}
        onClick={() => {
          cart.add(variantId);
          setAdded(true);
        }}
        className="bg-primary text-primary-text hover:bg-primary-hover inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Plus aria-hidden="true" className="size-4" />
        )}
        {disabled ? t('product.outOfStock') : added ? t('product.added') : t('product.add')}
      </button>
      <span role="status" className="sr-only">
        {added ? `${t('product.added')}: ${productName}` : ''}
      </span>
    </>
  );
}
