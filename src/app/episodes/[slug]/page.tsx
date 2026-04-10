'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AudioPlayer from '@/components/AudioPlayer'

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

    const fetchEpisode = async () => {
      const { data, error } = await supabase
        .from('episodes')       // ← no generics here
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('❌ Supabase fetch error:', error.message)
      } else {
        // cast to our Episode type
        setEpisode(data as Episode)
      }
      setLoading(false)
    }

    fetchEpisode()
  }, [slug])

  if (loading) {
    return <p className="text-center py-10">Loading…</p>
  }

  if (!episode) {
    return (
      <p className="text-center py-10 text-red-500">
        Episode not found.
      </p>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-bold">{episode.title}</h1>

      <div className="prose">
        <p>{episode.summary_md}</p>
      </div>

      {/* if you have a cover image */}
      {episode.cover_image_url && (
        <img
          src={episode.cover_image_url}
          alt={`Cover for ${episode.title}`}
          className="w-full rounded-lg shadow-md"
        />
      )}

      <AudioPlayer src={episode.audio_url} />

      {/* any other metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {episode.tag && (
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {episode.tag}
          </span>
        )}
        {episode.duration && (
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {episode.duration}
          </span>
        )}
        {episode.published_at && (
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {new Date(episode.published_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
