'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { supabase } from '@/lib/supabaseClient'

type Tool = {
  slug: string
  title: string
  description: string
  icon: string
  tag: string
  color: string
  tagColor: string
}

const GRADIENTS = [
  { color: 'from-rose-500/20 to-rose-900/10 border-rose-500/30', tagColor: 'bg-rose-500/20 text-rose-300' },
  { color: 'from-blue-500/20 to-blue-900/10 border-blue-500/30', tagColor: 'bg-blue-500/20 text-blue-300' },
  { color: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30', tagColor: 'bg-emerald-500/20 text-emerald-300' },
  { color: 'from-fuchsia-500/20 to-fuchsia-900/10 border-fuchsia-500/30', tagColor: 'bg-fuchsia-500/20 text-fuchsia-300' },
  { color: 'from-amber-500/20 to-amber-900/10 border-amber-500/30', tagColor: 'bg-amber-500/20 text-amber-300' },
  { color: 'from-violet-500/20 to-violet-900/10 border-violet-500/30', tagColor: 'bg-violet-500/20 text-violet-300' },
  { color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30', tagColor: 'bg-cyan-500/20 text-cyan-300' },
  { color: 'from-sky-500/20 to-sky-900/10 border-sky-500/30', tagColor: 'bg-sky-500/20 text-sky-300' },
]

function pickGradient(seed: string) {
  const n = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return GRADIENTS[n % GRADIENTS.length]
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tools')
      .select('slug, title, description, tag, icon, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setTools(data.map((t) => {
            const g = pickGradient(t.slug)
            return { slug: t.slug, title: t.title, description: t.description ?? '', icon: t.icon ?? '🧪', tag: t.tag ?? 'Tool', color: g.color, tagColor: g.tagColor }
          }))
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      <SiteHeader active="/tools" />

      {/* Hero */}
      <section className="py-14 px-6 text-center">
        <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-3">Clinical Tools</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Learn by doing,<br />
          <span className="text-teal-400">not by suffering.</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto text-base">
          Interactive modules, quizzes, and explainers built for residents who don&apos;t have time to read a textbook but also can&apos;t afford to not know this stuff.
        </p>
      </section>

      {/* Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-16 w-full">
        {loading ? (
          <div className="p-12 rounded-2xl bg-card ring-1 ring-border text-center text-muted">Loading tools…</div>
        ) : tools.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card ring-1 ring-border text-center text-muted">No tools yet — check back soon.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className={`group relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br ${tool.color} hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tool.tagColor}`}>{tool.tag}</span>
                </div>
                <h2 className="text-xl font-bold">{tool.title}</h2>
                <p className="text-sm text-muted flex-1 mt-2">{tool.description}</p>
                <div className="mt-6 flex items-center gap-2 text-teal-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  Launch tool
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-faint border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse · Built with ❤️ & caffeine
      </footer>
    </div>
  )
}
