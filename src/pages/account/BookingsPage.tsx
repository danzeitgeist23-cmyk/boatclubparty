import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

type Booking = {
  id: string
  ticket_type: string
  quantity: number
  total: number
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  events: { boat_name: string; date: string; time_start: string; marina: string } | null
}

const STATUS_COLOR: Record<Booking['status'], string> = {
  paid: 'var(--gold)',
  pending: 'var(--orange)',
  cancelled: 'var(--text-muted)',
}

export default function BookingsPage() {
  const { session } = useAuth()
  const [bookings, setBookings] = useState<Booking[] | null>(null)

  useEffect(() => {
    if (!session) return
    supabase
      .from('tickets')
      .select('id, ticket_type, quantity, total, status, created_at, events(boat_name, date, time_start, marina)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setBookings((data as unknown as Booking[]) ?? []))
  }, [session])

  if (bookings === null) return <p className="text-muted-c">Loading bookings…</p>

  return (
    <div className="fade-up">
      <h1 className="bebas" style={{ fontSize: '2.2rem', margin: '0 0 4px' }}>My bookings</h1>
      <p className="text-muted-c" style={{ margin: '0 0 26px', fontSize: '.9rem' }}>
        Paid bookings count towards your <Link to="/account/rewards" style={{ color: 'var(--gold)' }}>rewards tier</Link>.
      </p>

      {bookings.length === 0 ? (
        <div className="event-card" style={{ padding: 28, cursor: 'default', maxWidth: 480 }}>
          <p className="bebas" style={{ fontSize: '1.3rem', margin: '0 0 6px' }}>No bookings yet</p>
          <p className="text-muted-c" style={{ margin: '0 0 16px', fontSize: '.9rem' }}>
            Your next party is one WhatsApp away.
          </p>
          <Link className="btn-gold" to="/" style={{ fontSize: '.9rem', padding: '9px 18px' }}>See upcoming events</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {bookings.map(b => (
            <div key={b.id} className="event-card" style={{ padding: '16px 20px', cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <strong className="bebas" style={{ fontSize: '1.2rem' }}>{b.events?.boat_name ?? 'Event'}</strong>
                <p className="text-muted-c" style={{ margin: '2px 0 0', fontSize: '.83rem' }}>
                  {b.events ? `${b.events.date} · ${b.events.time_start.slice(0, 5)} · ${b.events.marina}` : '—'} · {b.quantity}× {b.ticket_type}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="bebas" style={{ color: STATUS_COLOR[b.status], letterSpacing: '.1em' }}>{b.status.toUpperCase()}</span>
                <p className="bebas" style={{ margin: 0, fontSize: '1.1rem' }}>€{Number(b.total).toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
