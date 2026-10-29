-- Milestone 3: catalog. Vendor-aware from day one (one house vendor at launch), variants with
-- per-location stock, and FDA-related product facts. Public read access; staff-only writes.

create type public.product_status as enum ('draft', 'active', 'archived');
create type public.shipping_class as enum ('ambient', 'chilled', 'frozen');

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_house boolean not null default false,
  stripe_account_id text,
  commission_bps integer not null default 0 check (commission_bps between 0 and 10000),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete set null,
  slug text not null unique,
  name_en text not null,
  name_ne text not null,
  sort integer not null default 0,
  is_active boolean not null default true
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id),
  brand_id uuid references public.brands (id),
  category_id uuid not null references public.categories (id),
  slug text not null unique,
  name_en text not null,
  name_ne text not null,
  description_en text not null default '',
  description_ne text not null default '',
  tags text[] not null default '{}',
  dietary text[] not null default '{}',
  spice_level smallint check (spice_level between 0 and 3),
  status public.product_status not null default 'draft',
  featured_rank integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category_id) where status = 'active';
create index products_featured_idx on public.products (featured_rank) where status = 'active';
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

create table public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  title_en text not null,
  title_ne text not null,
  price_cents integer not null check (price_cents >= 0),
  compare_at_cents integer check (compare_at_cents is null or compare_at_cents > price_cents),
  net_weight_g integer check (net_weight_g > 0),
  shipping_class public.shipping_class not null default 'ambient',
  sort integer not null default 0,
  is_active boolean not null default true
);
create index variants_product_idx on public.variants (product_id);

-- Facts the US label must carry; reviewed by staff before a product goes live (see docs/compliance.md).
create table public.product_compliance (
  product_id uuid primary key references public.products (id) on delete cascade,
  country_of_origin text not null,
  ingredients_en text not null default '',
  ingredients_ne text not null default '',
  allergens text[] not null default '{}',
  may_contain text[] not null default '{}',
  manufacturer_name text,
  importer_of_record text,
  fda_facility_reg_no text,
  english_label_verified boolean not null default false,
  reviewed_at timestamptz
);

create table public.stock_locations (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id),
  name text not null,
  kind text not null check (kind in ('warehouse', 'hub', 'pickup_point')),
  metro text,
  pickup_enabled boolean not null default false,
  local_delivery_enabled boolean not null default false
);

create table public.inventory_levels (
  variant_id uuid not null references public.variants (id) on delete cascade,
  location_id uuid not null references public.stock_locations (id) on delete cascade,
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  primary key (variant_id, location_id)
);

-- What storefronts read: total sellable units per variant across locations.
create view public.variant_stock
with (security_invoker = true) as
select v.id as variant_id, coalesce(sum(i.on_hand - i.reserved), 0)::integer as available
from public.variants v
left join public.inventory_levels i on i.variant_id = v.id
group by v.id;

-- RLS: shoppers (anon or signed in) read active catalog data; staff manage everything.
alter table public.vendors enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.product_compliance enable row level security;
alter table public.stock_locations enable row level security;
alter table public.inventory_levels enable row level security;

create policy "vendors: public read" on public.vendors for select to anon, authenticated using (true);
create policy "categories: public read active" on public.categories for select to anon, authenticated
  using (is_active or (select public.is_staff()));
create policy "brands: public read" on public.brands for select to anon, authenticated using (true);
create policy "products: public read active" on public.products for select to anon, authenticated
  using (status = 'active' or (select public.is_staff()));
create policy "variants: public read active" on public.variants for select to anon, authenticated
  using (
    (is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'active'))
    or (select public.is_staff())
  );
create policy "compliance: public read for active products" on public.product_compliance for select
  to anon, authenticated
  using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'active')
    or (select public.is_staff())
  );
create policy "stock_locations: public read" on public.stock_locations for select to anon, authenticated using (true);
create policy "inventory: public read" on public.inventory_levels for select to anon, authenticated using (true);

-- Staff write policies (admin dashboard, milestone 7).
create policy "categories: staff write" on public.categories for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "brands: staff write" on public.brands for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "products: staff write" on public.products for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "variants: staff write" on public.variants for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "compliance: staff write" on public.product_compliance for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "inventory: staff write" on public.inventory_levels for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.vendors, public.categories, public.brands, public.products, public.variants,
  public.product_compliance, public.stock_locations, public.inventory_levels, public.variant_stock
  to anon, authenticated;
grant insert, update, delete on public.categories, public.brands, public.products, public.variants,
  public.product_compliance, public.inventory_levels to authenticated;
