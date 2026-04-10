// app/episodes/page.tsx – Episodes list with header, footer, and tag filter
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'

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
  /* ------------------ state ------------------ */
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [tagFilter, setTagFilter] = useState<string>('all')

  /* -------------- fetch episodes -------------- */
  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('published_at', { ascending: false })

      if (error) console.error(error.message)
      else setEpisodes(data || [])

      setLoading(false)
    }
    fetchEpisodes()
  }, [])

  /* -------------- derive tags -------------- */
  const allTags = ['all', ...new Set(episodes.map((e) => e.tag || 'other'))]
  const visibleEpisodes = tagFilter === 'all' ? episodes : episodes.filter((e) => (e.tag || 'other') === tagFilter)

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen flex flex-col bg-[#050A12] text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 text-teal-400 font-bold text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3a9 9 0 00-9 9v5a3 3 0 003 3h1a2 2 0 002-2v-4a2 2 0 00-2-2H5v-2a7 7 0 0114 0v2h-2a2 2 0 00-2 2v4a2 2 0 002 2h1a3 3 0 003-3v-5a9 9 0 00-9-9z" />
          </svg>
          PedsPulse
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/episodes" className="text-teal-300">Episodes</Link>
          <Link href="/about" className="hover:text-teal-300">About</Link>
          <Link href="/login" className="px-4 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-xs font-semibold">Admin</Link>
        </nav>
      </header>

      {/* Subnav – Tag Filter */}
      <div className="flex gap-3 overflow-x-auto px-6 py-3 border-y border-gray-800 bg-[#0B0F19]">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tag)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              tagFilter === tag ? 'bg-teal-600 text-white' : 'bg-gray-800 text-teal-300 hover:bg-gray-700'
            }`}
          >
            {tag === 'all' ? 'All' : tag}
          </button>
        ))}
      </div>

      {/* Episodes grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {loading ? (
          <p className="text-gray-400">Loading episodes…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {visibleEpisodes.map((ep) => (
             <EpisodeCard
  key={ep.id}
  slug={ep.slug}
  title={ep.title}
  summary={ep.summary_md}
  audioUrl={ep.audio_url}
  duration={ep.duration || ''}
  tag={ep.tag || 'Education'}
  coverImage={ep.cover_image_url}
/>

            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 w-full border-t border-gray-800">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse • Built with ❤️ & caffeine
      </footer>
    </div>
  )
}
