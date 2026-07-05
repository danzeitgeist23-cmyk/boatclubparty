import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type Settings = Record<string, string>

// Regla de oro: ningún ID/número/URL hardcoded en JSX — todo sale de la tabla settings
export function useSettings() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    supabase
      .from('settings')
      .select('key,value')
      .then(({ data }) => {
        if (data) setSettings(Object.fromEntries(data.map(r => [r.key, r.value ?? ''])))
      })
  }, [])

  return settings
}
