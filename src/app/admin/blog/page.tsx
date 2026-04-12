/* ----------------------------------------------------------------
   app/admin/blog/page.tsx
   Admin list of all blog posts (drafts + published).
---------------------------------------------------------------- */
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

type Post = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  tag: string | null
  status: 'draft' | 'published'
  reading_time_min: number | null
  published_at: string | null
  updated_at: string
}

export default function AdminBlogListPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email
      if (!data.session) router.replace('/login')
      else if (!isAdminEmail(email)) router.replace('/')
      else setCheckingAuth(false)
    })
  }, [router])

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('id, slug, title, subtitle, tag, status, reading_time_min, published_at, updated_at')
      .order('updated_at', { ascending: false })
    if (data) setPosts(data as Post[])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!checkingAuth) load()
  }, [checkingAuth, load])

  const togglePublish = async (post: Post) => {
    const next = post.status === 'published' ? 'draft' : 'published'
    const patch: { status: 'draft' | 'published'; published_at?: string } = { status: next }
    if (next === 'published' && !post.published_at) patch.published_at = new Date().toISOString()
    const { error } = await supabase.from('posts').update(patch).eq('id', post.id)
    if (error) return alert(error.message)
    load()
  }

  const remove = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    if (error) return alert(error.message)
    setPosts((ps) => ps.filter((p) => p.id !== post.id))
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
      <header className="border-b border-white/5 backdrop-blur-md bg-[#050A12]/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-gray-400 hover:text-teal-300">← Admin</Link>
            <span className="text-gray-700">|</span>
            <h1 className="text-lg font-bold">Blog Manager</h1>
          </div>
          <Link
            href="/admin/blog/new"
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-400 text-[#04131A] font-bold text-sm"
          >
            + New post
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 text-center text-gray-500">
            No posts yet.{' '}
            <Link href="/admin/blog/new" className="text-teal-300 hover:underline">
              Write your first one
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-white/5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 overflow-hidden">
            {posts.map((p) => (
              <li key={p.id} className="flex items-start gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/blog/${p.id}/edit`}
                      className="font-semibold hover:text-teal-300 truncate"
                    >
                      {p.title}
                    </Link>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        p.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.tag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  {p.subtitle && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.subtitle}</p>
                  )}
                  <p className="text-xs text-gray-600 font-mono mt-1">/blog/{p.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {p.status === 'published' && (
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="px-3 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/${p.id}/edit`}
                    className="px-3 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => togglePublish(p)}
                    className="px-3 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10"
                  >
                    {p.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="px-3 py-1 rounded-md text-xs bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
