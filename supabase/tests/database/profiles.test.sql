-- pgTAP: profiles trigger, RLS, column privileges and account deletion. Run: pnpm db:test
begin;
create extension if not exists pgtap with schema extensions;
select plan(17);

-- Fixtures: two customers and one staff member.
insert into auth.users (id, email, raw_user_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'sita@example.com', '{"full_name":"Sita Gurung","locale":"ne"}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'ram@example.com', '{"name":"Ram Thapa"}', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'staff@example.com', '{}', 'authenticated', 'authenticated');
update public.profiles set role = 'staff' where id = '33333333-3333-3333-3333-333333333333';

-- Trigger
select results_eq(
  $$ select full_name, locale from public.profiles where id = '11111111-1111-1111-1111-111111111111' $$,
  $$ values ('Sita Gurung'::text, 'ne'::text) $$,
  'sign-up creates a profile from full_name + locale metadata'
);
select is(
  (select full_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  'Ram Thapa', 'falls back to the provider "name" field'
);
select is(
  (select locale from public.profiles where id = '33333333-3333-3333-3333-333333333333'),
  'en', 'defaults locale to en'
);
select is(
  (select role::text from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'customer', 'new users are customers'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'RLS is enabled on profiles'
);

-- Anonymous visitors
set local role anon;
select throws_ok(
  $$ select * from public.profiles $$, '42501', null, 'anon cannot read profiles'
);
select throws_ok(
  $$ select public.delete_my_account() $$, '42501', null, 'anon cannot call delete_my_account'
);
reset role;

-- Customer Sita
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((select count(*)::int from public.profiles), 1, 'a customer sees only their own profile');
select ok(not public.is_staff(), 'customer is not staff');

update public.profiles set full_name = 'Sita G.', home_zip = '11372' where id = '11111111-1111-1111-1111-111111111111';
select is(
  (select full_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Sita G.', 'a customer can update their own name'
);
select throws_ok(
  $$ update public.profiles set role = 'admin' where id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'a customer cannot change their role'
);
update public.profiles set full_name = 'hacked' where id = '22222222-2222-2222-2222-222222222222';
reset role;
select is(
  (select full_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  'Ram Thapa', 'a customer cannot update someone else''s profile'
);
select throws_ok(
  $$ update public.profiles set home_zip = '1137' where id = '11111111-1111-1111-1111-111111111111' $$,
  '23514', null, 'ZIP must be 5 digits'
);

-- Staff
set local role authenticated;
set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
select is(
  (select count(*)::int from public.profiles where id in (
    '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333')),
  3, 'staff can read every profile, not just their own'
);
reset role;

-- Account deletion
set local role authenticated;
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select lives_ok($$ select public.delete_my_account() $$, 'a customer can delete their account');
reset role;
select is(
  (select count(*)::int from auth.users where id = '22222222-2222-2222-2222-222222222222'),
  0, 'the auth user is gone'
);
select is(
  (select count(*)::int from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  0, 'the profile is deleted with it'
);

select * from finish();
rollback;
