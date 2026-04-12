-- ============================================================
-- PedsPulse — Blog (Tiptap-authored Medium-style posts) schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run.
-- ============================================================

-- ─── Table ──────────────────────────────────────────────────
create table if not exists posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  subtitle          text,
  cover_image_url   text,
  tag               text,
  content_html      text not null,           -- Tiptap HTML output
  excerpt           text,                    -- auto-generated, plain text
  reading_time_min  int,                     -- auto-calculated
  status            text not null default 'draft' check (status in ('draft','published')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists posts_status_published_idx
  on posts (status, published_at desc nulls last);

-- Auto-bump updated_at (re-uses function from tools_schema.sql; create if missing)
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ─── Row Level Security ─────────────────────────────────────
alter table posts enable row level security;

-- Public can read PUBLISHED posts only
drop policy if exists "Public read published posts" on posts;
create policy "Public read published posts"
  on posts for select
  using (status = 'published');

-- Admins can do anything (read drafts, insert, update, delete)
-- Keep email list in sync with src/lib/admin.ts
drop policy if exists "Admin all access posts" on posts;
create policy "Admin all access posts"
  on posts for all
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

-- ─── Storage bucket for cover images ────────────────────────
insert into storage.buckets (id, name, public)
values ('post-covers', 'post-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public read post covers" on storage.objects;
create policy "Public read post covers"
  on storage.objects for select
  using (bucket_id = 'post-covers');

drop policy if exists "Admin insert post covers" on storage.objects;
create policy "Admin insert post covers"
  on storage.objects for insert
  with check (
    bucket_id = 'post-covers'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

drop policy if exists "Admin update post covers" on storage.objects;
create policy "Admin update post covers"
  on storage.objects for update
  using (
    bucket_id = 'post-covers'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

drop policy if exists "Admin delete post covers" on storage.objects;
create policy "Admin delete post covers"
  on storage.objects for delete
  using (
    bucket_id = 'post-covers'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );
