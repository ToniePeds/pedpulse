'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg(null)

    const normalized = email.trim().toLowerCase()

    // 1. Save to Supabase
    const { error } = await supabase
      .from('newsletter')
      .insert([{ email: normalized }])
      .select()

    if (error) {
      // Duplicate email is a unique constraint violation
      if (error.code === '23505') {
        setStatus('ok')
        setEmail('')
        return
      }
      console.error('Newsletter insert error:', error)
      setErrorMsg(error.message)
      setStatus('error')
      return
    }

    // 2. Fire welcome email via Edge Function (best-effort, don't block UI)
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: { email: normalized },
      })
    } catch {
      // Silent fail — the signup still succeeded
    }

    setStatus('ok')
    setEmail('')
  }

  if (status === 'ok') {
    return (
      <div className="p-6 rounded-2xl bg-teal-500/10 ring-1 ring-teal-400/30 text-center">
        <p className="text-lg font-bold text-teal-300">You&apos;re in!</p>
        <p className="mt-1 text-sm text-gray-400">
          Check your inbox for a welcome note. See you on the ward.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        placeholder="you@hospital.org"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-white placeholder:text-gray-600 focus:border-teal-400/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-[#04131A] font-bold disabled:opacity-50 hover:shadow-lg hover:shadow-teal-500/30 transition whitespace-nowrap"
      >
        {status === 'sending' ? 'Joining…' : 'Subscribe'}
      </button>

      {errorMsg && (
        <p className="text-rose-300 text-sm sm:col-span-2">{errorMsg}</p>
      )}
    </form>
  )
}
