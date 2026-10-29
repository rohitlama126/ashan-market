'use client';
import type { Locale } from '@ashan/i18n';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { countItems, useCart } from '../lib/cart.ts';
import { useT } from '../lib/i18n-client.ts';

export function CartLink({ locale }: { locale: Locale }) {
  const t = useT(locale);
  const count = countItems(useCart());
  return (
    <Link
      href={`/${locale}/cart`}
      aria-label={t('cart.linkLabel', { count })}
      className="glass-subtle hover:text-text relative inline-flex size-11 items-center justify-center rounded-full"
    >
      <ShoppingBag aria-hidden="true" className="size-5" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="bg-primary text-primary-text absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full px-1 text-xs font-bold"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
