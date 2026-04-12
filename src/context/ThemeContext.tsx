/* ----------------------------------------------------------------
   context/ThemeContext.tsx
   Toggles between light and dark mode.
   Persists choice in localStorage; defaults to dark.
   Applies .dark class on <html> for Tailwind v4.
---------------------------------------------------------------- */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pedspulse-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    }
    setMounted(true)
  }, [])

  // Sync class + localStorage when theme changes
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pedspulse-theme', theme)
  }, [theme, mounted])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
