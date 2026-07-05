import { useEffect, useState } from 'react'

const KEY = 'bcp-theme'
type Theme = 'light' | 'dark'

function initial(): Theme {
  const saved = localStorage.getItem(KEY) as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(KEY, theme)
  }, [theme])

  return { theme, toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')) }
}
