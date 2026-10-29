// Catalog reads shared by server and client. All queries use the anon key and rely on RLS
// (only active products are visible), so they are safe in the browser too.
import type { Database } from '@ashan/db';
import type { Locale } from '@ashan/i18n';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireSupabaseEnv } from './supabase/env.ts';

type Client = SupabaseClient<Database>;
type ShippingClass = Database['public']['Enums']['shipping_class'];

export interface VariantView {
  id: string;
  title: string;
  priceCents: number;
  compareAtCents: number | null;
  netWeightG: number | null;
  shippingClass: ShippingClass;
  available: number;
}

export interface ProductCardView {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  variants: VariantView[];
}

export interface ProductDetailView extends ProductCardView {
  description: string;
  dietary: string[];
  spiceLevel: number | null;
  compliance: {
    countryOfOrigin: string;
    ingredients: string;
    allergens: string[];
    mayContain: string[];
    manufacturer: string | null;
    labelVerified: boolean;
  } | null;
}

let catalogClient: Client | null = null;

/** Shared cookie-less anon client for public catalog reads, on the server or in the browser.
 *  It never holds a session, and uses its own storage key so it can't clash with the auth client. */
export function createCatalogClient(): Client {
  if (catalogClient) return catalogClient;
  const { url, anonKey } = requireSupabaseEnv();
  catalogClient = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'am-catalog',
    },
  });
  return catalogClient;
}

const PRODUCT_SELECT = `
  id, slug, name_en, name_ne, description_en, description_ne, tags, dietary, spice_level, featured_rank,
  brands ( name ),
  categories ( slug, name_en, name_ne ),
  variants ( id, title_en, title_ne, price_cents, compare_at_cents, net_weight_g, shipping_class, sort, is_active )
`;

type ProductRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ne: string;
  description_en: string;
  description_ne: string;
  tags: string[];
  dietary: string[];
  spice_level: number | null;
  brands: { name: string } | null;
  categories: { slug: string; name_en: string; name_ne: string } | null;
  variants: {
    id: string;
    title_en: string;
    title_ne: string;
    price_cents: number;
    compare_at_cents: number | null;
    net_weight_g: number | null;
    shipping_class: ShippingClass;
    sort: number;
    is_active: boolean;
  }[];
};

async function stockFor(client: Client, variantIds: string[]): Promise<Map<string, number>> {
  if (variantIds.length === 0) return new Map();
  const { data, error } = await client
    .from('variant_stock')
    .select('variant_id, available')
    .in('variant_id', variantIds);
  if (error) throw error;
  return new Map((data ?? []).map((r) => [r.variant_id ?? '', r.available ?? 0]));
}

function toCard(row: ProductRow, locale: Locale, stock: Map<string, number>): ProductCardView {
  const ne = locale === 'ne';
  return {
    id: row.id,
    slug: row.slug,
    name: ne ? row.name_ne : row.name_en,
    brand: row.brands?.name ?? '',
    categorySlug: row.categories?.slug ?? '',
    categoryName: (ne ? row.categories?.name_ne : row.categories?.name_en) ?? '',
    tags: row.tags,
    variants: row.variants
      .filter((v) => v.is_active)
      .sort((a, b) => a.sort - b.sort)
      .map((v) => ({
        id: v.id,
        title: ne ? v.title_ne : v.title_en,
        priceCents: v.price_cents,
        compareAtCents: v.compare_at_cents,
        netWeightG: v.net_weight_g,
        shippingClass: v.shipping_class,
        available: stock.get(v.id) ?? 0,
      })),
  };
}

export async function getFeaturedProducts(locale: Locale, limit = 25): Promise<ProductCardView[]> {
  const client = createCatalogClient();
  const { data, error } = await client
    .from('products')
    .select(PRODUCT_SELECT)
    .order('featured_rank', { ascending: true, nullsFirst: false })
    .limit(limit)
    .overrideTypes<ProductRow[], { merge: false }>();
  if (error) throw error;
  const stock = await stockFor(
    client,
    data.flatMap((p) => p.variants.map((v) => v.id)),
  );
  return data.map((row) => toCard(row, locale, stock));
}

