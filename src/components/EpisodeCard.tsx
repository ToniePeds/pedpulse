/* ----------------------------------------------------------------
   components/EpisodeCard.tsx
   Card for the /episodes grid. Links to /episodes/[slug].
---------------------------------------------------------------- */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDuration } from '@/lib/formatDuration'

interface EpisodeCardProps {
  slug: string
  title: string
  summary: string
  audioUrl: string
  coverImage?: string
  duration?: string
  tag?: string
}

export default function EpisodeCard({
  slug,
  title,
  summary,
  audioUrl,
  coverImage,
  duration = '0',
  tag = 'General',
}: EpisodeCardProps) {
  const niceTime = formatDuration(duration)

  return (
    <Link
      href={`/episodes/${slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card ring-1 ring-border hover:ring-teal-400/40 hover:-translate-y-1 transition-all"
    >
      {/* Cover */}
      <div className="relative aspect-video bg-gradient-to-br from-teal-500/20 to-fuchsia-500/10">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🎙️</div>
        )}

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/70 text-white backdrop-blur">
          {niceTime}
        </span>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-teal-400/90 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#050A12] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex-1 text-lg font-bold leading-snug group-hover:text-teal-300 transition line-clamp-2">
            {title}
          </h2>
        </div>

        <p className="mt-2 text-sm text-gray-400 line-clamp-2 flex-1">{summary}</p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          {tag && (
            <span className="px-3 py-0.5 rounded-full bg-teal-500/10 text-teal-300 ring-1 ring-teal-400/20">
              {tag}
            </span>
          )}
          <span className="text-teal-300/70 opacity-0 group-hover:opacity-100 transition">
            Listen →
          </span>
        </div>

        {/* Inline audio — click stops propagation so it doesn't navigate */}
        <div
          className="mt-3"
          onClick={(e) => e.preventDefault()}
          onClickCapture={(e) => e.stopPropagation()}
        >
          <audio
            controls
            src={audioUrl}
            preload="none"
            className="w-full h-8 rounded-md"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>
    </Link>
  )
}
