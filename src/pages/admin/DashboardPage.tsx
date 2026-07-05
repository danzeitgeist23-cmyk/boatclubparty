import { useEffect, useState } from 'react'
import { supabase, type EventRow } from '../../lib/supabase'

type Stats = {
  events: number
  bookings: number
  seatsSold: number
  revenuePaid: number
  revenuePending: number
  leads: number
  customers: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [events, setEvents] = useState<EventRow[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('*').order('date'),
      supabase.from('tickets').select('quantity, total, status'),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]).then(([e, t, l, p]) => {
      const tickets = (t.data ?? []) as { quantity: number; total: number; status: string }[]
      const active = tickets.filter(x => x.status !== 'cancelled')
      setEvents((e.data as EventRow[]) ?? [])
      setStats({
        events: e.data?.length ?? 0,
        bookings: active.length,
        seatsSold: active.reduce((s, x) => s + x.quantity, 0),
        revenuePaid: tickets.filter(x => x.status === 'paid').reduce((s, x) => s + Number(x.total), 0),
        revenuePending: tickets.filter(x => x.status === 'pending').reduce((s, x) => s + Number(x.total), 0),
        leads: l.count ?? 0,
        customers: p.count ?? 0,
      })
    })
  }, [])

  const Card = ({ label, value }: { label: string; value: string | number }) => (
    <div className="event-card" style={{ padding: 24, cursor: 'default' }}>
      <div className="bebas" style={{ fontSize: '2.4rem', color: 'var(--gold)' }}>{value}</div>
      <div className="text-muted-c" style={{ letterSpacing: '.12em', fontSize: '.8rem' }}>{label}</div>
    </div>
  )

  if (!stats) return <p className="text-muted-c">Loading…</p>

  return (
    <div>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        <Card label="EVENTS" value={stats.events} />
        <Card label="BOOKINGS" value={stats.bookings} />
        <Card label="SEATS SOLD" value={stats.seatsSold} />
        <Card label="REVENUE PAID" value={`€${stats.revenuePaid.toFixed(0)}`} />
        <Card label="PENDING" value={`€${stats.revenuePending.toFixed(0)}`} />
        <Card label="LEADS" value={stats.leads} />
        <Card label="CUSTOMERS" value={stats.customers} />
      </div>

      <h2 className="bebas" style={{ fontSize: '1.3rem', margin: '30px 0 12px' }}>Cupo por evento</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {events.map(e => {
          const pct = e.capacity ? Math.min(100, Math.round((e.sold / e.capacity) * 100)) : 0
          return (
            <div key={e.id} className="event-card" style={{ padding: '14px 18px', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <span className="bebas" style={{ fontSize: '1.05rem' }}>{e.boat_name} · {e.date}</span>
                <span className="text-muted-c" style={{ fontSize: '.85rem' }}>
                  {e.sold}/{e.capacity} plazas · {e.status}
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: 'var(--bg-secondary)', border: '1px solid var(--border-soft)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? 'var(--orange)' : 'var(--gold)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
