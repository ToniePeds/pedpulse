/* ----------------------------------------------------------------
   app/episodes/[slug]/page.tsx
   Single episode detail page with audio player.
---------------------------------------------------------------- */
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import SiteHeader from '@/components/SiteHeader'

type Episode = {
  id: string
  title: string
  slug: string
  summary_md: string
  audio_url: string
  cover_image_url?: string
  tag?: string
  duration?: string
  published_at?: string
}

export default function EpisodeDetailPage() {
  const { slug } = useParams()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('episodes')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error.message)
        else setEpisode(data as Episode)
        setLoading(false)
      })
  }, [slug])

  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      <SiteHeader active="/episodes" />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-muted text-sm">Loading episode…</p>
          </div>
        </div>
      ) : !episode ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-rose-400 text-lg font-semibold mb-2">Episode not found</p>
            <Link href="/episodes" className="text-teal-400 hover:underline text-sm">← Back to all episodes</Link>
          </div>
        </div>
      ) : (
        <article className="flex-1">
          {/* Hero banner */}
          <div className="relative">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
              {episode.cover_image_url ? (
                <Image src={episode.cover_image_url} alt={episode.title} fill className="object-cover" sizes="100vw" priority />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-fuchsia-500/10 to-transparent" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-base)] via-[var(--color-base)]/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
              <div className="max-w-3xl mx-auto">
                <Link href="/episodes" className="inline-flex items-center gap-1 text-muted hover:text-teal-400 text-sm mb-4 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  All episodes
                </Link>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {episode.tag && <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-teal-500/15 text-teal-400">{episode.tag}</span>}
                  {episode.duration && <span className="text-sm text-muted">{episode.duration}</span>}
                  {episode.published_at && (
                    <>
                      <span className="text-faint">·</span>
                      <span className="text-sm text-muted">
                        {new Date(episode.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">{episode.title}</h1>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-3xl mx-auto px-6 py-10">
            {/* Audio player */}
            <div className="rounded-2xl bg-card ring-1 ring-border p-5 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343M8.464 15.536a5 5 0 010-7.072M12 18a7.975 7.975 0 01-5.657-2.343" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Listen to this episode</p>
                  {episode.duration && <p className="text-xs text-faint">{episode.duration}</p>}
                </div>
              </div>
              <audio controls src={episode.audio_url} preload="metadata" className="w-full h-10 rounded-lg" />
            </div>

            {/* Show notes */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-extrabold prose-p:leading-relaxed prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold">
              {episode.summary_md.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />
                return <p key={i}>{line}</p>
              })}
            </div>

            {/* Footer nav */}
            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between text-sm">
              <Link href="/episodes" className="text-muted hover:text-teal-400 transition-colors">← More episodes</Link>
              <Link href="/#newsletter" className="text-teal-400 hover:text-teal-300 transition-colors">Get updates →</Link>
            </div>
          </div>
        </article>
      )}

      <footer className="py-8 text-center text-xs text-faint border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse · Built with ❤️, ☕, and questionable sleep.
      </footer>
    </div>
  )
}
