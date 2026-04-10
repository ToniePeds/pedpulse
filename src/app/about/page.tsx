// app/about/page.tsx
'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { HiPlay, HiPause } from 'react-icons/hi2'
import NewsletterForm from '@/components/NewsletterForm'
import { supabase } from '@/lib/supabaseClient'

export default function AboutPage() {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  // Supabase public URL for your narration
  const {
    data: { publicUrl: audioUrl },
  } = supabase
    .storage
    .from('episode-audio')
    .getPublicUrl('Hi rashid.mp3') // ← your key here

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const pillars = [
    {
      title: 'Evidence-Based',
      desc: 'Every case & episode is backed by the latest pediatric guidelines and research.',
    },
    {
      title: 'Story-Led',
      desc: 'Learn through real-world clinical tales that stick with you when it matters.',
    },
    {
      title: 'Interactive',
      desc: 'Hands-on quizzes, case summaries, and community insights to reinforce learning.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050A12] text-white flex flex-col">

      {/* —— Header */}
      <header className="w-full border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-teal-400 font-bold text-2xl">
            {/* your logo SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3a9 9 0 00-9 9v5a3 3 0 003 3h1a2 2 0 002-2v-4a2 2 0 00-2-2H5v-2a7 7 0 0114 0v2h-2a2 2 0 00-2 2v4a2 2 0 002 2h1a3 3 0 003-3v-5a9 9 0 00-9-9z"
              />
            </svg>
            PedsPulse
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/episodes" className="hover:text-teal-300">Episodes</Link>
            <Link href="/about" className="hover:text-teal-300">About</Link>
            <Link
              href="/login"
              className="px-4 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-xs font-semibold"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden bg-[#0B0F19] border-t border-gray-800 px-6 py-4 space-y-4">
            <Link href="/episodes" className="block" onClick={() => setOpen(false)}>Episodes</Link>
            <Link href="/about"   className="block" onClick={() => setOpen(false)}>About</Link>
            <Link
              href="/login"
              className="inline-block px-4 py-2 rounded bg-teal-600 hover:bg-teal-500 text-sm font-semibold mt-2"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </header>

      {/* —— About Content */}
      <div className="flex-grow flex flex-col items-center px-6 py-16 relative overflow-hidden">

        {/* Blob bg */}
        <svg
          className="absolute top-1/2 left-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-20 animate-spin-slow"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFC6" />
              <stop offset="100%" stopColor="#009EFF" />
            </linearGradient>
          </defs>
          <path
            fill="url(#grad)"
            d="M421.1,302.1Q384,354,320.3,375.8Q256.7,397.7,203.1,365.1Q149.5,332.5,114,286.2Q78.5,240,97.3,177.8Q116.1,115.7,171.1,85.1Q226.1,54.5,286.2,69.6Q346.2,84.7,386.6,128.4Q427,172.1,421.1,231.1Z"
          />
        </svg>

        {/* Hero text */}
        <h1 className="relative text-5xl sm:text-6xl font-extrabold mb-4 text-center z-10">
          About PedsPulse
        </h1>
        <p className="relative max-w-2xl text-lg sm:text-xl text-gray-300 text-center z-10">
          An evidence-based, story-led pediatrics learning platform built with ❤️ by Dr Rashid MD.
        </p>

        <Link
          href="/episodes"
          className="relative mt-6 inline-block bg-teal-600 hover:bg-teal-500 text-black font-semibold py-3 px-6 rounded-full transition z-10"
        >
          Start Learning
        </Link>

        {/* Audio widget */}
        <div className="relative mt-12 z-10">
          <div
            className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-teal-500 
                        flex items-center justify-center transition-transform ${
                          playing ? 'animate-pulse' : ''
                        }`}
          >
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pause narration' : 'Play narration'}
              className="text-teal-300 hover:text-white text-4xl"
            >
              {playing ? <HiPause /> : <HiPlay />}
            </button>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
        </div>
        <p className="relative mt-4 text-gray-400 z-10">Hear our mission in your ears</p>

        {/* Pillars */}
        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full z-10">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-300">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <section id="newsletter" className="relative mt-20 w-full max-w-md z-10">
          <h2 className="text-3xl font-bold mb-4 text-white text-center">Stay in the loop</h2>
          <p className="text-gray-400 mb-6 text-center">
            Get new pediatric pearls straight to your inbox.
          </p>
          <NewsletterForm />
        </section>
      </div>

      {/* —— Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-800">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse • Built with ❤️ & caffeine
      </footer>
    </div>
  )
}
