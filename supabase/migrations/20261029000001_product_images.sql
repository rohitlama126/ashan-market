-- Product photos, with the attribution that openly licensed images require.
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  path text not null,
  alt_en text not null,
  alt_ne text not null,
  sort integer not null default 0,
  credit_author text,
  credit_license text,
  credit_license_url text,
  credit_source_url text,
  credit_note text
);
create index product_images_product_idx on public.product_images (product_id, sort);

alter table public.product_images enable row level security;
create policy "product_images: public read for active products" on public.product_images for select
  to anon, authenticated
  using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'active')
    or (select public.is_staff())
  );
create policy "product_images: staff write" on public.product_images for all to authenticated
  using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;
