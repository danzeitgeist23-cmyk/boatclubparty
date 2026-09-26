import { useCallback, useEffect, useState } from 'react'
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

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile((data as Profile) ?? null)
  }, [])

  useEffect(() => {
    if (session === undefined) return
    if (!session) { setProfile(null); return }
    fetchProfile(session.user.id)
  }, [session, fetchProfile])

  const loading = session === undefined || (!!session && profile === undefined)

  return {
    session: session ?? null,
    profile: profile ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
    // vuelve a leer el perfil sin esperar a un cambio de sesión — necesario
    // tras un update directo (p.ej. is_family) para reflejarlo al instante
    refreshProfile: () => (session ? fetchProfile(session.user.id) : Promise.resolve()),
  }
}
