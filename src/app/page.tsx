// app/page.tsx – Responsive landing page with mobile nav + newsletter anchor
'use client'

import { useState } from 'react'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'
import InteractiveCourseSection from '@/components/interactive/InteractiveCourseSection'
import AuthButton from '@/components/AuthButton'

export default function LandingPage() {
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#050A12] text-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-teal-400 font-bold text-2xl">
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
            <Link href="/episodes" className="hover:text-teal-300">
              Episodes
            </Link>
            <Link href="/tools" className="hover:text-teal-300">
              Tools
            </Link>
            <Link href="/about" className="hover:text-teal-300">
              About
            </Link>
            <AuthButton />
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
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
            <Link href="/episodes" className="block" onClick={() => setOpen(false)}>
              Episodes
            </Link>
            <Link href="/tools" className="block" onClick={() => setOpen(false)}>
              Tools
            </Link>
            <Link href="/about" className="block" onClick={() => setOpen(false)}>
              About
            </Link>
            <div onClick={() => setOpen(false)}>
              <AuthButton />
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
          Evidence-based <span className="text-teal-400">pediatrics</span> told as inspiring stories
        </h1>
        <p className="mt-6 text-gray-300 max-w-xl text-base sm:text-lg">
          Join Dr. Rashid, MD — pediatric resident fueled by love & caffeine — for bite-size clinical pearls, clerkship guides, and real-life cases.
        </p>
        <div className="mt-10 flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <Link
            href="/episodes"
            className="flex-1 sm:flex-none px-8 py-3 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow text-center"
          >
            🎧 Listen to Episodes
          </Link>
          <a
            href="#newsletter"
            className="flex-1 sm:flex-none px-8 py-3 rounded border border-teal-600 text-teal-300 hover:bg-teal-600/20 font-semibold text-center"
          >
            📬 Get Updates
          </a>
        </div>
      </section>
      {/* New Interactive Courses Section */}
      <section id="interactive-courses" className="py-12 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">👩‍⚕️ Interactive Cases</h2>
          <InteractiveCourseSection />
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-12 bg-[#0B0F19] text-white">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Stay in the Loop</h2>
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} PedsPulse • Built with ❤️ & caffeine
      </footer>
    </main>
  )
}
