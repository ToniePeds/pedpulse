'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import AuthButton from '@/components/AuthButton'

function ToolViewer() {
  const params = useSearchParams()
  const src = params.get('src')

  if (!src || !src.startsWith('/tools/')) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        No tool specified.
      </div>
    )
  }

  return (
    <iframe
      src={src}
      className="flex-1 w-full border-0"
      style={{ minHeight: 'calc(100vh - 65px)' }}
      title="PedsPulse Tool"
      // Legacy static tools live under /public/tools/*.html on the same
      // origin as the app. allow-same-origin is kept so they can use
      // localStorage for state — these files are trusted (committed to
      // the repo by the maintainer). The sandbox still blocks top-frame
      // navigation, popups, and form submission to other origins.
      sandbox="allow-scripts allow-same-origin"
      referrerPolicy="no-referrer"
    />
  )
}

export default function ToolViewPage() {
  return (
    <div className="min-h-screen bg-base text-foreground flex flex-col">
      {/* Slim header */}
      <header className="w-full border-b border-border shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/tools" className="flex items-center gap-1 text-gray-400 hover:text-teal-400 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              All Tools
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/" className="text-teal-400 font-bold text-lg">PedsPulse</Link>
          </div>
          <AuthButton />
        </div>
      </header>

      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ToolViewer />
      </Suspense>
    </div>
  )
}
