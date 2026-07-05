import { useEffect, useState } from 'react'
import { supabase, type EventRow } from '../../lib/supabase'

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([])

  const load = () =>
    supabase.from('events').select('*').order('date').then(({ data }) => setEvents((data as EventRow[]) ?? []))

  useEffect(() => { load() }, [])

  const toggleSoldOut = async (e: EventRow) => {
    await supabase.from('events')
      .update({ status: e.status === 'sold_out' ? 'available' : 'sold_out' })
      .eq('id', e.id)
    load()
  }

  return (
    <div>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Events</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        {events.map(e => (
          <div key={e.id} className="event-card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="bebas" style={{ fontSize: '1.2rem' }}>{e.boat_name}</div>
              <div className="text-muted-c" style={{ fontSize: '.8rem' }}>
                {e.date} · €{Number(e.price_general).toFixed(0)} / VIP €{Number(e.price_vip ?? 0).toFixed(0)} · {e.sold}/{e.capacity} · {e.status}
              </div>
            </div>
            <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '.8rem' }} onClick={() => toggleSoldOut(e)}>
              {e.status === 'sold_out' ? 'REOPEN' : 'SOLD OUT'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
