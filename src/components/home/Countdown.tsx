import { useEffect, useMemo, useState } from 'react'
import type { EventRow } from '../../lib/supabase'

// ── Timezone Atlantic/Canary sin librerías ──
// El bug histórico (00:00:00) venía de interpretar date+time en la TZ del navegador.
// Aquí: se interpreta el wall-clock del evento EN Canarias y se convierte a UTC real.
function tzOffsetMs(tz: string, at: number): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
    .formatToParts(at)
    .find(p => p.type === 'timeZoneName')?.value ?? 'GMT'
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/)
  if (!m) return 0 // "GMT" a secas = UTC+0
  const sign = m[1] === '-' ? -1 : 1
  return sign * (Number(m[2]) * 3600 + Number(m[3]) * 60) * 1000
}

export function eventStartMs(e: EventRow): number {
  const time = e.time_start.length === 5 ? `${e.time_start}:00` : e.time_start
  const guess = Date.parse(`${e.date}T${time}Z`) // wall-clock leído como UTC…
  return guess - tzOffsetMs('Atlantic/Canary', guess) // …corregido al offset canario real
}

function split(diff: number) {
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
    s: Math.floor(diff / 1_000) % 60,
  }
}

export default function Countdown({ events }: { events: EventRow[] }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const next = useMemo(
    () => events.find(e => e.status === 'available' && eventStartMs(e) > now),
    // el "next" solo cambia al cruzar la hora de salida, no cada segundo
    [events, Math.floor(now / 60_000)], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!next) return null

  const { d, h, m, s } = split(eventStartMs(next) - now)
  const boxes = [
    { v: d, label: 'DAYS' },
    { v: h, label: 'HOURS' },
    { v: m, label: 'MIN' },
    { v: s, label: 'SEC' },
  ]

  return (
    <section id="countdown" className="bg-secondary-c" style={{ padding: '42px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '22px 46px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gold)', letterSpacing: '.22em', fontSize: '.72rem', margin: '0 0 4px' }}>NEXT PARTY SETS SAIL IN</p>
          <p className="bebas" style={{ fontSize: '1.5rem', margin: 0 }}>{next.boat_name} · {next.date}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {boxes.map(b => (
            <div key={b.label} className="cd-box">
              <div className="bebas" style={{ fontSize: '1.9rem', lineHeight: 1, color: 'var(--gold)' }}>
                {String(b.v).padStart(2, '0')}
              </div>
              <div className="text-muted-c" style={{ fontSize: '.62rem', letterSpacing: '.18em', marginTop: 4 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
