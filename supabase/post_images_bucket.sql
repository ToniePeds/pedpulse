-- ============================================================
-- PedsPulse — post-images storage bucket for inline blog images
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- Safe to re-run.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Anyone can view inline images
drop policy if exists "Public read post images" on storage.objects;
create policy "Public read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

-- Only admins can upload
drop policy if exists "Admin insert post images" on storage.objects;
create policy "Admin insert post images"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- Only admins can update
drop policy if exists "Admin update post images" on storage.objects;
create policy "Admin update post images"
  on storage.objects for update
  using (
    bucket_id = 'post-images'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );

-- Only admins can delete
drop policy if exists "Admin delete post images" on storage.objects;
create policy "Admin delete post images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and (auth.jwt() ->> 'email') in (
      'mbumarash1@gmail.com',
      'muhunzidavid@gmail.com'
    )
  );
