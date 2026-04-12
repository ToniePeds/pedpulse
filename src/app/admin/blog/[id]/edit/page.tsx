/* ----------------------------------------------------------------
   app/admin/blog/[id]/edit/page.tsx
   Edit an existing blog post.
---------------------------------------------------------------- */
'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PostForm, { type PostSubmitPayload } from '@/components/admin/PostForm'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

type Post = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  tag: string | null
  cover_image_url: string | null
  content_html: string
  status: 'draft' | 'published'
  published_at: string | null
}

export default function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email
      if (!data.session) router.replace('/login')
      else if (!isAdminEmail(email)) router.replace('/')
      else setCheckingAuth(false)
    })
  }, [router])

  useEffect(() => {
    if (checkingAuth) return
    supabase
      .from('posts')
      .select('id, slug, title, subtitle, tag, cover_image_url, content_html, status, published_at')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setLoadError(error?.message ?? 'Post not found.')
        else setPost(data as Post)
      })
  }, [checkingAuth, id])

  const handleSubmit = async (payload: PostSubmitPayload) => {
    if (!post) return
    const wasPublished = post.status === 'published'
    const becomingPublished = payload.status === 'published'

    const row: Record<string, unknown> = {
      slug: payload.slug,
      title: payload.title,
      subtitle: payload.subtitle || null,
      tag: payload.tag || null,
      cover_image_url: payload.cover_image_url || null,
      content_html: payload.content_html,
      excerpt: payload.excerpt || null,
      reading_time_min: payload.reading_time_min,
      status: payload.status,
    }
    // Only set published_at on first publish; preserve original date thereafter.
    if (becomingPublished && !wasPublished) row.published_at = new Date().toISOString()
    if (!becomingPublished) row.published_at = null

    const { error } = await supabase.from('posts').update(row).eq('id', post.id)
    if (error) throw error
    router.push('/admin/blog')
  }

  if (checkingAuth || (!post && !loadError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050A12] text-white">
        Loading…
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050A12] text-white">
        <div className="text-center">
          <p className="text-rose-300 mb-4">{loadError}</p>
          <Link href="/admin/blog" className="text-teal-300 hover:underline">← Back to blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050A12] text-white">
      <header className="border-b border-white/5 backdrop-blur-md bg-[#050A12]/80 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/admin/blog" className="text-sm text-gray-400 hover:text-teal-300 shrink-0">← Blog</Link>
            <span className="text-gray-700">|</span>
            <h1 className="text-lg font-bold truncate">Edit post</h1>
          </div>
          {post && post.status === 'published' && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-xs text-teal-300 hover:text-teal-200 shrink-0"
            >
              View live →
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {post && (
          <PostForm
            initial={{
              title: post.title,
              subtitle: post.subtitle ?? '',
              slug: post.slug,
              tag: post.tag ?? '',
              cover_image_url: post.cover_image_url ?? '',
              content_html: post.content_html,
              status: post.status,
            }}
            submitLabel={post.status === 'published' ? 'Update' : 'Publish'}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  )
}
