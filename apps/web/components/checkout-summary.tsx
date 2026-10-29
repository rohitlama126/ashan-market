'use client';
import { formatMoney, type Locale } from '@ashan/i18n';
import { CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { useT } from '../lib/i18n-client.ts';
import { subtotalOf, usePricedCart } from './cart-view.tsx';

export function CheckoutSummary({ locale }: { locale: Locale }) {
  const t = useT(locale);
  const lines = usePricedCart(locale);

  if (lines === null) return <p role="status">{t('cart.loading')}</p>;
  if (lines.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <p>{t('cart.empty')}</p>
        <Link
          href={`/${locale}`}
          className="text-primary mt-2 inline-block font-semibold underline"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="summary-title" className="glass rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h2 id="summary-title" className="text-lg font-semibold">
            {t('checkout.summary')}
          </h2>
          <Link href={`/${locale}/cart`} className="text-primary text-sm font-medium underline">
            {t('checkout.editCart')}
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-[color-mix(in_oklab,var(--color-text)_10%,transparent)]">
          {lines.map((l) => (
            <li key={l.variantId} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                <span className="font-medium">{l.productName}</span>
                <span className="text-text-muted block">
                  {l.variantTitle} × {l.qty}
                </span>
              </span>
              <span className="font-semibold">{formatMoney(l.priceCents * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-[color-mix(in_oklab,var(--color-text)_15%,transparent)] pt-3 font-bold">
          <span>{t('cart.subtotal')}</span>
          <span>{formatMoney(subtotalOf(lines))}</span>
        </div>
        <p className="text-text-muted mt-2 text-sm">{t('cart.shippingAtCheckout')}</p>
      </section>

      <section aria-labelledby="payment-title" className="glass rounded-xl p-6">
        <h2 id="payment-title" className="flex items-center gap-2 text-lg font-semibold">
          <Lock aria-hidden="true" className="size-4" />
          {t('checkout.payment')}
        </h2>
        <p className="text-text-muted mt-2 text-sm">{t('checkout.paymentSoon')}</p>
        <button
          type="button"
          disabled
          className="bg-primary text-primary-text mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-semibold opacity-50"
        >
          <CreditCard aria-hidden="true" className="size-5" />
          {t('checkout.placeOrder')}
        </button>
      </section>
    </div>
  );
}
