-- Milestone 2: profiles, roles, RLS, and self-service account deletion.

create type public.user_role as enum ('customer', 'staff', 'admin');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 100),
  phone text check (phone ~ '^\+1\d{10}$'),
  locale text not null default 'en' check (locale in ('en', 'ne')),
  home_zip text check (home_zip ~ '^\d{5}$'),
  marketing_opt_in boolean not null default false,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user. Created by trigger on sign-up; deleted with the auth user.';

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Role checks used by RLS across the schema. SECURITY DEFINER avoids recursive RLS on profiles.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('staff', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Create a profile for every new auth user. Name comes from email sign-up metadata or the
-- OAuth provider (Google sends full_name/name; Apple sends a name only on first sign-in).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, full_name, locale)
  values (
    new.id,
    left(nullif(trim(coalesce(meta ->> 'full_name', meta ->> 'name', '')), ''), 100),
    case when meta ->> 'locale' in ('en', 'ne') then meta ->> 'locale' else 'en' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS: users see and edit only their own profile; staff can read all profiles.
alter table public.profiles enable row level security;

create policy "profiles: read own or staff"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or (select public.is_staff()));

create policy "profiles: update own"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "profiles: admin updates any"
on public.profiles for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Column privileges: customers may change only these fields. `role` is never client-writable
-- (admins change roles through a server route using the service role).
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, locale, home_zip, marketing_opt_in) on public.profiles to authenticated;

-- Self-service deletion (App Store guideline 5.1.1(v)). Deleting the auth user cascades to the
-- profile; later milestones anonymize orders via ON DELETE SET NULL so tax records survive.
-- Apple token revocation happens server-side before this is called (see docs/architecture.md).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
