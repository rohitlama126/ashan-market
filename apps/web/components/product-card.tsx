import { createI18n, formatMoney, type Locale } from '@ashan/i18n';
import Link from 'next/link';
import type { ProductCardView } from '../lib/catalog.ts';
import { AddToCartButton } from './add-to-cart-button.tsx';
import { ProductImage } from './product-image.tsx';

export function ProductCard({ product, locale }: { product: ProductCardView; locale: Locale }) {
  const { t } = createI18n(locale);
  const v = product.variants[0];
  if (!v) return null;
  const href = `/${locale}/p/${product.slug}`;
  const priceLabel =
    product.variants.length > 1
      ? t('product.from', { price: formatMoney(v.priceCents) })
      : formatMoney(v.priceCents);

  return (
    <article className="glass group relative flex h-full flex-col overflow-hidden rounded-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <ProductImage
        image={product.image}
        categorySlug={product.categorySlug}
        brand={product.brand}
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
        className="w-full"
      />
      {v.compareAtCents ? (
        <span className="bg-sale text-primary-text absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-bold">
          {t('product.save', { amount: formatMoney(v.compareAtCents - v.priceCents) })}
        </span>
      ) : null}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-text-muted text-xs font-medium">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
          {/* The whole card is clickable through this link's ::after overlay. */}
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="text-text-muted text-xs">{v.title}</p>
        <p className="mt-auto pt-1 font-bold">
          {priceLabel}
          {v.compareAtCents ? (
            <s className="text-text-muted ml-1.5 text-xs font-normal">
              {formatMoney(v.compareAtCents)}
            </s>
          ) : null}
        </p>
        {/* Sits above the link overlay so it stays clickable on its own. */}
        <div className="relative z-10 pt-1">
          <AddToCartButton
            locale={locale}
            variantId={v.id}
            productName={`${product.name}, ${v.title}`}
            disabled={v.available <= 0}
          />
        </div>
      </div>
    </article>
  );
}
