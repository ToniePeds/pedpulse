'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAdminEmail } from '@/lib/admin'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Admins go to the admin dashboard; everyone else goes home
        router.replace(isAdminEmail(session.user.email) ? '/admin' : '/')
      } else {
        router.replace('/')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-base text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}
