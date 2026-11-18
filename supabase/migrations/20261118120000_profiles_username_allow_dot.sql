-- Allow a dot in usernames (a-z, 0-9, underscore, dot; 3-20 characters), so an account can use the
-- part of its email before the @ as its username, e.g. b3ar.nqm.
-- Rollback: alter table public.profiles drop constraint profiles_username_format,
--           add constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$');
alter table public.profiles drop constraint profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format check (username ~ '^[a-z0-9_.]{3,20}$');
