import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

export type EventRow = {
  id: string
  slug: string
  boat_name: string
  date: string
  time_start: string
  time_end: string
  location: string
  marina: string
  price_general: number
  price_vip: number | null
  capacity: number
  sold: number
  status: 'available' | 'sold_out' | 'cancelled'
  dj_name: string | null
  dj_image: string | null
  cover_image: string | null
  description: string | null
  genres: string | null
  bpm: string | null
  event_type: string | null
}

export type DjRow = {
  id: string
  slug: string
  name: string
  tagline: string | null
  bio: string | null
  image: string | null
  instagram: string | null
  mixcloud: string | null
  is_active: boolean
}

export type PostRow = {
  id: string
  slug: string
  title: string
  category: 'destino' | 'musica' | 'guias'
  excerpt: string | null
  content: string | null
  cover_image: string | null
  published: boolean
  created_at: string
}
