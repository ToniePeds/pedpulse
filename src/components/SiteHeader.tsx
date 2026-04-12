/* ----------------------------------------------------------------
   components/SiteHeader.tsx
   Shared header/nav used on all public pages.
   Consistent logo, links, auth, admin pill, theme toggle, mobile menu.
---------------------------------------------------------------- */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import AuthButton from '@/components/AuthButton'
import ThemeToggle from '@/components/ThemeToggle'

export default function SiteHeader({ active }: { active?: string }) {
  const { isAdmin } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/episodes', label: 'Episodes' },
    { href: '/blog', label: 'Blog' },
    { href: '/tools', label: 'Tools' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header className="sticky top-0 w-full border-b border-border backdrop-blur-md bg-header z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-2xl bg-gradient-to-r from-teal-300 via-emerald-300 to-fuchsia-300 bg-clip-text text-transparent"
        >
          <span className="relative inline-flex">
            <span className="absolute inset-0 rounded-full bg-teal-400/40 blur-md animate-vital" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="relative w-7 h-7 text-teal-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-6 4 12 2-6h7" />
            </svg>
          </span>
          PedsPulse
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                active === l.href
                  ? 'text-teal-400 font-semibold'
                  : 'text-muted hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-teal-400 hover:after:w-full after:transition-all'
              }
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-400/30 hover:bg-fuchsia-500/25"
            >
              Dashboard
            </Link>
          )}
          <ThemeToggle />
          <AuthButton />
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center justify-center p-2 rounded hover:bg-surface"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-base-alt border-t border-border px-6 py-4 space-y-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block ${active === l.href ? 'text-teal-400' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="block text-fuchsia-300" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}
          <div onClick={() => setOpen(false)}>
            <AuthButton />
          </div>
        </nav>
      )}
    </header>
  )
}
