-- Username sign-in support.
-- Supabase Auth signs in by email only, so a username maps to an account through this table.
-- The table is private: RLS lets a user read only their own row, and nothing can write it from
-- the API. The /api/auth/sign-in route reads it with the service-role key to resolve a username
-- to an account, so the email never reaches the browser.
-- Rollback: drop trigger on_auth_user_created on auth.users;
--           drop function public.handle_new_user();
--           drop table public.profiles;

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

create unique index profiles_username_key on public.profiles (username);

alter table public.profiles enable row level security;

create policy "Users read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Creates the profile when a user signs up with { options: { data: { username } } }.
-- Accounts created without a username (Google sign-in, older email accounts) get no profile and
-- keep signing in by email. A taken or malformed username raises and aborts the signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_username text := lower(trim(new.raw_user_meta_data ->> 'username'));
begin
  if new_username is not null and new_username <> '' then
    insert into public.profiles (user_id, username) values (new.id, new_username);
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
