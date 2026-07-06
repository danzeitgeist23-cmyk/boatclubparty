import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type EventRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import { useT } from '../../i18n'

export default function CalendarPage() {
  const settings = useSettings()
  const { t, lang } = useT()
  const [events, setEvents] = useState<EventRow[]>([])
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() } })

  useEffect(() => {
    supabase.from('events').select('*').neq('status', 'cancelled').order('date')
      .then(({ data }) => setEvents((data as EventRow[]) ?? []))
  }, [])

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1)
    const start = (first.getDay() + 6) % 7 // lunes = 0
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
    const cells: (number | null)[] = [
      ...Array.from({ length: start }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7) cells.push(null)
    return cells
  }, [cursor])

  const monthKey = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}`
  const byDay = useMemo(() => {
    const map: Record<number, EventRow[]> = {}
    events.filter(e => e.date.startsWith(monthKey)).forEach(e => {
      const d = Number(e.date.slice(8, 10))
      ;(map[d] ??= []).push(e)
    })
    return map
  }, [events, monthKey])

  // días de la semana y nombre de mes en el idioma activo, empezando en lunes
  const days = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(lang, { weekday: 'short' })
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, i + 1))) // 2024-01-01 = lunes
  }, [lang])
  const monthName = new Date(cursor.y, cursor.m, 1).toLocaleString(lang, { month: 'long' })
  const today = new Date()
  const isToday = (d: number) => today.getFullYear() === cursor.y && today.getMonth() === cursor.m && today.getDate() === d

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px 80px' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', margin: 0 }}>{t('cal.kicker')}</p>
        <h1 className="bebas" style={{ fontSize: 'clamp(2.6rem, 8vw, 4rem)', margin: '10px 0 8px', lineHeight: .95 }}>{t('cal.title')}</h1>
        <p className="text-muted-c" style={{ maxWidth: 520, margin: '0 0 30px' }}>
          {t('cal.sub')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button className="qty-btn" aria-label="Previous month"
            onClick={() => setCursor(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}>‹</button>
          <span className="bebas" style={{ fontSize: '1.6rem', letterSpacing: '.08em' }}>{monthName} {cursor.y}</span>
          <button className="qty-btn" aria-label="Next month"
            onClick={() => setCursor(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}>›</button>
        </div>

        <div className="cal-grid">
          {days.map(d => <div key={d} className="cal-head">{d}</div>)}
          {grid.map((d, i) => (
            <div key={i} className="cal-cell" style={d && isToday(d) ? { borderColor: 'var(--gold)' } : undefined}>
              {d && <span className="text-muted-c" style={{ fontSize: '.72rem' }}>{d}</span>}
              {d && (byDay[d] ?? []).map(e => (
                <Link key={e.id} to={`/events/${e.slug}`} className="cal-event" title={`${e.boat_name} · ${e.time_start.slice(0, 5)}`}>
                  <span className="bebas" style={{ fontSize: '.72rem', letterSpacing: '.05em' }}>
                    {e.time_start.slice(0, 5)} {e.boat_name}
                  </span>
                  {e.status === 'sold_out' && <span style={{ fontSize: '.58rem', color: 'var(--orange)' }}> {t('cal.full')}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {settings.gcal_embed_url && (
          <div style={{ marginTop: 44 }}>
            <h2 className="bebas" style={{ fontSize: '1.4rem', margin: '0 0 12px' }}>Google Calendar</h2>
            <iframe
              title="Boat Club Party Google Calendar"
              src={settings.gcal_embed_url}
              style={{ width: '100%', height: 500, border: '1px solid var(--border-soft)', borderRadius: 12 }}
              loading="lazy"
            />
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
