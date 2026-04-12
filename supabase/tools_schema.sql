-- ============================================================
-- PedsPulse — Tools (single-HTML uploader) schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run (uses IF NOT EXISTS / drop+recreate for policies).
-- ============================================================

-- ─── Table ──────────────────────────────────────────────────
create table if not exists tools (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  description  text,
  tag          text,
  icon         text,                          -- emoji or short string
  html_url     text not null,                 -- public URL of uploaded .html in storage
  storage_path text not null,                 -- internal path inside the bucket (for delete)
  status       text not null default 'published'  check (status in ('draft','published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tools_status_created_idx
  on tools (status, created_at desc);

-- Auto-bump updated_at
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists tools_set_updated_at on tools;
create trigger tools_set_updated_at
  before update on tools
  for each row execute function set_updated_at();

-- ─── Row Level Security ─────────────────────────────────────
alter table tools enable row level security;

-- Anyone (even unauthenticated) can read PUBLISHED tools
drop policy if exists "Public read published tools" on tools;
create policy "Public read published tools"
  on tools for select
  using (status = 'published');

-- Admins can do anything (read drafts, insert, update, delete)
-- The admin email list is hardcoded here AND in src/lib/admin.ts.
-- Keep them in sync.
drop policy if exists "Admin all access tools" on tools;
create policy "Admin all access tools"
  on tools for all
  using (
    (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  )
  with check (
    (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- ─── Storage bucket ─────────────────────────────────────────
-- Public read so iframes can load. Only admins can write.
insert into storage.buckets (id, name, public)
values ('tool-bundles', 'tool-bundles', true)
on conflict (id) do nothing;

-- Storage RLS policies
drop policy if exists "Public read tool bundles" on storage.objects;
create policy "Public read tool bundles"
  on storage.objects for select
  using (bucket_id = 'tool-bundles');

drop policy if exists "Admin insert tool bundles" on storage.objects;
create policy "Admin insert tool bundles"
  on storage.objects for insert
  with check (
    bucket_id = 'tool-bundles'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

drop policy if exists "Admin update tool bundles" on storage.objects;
create policy "Admin update tool bundles"
  on storage.objects for update
  using (
    bucket_id = 'tool-bundles'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

drop policy if exists "Admin delete tool bundles" on storage.objects;
create policy "Admin delete tool bundles"
  on storage.objects for delete
  using (
    bucket_id = 'tool-bundles'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );
