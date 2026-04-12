/* ----------------------------------------------------------------
   components/ThemeToggle.tsx
   Sun/moon icon button that toggles light/dark mode.
---------------------------------------------------------------- */
'use client'

import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="p-2 rounded-lg bg-surface ring-1 ring-border hover:bg-surface-hover transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  )
}
