import { useEffect, useState } from 'react'
import { supabase, type EventRow } from '../lib/supabase'

// Fallback local si Supabase no responde — mismos datos seed
const FALLBACK: EventRow[] = [
  {
    id: 'local-1', slug: 'sunset-queen-19-jul', boat_name: 'Sunset Queen',
    date: '2026-07-19', time_start: '18:00', time_end: '22:00',
    location: 'Gran Canaria', marina: 'Puerto Rico Marina',
    price_general: 55, price_vip: 85, capacity: 80, sold: 0,
    status: 'available', dj_name: 'DJ Marco', dj_image: null, cover_image: null,
    description: '4 hours of open bar, live DJ and Atlantic sunset.',
  },
]

export function useEvents() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .neq('status', 'cancelled')
      .gte('date', new Date().toISOString().slice(0, 10))
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        setEvents(error || !data?.length ? FALLBACK : (data as EventRow[]))
        setLoading(false)
      })
  }, [])

  return { events, loading, next: events[0] ?? null }
}
