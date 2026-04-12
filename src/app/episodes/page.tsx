/* ----------------------------------------------------------------
   app/episodes/page.tsx
   Public episode listing with tag filter and inline audio.
---------------------------------------------------------------- */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import SiteHeader from '@/components/SiteHeader'
import EpisodeCard from '@/components/EpisodeCard'

export type Episode = {
  id: string
  title: string
  slug: string
  summary_md: string
  audio_url: string
  cover_image_url?: string
  duration?: string
  tag?: string
  published_at?: string
}

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [tagFilter, setTagFilter] = useState<string>('all')

  useEffect(() => {
    supabase
      .from('episodes')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error.message)
        else setEpisodes(data || [])
        setLoading(false)
      })
  }, [])

  const allTags = ['all', ...new Set(episodes.map((e) => e.tag || 'other'))]
  const visibleEpisodes =
    tagFilter === 'all' ? episodes : episodes.filter((e) => (e.tag || 'other') === tagFilter)

  return (
    <div className="min-h-screen flex flex-col bg-base text-foreground">
      <SiteHeader active="/episodes" />

      {/* Hero */}
      <section className="py-16 px-6 text-center max-w-3xl mx-auto">
        <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-3">The Podcast</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Ward Rounds, <span className="text-teal-400">Unplugged</span>.
        </h1>
        <p className="text-muted text-base sm:text-lg">
          Bite-sized episodes on the cases, controversies, and clinical pearls
          that keep pediatrics interesting. Listen between shifts.
        </p>
      </section>

      {/* Tag filter */}
      <div className="flex gap-3 overflow-x-auto px-6 py-3 border-y border-border bg-base-alt backdrop-blur max-w-7xl mx-auto w-full">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tag)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              tagFilter === tag
                ? 'bg-teal-500/20 text-teal-400 ring-1 ring-teal-400/30'
                : 'bg-surface text-muted hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            {tag === 'all' ? 'All' : tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {loading ? (
          <div className="p-12 rounded-2xl bg-card ring-1 ring-border text-center text-muted">Loading episodes…</div>
        ) : visibleEpisodes.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card ring-1 ring-border text-center text-muted">No episodes yet — check back soon.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEpisodes.map((ep) => (
              <EpisodeCard key={ep.id} slug={ep.slug} title={ep.title} summary={ep.summary_md} audioUrl={ep.audio_url} duration={ep.duration || ''} tag={ep.tag || 'Education'} coverImage={ep.cover_image_url} />
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
