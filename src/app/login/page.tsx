/* ----------------------------------------------------------------
   app/login/page.tsx
   Magic-link login for admins. Regular users sign in via Google
   on the main site (AuthButton). This page is the admin-specific
   OTP flow — still accessible at /login.
---------------------------------------------------------------- */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalized = email.trim().toLowerCase()
    if (!isAdminEmail(normalized)) {
      setMessage('This login is for PedsPulse admins only.')
      return
    }

    setMessage('Sending magic link…')

    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for a login link!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-base text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-2xl bg-gradient-to-r from-teal-300 via-emerald-300 to-fuchsia-300 bg-clip-text text-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-teal-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-6 4 12 2-6h7" />
            </svg>
            PedsPulse
          </Link>
        </div>
      </header>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-card ring-1 ring-border"
        >
          <div>
            <h1 className="text-2xl font-extrabold">Admin Login</h1>
            <p className="mt-1 text-sm text-gray-400">
              We&apos;ll send a magic link to your email.
            </p>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:border-teal-400/50 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#04131A] font-bold hover:shadow-lg hover:shadow-teal-500/30 transition"
          >
            Send Magic Link
          </button>

          {message && (
            <p
              className={`text-sm ${
                message.startsWith('Error') || message.startsWith('This')
                  ? 'text-rose-300'
                  : 'text-teal-300'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <footer className="py-6 text-center text-xs text-gray-500 border-t border-border">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> PedsPulse
      </footer>
    </div>
  )
}
