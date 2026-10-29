-- pgTAP: catalog visibility and write protection. Run: pnpm db:test
begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

-- A draft product (with a variant) that shoppers must not see.
insert into public.products (vendor_id, category_id, slug, name_en, name_ne, status)
select v.id, c.id, 'secret-draft', 'Draft', 'ड्राफ्ट', 'draft'
from public.vendors v, public.categories c where v.slug = 'ashan-market' and c.slug = 'tea';
insert into public.variants (product_id, sku, title_en, title_ne, price_cents)
select id, 'TEST-DRAFT-1', 'One', 'एक', 100 from public.products where slug = 'secret-draft';

set local role anon;
select ok((select count(*) from public.products) >= 25, 'anon can browse active products');
select is((select count(*)::int from public.products where slug = 'secret-draft'), 0, 'anon cannot see drafts');
select is((select count(*)::int from public.variants where sku = 'TEST-DRAFT-1'), 0, 'anon cannot see variants of drafts');
select ok(
  (select available from public.variant_stock vs join public.variants v on v.id = vs.variant_id where v.sku = 'AM-001-1') > 0,
  'anon can read stock availability'
);
select throws_ok(
  $$ insert into public.brands (slug, name) values ('x', 'X') $$, '42501', null, 'anon cannot write catalog'
);
reset role;

-- A signed-in customer cannot change prices (RLS hides the row from UPDATE: 0 rows affected).
set local role authenticated;
set local request.jwt.claims = '{"sub":"0d3c0de0-0000-4000-8000-00000000a5a1","role":"authenticated"}';
update public.variants set price_cents = 1 where sku = 'AM-001-1';
select is((select count(*)::int from public.products where slug = 'secret-draft'), 0, 'customers cannot see drafts');
reset role;
select isnt((select price_cents from public.variants where sku = 'AM-001-1'), 1, 'customers cannot change prices');

select ok(
  (select bool_and(not english_label_verified) from public.product_compliance),
  'seed labels stay unverified until staff review them'
);

select * from finish();
rollback;
