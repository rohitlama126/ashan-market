import Image from 'next/image';
import type { ProductImageView } from '../lib/catalog.ts';
import { ProductArt } from './product-art.tsx';

/** Square product photo, or the placeholder package art when no photo is uploaded yet. */
export function ProductImage({
  image,
  categorySlug,
  brand,
  sizes,
  size = 'md',
  priority = false,
  className = '',
}: {
  image: ProductImageView | null;
  categorySlug: string;
  brand: string;
  sizes: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
  className?: string;
}) {
  if (!image) {
    return (
      <ProductArt categorySlug={categorySlug} brand={brand} size={size} className={className} />
    );
  }
  return (
    <div className={`relative aspect-square overflow-hidden ${className}`}>
      <Image
        src={image.path}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

/** Attribution line required by Creative Commons licenses (CC0 needs none). */
export function ImageCredit({ image, label }: { image: ProductImageView | null; label: string }) {
  const c = image?.credit;
  if (!c?.license || /^cc0|public domain/i.test(c.license)) return null;
  return (
    <p className="text-text-muted px-4 py-2 text-xs">
      {label}:{' '}
      {c.sourceUrl ? (
        <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {c.author || 'Wikimedia Commons'}
        </a>
      ) : (
        c.author
      )}
      ,{' '}
      {c.licenseUrl ? (
        <a
          href={c.licenseUrl}
          target="_blank"
          rel="noopener noreferrer license"
          className="underline"
        >
          {c.license}
        </a>
      ) : (
        c.license
      )}
      {c.note ? ` (${c.note})` : ''}, via Wikimedia Commons
    </p>
  );
}
