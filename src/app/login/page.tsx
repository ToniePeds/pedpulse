// app/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  // 👇 Add all the admin emails you want here
  const ADMINS = [
    'mbumarash1@gmail.com',
    'muhunzidavid@gmail.com',
    // add more as needed…
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalized = email.trim().toLowerCase()
    if (!ADMINS.includes(normalized)) {
      setMessage('❌ You are not an admin')
      return
    }

    setMessage('Sending magic link…')

    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        // redirect back to your protected admin new page
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/new`,
      },
    })

    if (error) {
      console.error(error)
      setMessage(`❌ ${error.message}`)
    } else {
      setMessage('✅ Check your email for a login link!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050A12] text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-700"
      >
        <h1 className="text-2xl font-bold text-white">🔐 Admin Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded"
        >
          Send Magic Link
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.startsWith('❌') ? 'text-red-400' : 'text-teal-400'
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <footer className="mt-8 w-full max-w-md text-center text-xs text-gray-500 border-t border-gray-800 py-4">
        © {new Date().getFullYear()} PedsPulse • Built with ❤️ & caffeine
      </footer>
    </div>
  )
}