export async function getProduct(
  locale: Locale,
  slug: string,
): Promise<{ product: ProductDetailView; related: ProductCardView[] } | null> {
  const client = createCatalogClient();
  const { data: row, error } = await client
    .from('products')
    .select(
      `${PRODUCT_SELECT}, category_id,
       product_compliance ( country_of_origin, ingredients_en, ingredients_ne, allergens, may_contain, manufacturer_name, english_label_verified )`,
    )
    .eq('slug', slug)
    .maybeSingle()
    .overrideTypes<
      | (ProductRow & {
          category_id: string;
          product_compliance: {
            country_of_origin: string;
            ingredients_en: string;
            ingredients_ne: string;
            allergens: string[];
            may_contain: string[];
            manufacturer_name: string | null;
            english_label_verified: boolean;
          } | null;
        })
      | null,
      { merge: false }
    >();
  if (error) throw error;
  if (!row) return null;

  const { data: relatedRows, error: relatedError } = await client
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category_id', row.category_id)
    .neq('id', row.id)
    .order('featured_rank', { ascending: true })
    .limit(5)
    .overrideTypes<ProductRow[], { merge: false }>();
  if (relatedError) throw relatedError;

  const ids = [row, ...relatedRows].flatMap((p) => p.variants.map((v) => v.id));
  const stock = await stockFor(client, ids);
  const ne = locale === 'ne';
  const c = row.product_compliance;
  return {
    product: {
      ...toCard(row, locale, stock),
      description: ne ? row.description_ne : row.description_en,
      dietary: row.dietary,
      spiceLevel: row.spice_level,
      compliance: c && {
        countryOfOrigin: c.country_of_origin,
        ingredients: (ne && c.ingredients_ne) || c.ingredients_en,
        allergens: c.allergens,
        mayContain: c.may_contain,
        manufacturer: c.manufacturer_name,
        labelVerified: c.english_label_verified,
      },
    },
    related: relatedRows.map((r) => toCard(r, locale, stock)),
  };
}

export interface CartLineView {
  variantId: string;
  productSlug: string;
  productName: string;
  brand: string;
  categorySlug: string;
  variantTitle: string;
  priceCents: number;
  compareAtCents: number | null;
  shippingClass: ShippingClass;
  available: number;
}

/** Current details for the variants in a cart (prices always come from the database). */
export async function getCartLines(locale: Locale, variantIds: string[]): Promise<CartLineView[]> {
  if (variantIds.length === 0) return [];
  const client = createCatalogClient();
  const { data, error } = await client
    .from('variants')
    .select(
      'id, title_en, title_ne, price_cents, compare_at_cents, shipping_class, products ( slug, name_en, name_ne, brands ( name ), categories ( slug ) )',
    )
    .in('id', variantIds)
    .overrideTypes<
      {
        id: string;
        title_en: string;
        title_ne: string;
        price_cents: number;
        compare_at_cents: number | null;
        shipping_class: ShippingClass;
        products: {
          slug: string;
          name_en: string;
          name_ne: string;
          brands: { name: string } | null;
          categories: { slug: string } | null;
        } | null;
      }[],
      { merge: false }
    >();
  if (error) throw error;
  const stock = await stockFor(client, variantIds);
  const ne = locale === 'ne';
  return data.map((v) => ({
    variantId: v.id,
    productSlug: v.products?.slug ?? '',
    productName: (ne ? v.products?.name_ne : v.products?.name_en) ?? '',
    brand: v.products?.brands?.name ?? '',
    categorySlug: v.products?.categories?.slug ?? '',
    variantTitle: ne ? v.title_ne : v.title_en,
    priceCents: v.price_cents,
    compareAtCents: v.compare_at_cents,
    shippingClass: v.shipping_class,
    available: stock.get(v.id) ?? 0,
  }));
}
