/* ----------------------------------------------------------------
   app/admin/page.tsx
   Admin dashboard index. Lists the manageable content types.
---------------------------------------------------------------- */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

const SECTIONS = [
  {
    href: '/admin/blog',
    title: 'Blog',
    blurb: 'Write and publish Medium-style posts with a rich text editor.',
    icon: '📝',
    accent: '#A78BFA',
  },
  {
    href: '/admin/new',
    title: 'Episodes',
    blurb: 'Publish new podcast episodes with show notes and audio.',
    icon: '🎙️',
    accent: '#2DD4BF',
  },
  {
    href: '/admin/tools',
    title: 'Tools',
    blurb: 'Upload single-HTML interactive tools. Goes live instantly.',
    icon: '🧪',
    accent: '#FB7185',
  },
  // Future: newsletter, analytics
]

export default function AdminIndexPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const e = data.session?.user?.email ?? null
      if (!data.session) router.replace('/login')
      else if (!isAdminEmail(e)) router.replace('/')
      else {
        setEmail(e)
        setCheckingAuth(false)
      }
    })
  }, [router])

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
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-teal-300">← Site</Link>
            <span className="text-gray-700">|</span>
            <h1 className="text-lg font-bold">Admin</h1>
          </div>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold">What are we publishing today?</h2>
          <p className="mt-2 text-gray-400">Pick a section to manage.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative p-6 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 hover:-translate-y-1 hover:ring-white/15 transition-all overflow-hidden"
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition"
                style={{ backgroundColor: s.accent }}
              />
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl ring-1"
                style={{ backgroundColor: `${s.accent}20`, borderColor: s.accent }}
              >
                {s.icon}
              </div>
              <h3 className="relative mt-4 text-xl font-bold">{s.title}</h3>
              <p className="relative mt-1 text-sm text-gray-400">{s.blurb}</p>
              <div
                className="relative mt-5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition"
                style={{ color: s.accent }}
              >
                Open →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
