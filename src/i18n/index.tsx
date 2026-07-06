import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { TRANSLATIONS, type Lang } from './translations'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' },
  { code: 'no', label: 'NO' },
  { code: 'nl', label: 'NL' },
]

const KEY = 'bcp-lang'

function initial(): Lang {
  const saved = localStorage.getItem(KEY) as Lang | null
  if (saved && TRANSLATIONS[saved]) return saved
  const nav = navigator.language.slice(0, 2).toLowerCase()
  return (TRANSLATIONS[nav as Lang] ? nav : 'en') as Lang
}

type I18n = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18n | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial)

  useEffect(() => {
    localStorage.setItem(KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: string, params?: Record<string, string | number>) => {
    let s = TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key
    if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useT(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used inside LangProvider')
  return ctx
}
