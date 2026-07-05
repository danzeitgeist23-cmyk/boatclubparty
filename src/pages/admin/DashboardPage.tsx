import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({ events: 0, tickets: 0, leads: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('tickets').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
    ]).then(([e, t, l]) =>
      setStats({ events: e.count ?? 0, tickets: t.count ?? 0, leads: l.count ?? 0 })
    )
  }, [])

  const Card = ({ label, value }: { label: string; value: number }) => (
    <div className="event-card" style={{ padding: 24, cursor: 'default' }}>
      <div className="bebas" style={{ fontSize: '2.4rem', color: 'var(--gold)' }}>{value}</div>
      <div className="text-muted-c" style={{ letterSpacing: '.12em', fontSize: '.8rem' }}>{label}</div>
    </div>
  )

  return (
    <div>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Card label="EVENTS" value={stats.events} />
        <Card label="TICKETS" value={stats.tickets} />
        <Card label="LEADS" value={stats.leads} />
      </div>
    </div>
  )
}
