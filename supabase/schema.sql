-- ============================================================
-- PedsPulse Database Schema
-- Paste this into: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Episodes table
create table if not exists episodes (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text not null unique,
  summary_md     text,
  audio_url      text,
  cover_image_url text,
  duration       text,
  tag            text,
  published_at   timestamptz default now()
);

-- Interactive cases table (AI tutor)
create table if not exists interactive_cases (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  short_description text,
  description       text,
  created_at        timestamptz default now()
);

-- Newsletter subscribers
create table if not exists newsletter (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table episodes           enable row level security;
alter table interactive_cases  enable row level security;
alter table newsletter         enable row level security;

-- Episodes: anyone can read, only authenticated admins can write
create policy "Public read episodes"
  on episodes for select using (true);

create policy "Auth insert episodes"
  on episodes for insert with check (auth.role() = 'authenticated');

create policy "Auth update episodes"
  on episodes for update using (auth.role() = 'authenticated');

-- Interactive cases: anyone can read
create policy "Public read cases"
  on interactive_cases for select using (true);

create policy "Auth insert cases"
  on interactive_cases for insert with check (auth.role() = 'authenticated');

-- Newsletter: anyone can insert their own email, nobody can read others
create policy "Anyone can subscribe"
  on newsletter for insert with check (true);

-- ============================================================
-- Storage buckets (run these separately if needed)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('episode-audio',  'episode-audio',  true);
-- insert into storage.buckets (id, name, public) values ('episode-covers', 'episode-covers', true);
