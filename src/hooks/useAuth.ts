import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type Profile = {
  id: string
  full_name: string | null
  whatsapp: string | null
  role: 'customer' | 'admin'
  is_family: boolean
  bookings_count: number
}

// Sesión + perfil (rol, family, bookings). undefined = aún cargando.
export function useAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === undefined) return
    if (!session) { setProfile(null); return }
    let active = true
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => { if (active) setProfile((data as Profile) ?? null) })
    return () => { active = false }
  }, [session])

  const loading = session === undefined || (!!session && profile === undefined)

  return {
    session: session ?? null,
    profile: profile ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
  }
}
