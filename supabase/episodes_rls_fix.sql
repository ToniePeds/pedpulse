-- ============================================================
-- PedsPulse — Fix episodes RLS to admin-only writes
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- Safe to re-run. Replaces the old "any authenticated user" policies.
-- ============================================================

-- Drop the old permissive policies that allowed any logged-in user to write
drop policy if exists "Auth insert episodes" on episodes;
drop policy if exists "Auth update episodes" on episodes;

-- Admin-only insert
create policy "Admin insert episodes"
  on episodes for insert
  with check (
    (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- Admin-only update
create policy "Admin update episodes"
  on episodes for update
  using (
    (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- Admin-only delete (was missing entirely)
create policy "Admin delete episodes"
  on episodes for delete
  using (
    (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- ─── Storage buckets: tighten episode-audio & episode-covers ───
-- These may already exist as permissive; replace with admin-only.

-- episode-audio: admin-only upload
drop policy if exists "Admin insert episode audio" on storage.objects;
create policy "Admin insert episode audio"
  on storage.objects for insert
  with check (
    bucket_id = 'episode-audio'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- episode-covers: admin-only upload
drop policy if exists "Admin insert episode covers" on storage.objects;
create policy "Admin insert episode covers"
  on storage.objects for insert
  with check (
    bucket_id = 'episode-covers'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );
