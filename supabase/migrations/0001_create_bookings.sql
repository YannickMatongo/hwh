create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  requested_start timestamptz not null,
  requested_end timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'refused')),
  action_token text not null unique default encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now()
);

-- RLS is enabled with no policies: all reads/writes go through the
-- get-availability / create-booking / handle-booking-action edge functions,
-- which use the service_role key and therefore bypass RLS entirely.
-- The anon key used by the frontend has no direct access to this table.
alter table public.bookings enable row level security;
