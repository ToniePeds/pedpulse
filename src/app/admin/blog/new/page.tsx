/* ----------------------------------------------------------------
   app/admin/blog/new/page.tsx
   Create a new blog post.
---------------------------------------------------------------- */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PostForm, { type PostSubmitPayload } from '@/components/admin/PostForm'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

export default function AdminBlogNewPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email
      if (!data.session) router.replace('/login')
      else if (!isAdminEmail(email)) router.replace('/')
      else setCheckingAuth(false)
    })
  }, [router])

  const handleSubmit = async (payload: PostSubmitPayload) => {
    const row = {
      slug: payload.slug,
      title: payload.title,
      subtitle: payload.subtitle || null,
      tag: payload.tag || null,
      cover_image_url: payload.cover_image_url || null,
      content_html: payload.content_html,
      excerpt: payload.excerpt || null,
      reading_time_min: payload.reading_time_min,
      status: payload.status,
      published_at: payload.status === 'published' ? new Date().toISOString() : null,
    }
    const { error } = await supabase.from('posts').insert(row)
    if (error) throw error
    router.push('/admin/blog')
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050A12] text-white">
        Checking authentication…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050A12] text-white">
      <header className="border-b border-white/5 backdrop-blur-md bg-[#050A12]/80 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog" className="text-sm text-gray-400 hover:text-teal-300">← Blog</Link>
            <span className="text-gray-700">|</span>
            <h1 className="text-lg font-bold">New post</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <PostForm submitLabel="Publish" onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
