import type { EventRow } from '../../lib/supabase'
import Img from '../Img'
import Price from '../Price'
import { waLink } from '../../lib/whatsapp'

function durationHours(e: EventRow): number {
  const [h1, m1] = e.time_start.split(':').map(Number)
  const [h2, m2] = e.time_end.split(':').map(Number)
  return Math.max(0, Math.round((h2 * 60 + m2 - h1 * 60 - m1) / 60))
}

export default function EventsSection({ events, loading, whatsapp }: {
  events: EventRow[]
  loading: boolean
  whatsapp?: string
}) {
  return (
    <section id="events" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span className="section-num">01</span>
        <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>Upcoming Events</h2>
      </div>
      <p className="text-muted-c" style={{ margin: '10px 0 32px', maxWidth: 520 }}>
        Limited capacity. Every departure sells out — book early via WhatsApp.
      </p>

      {loading ? (
        <p className="text-muted-c">Loading events…</p>
      ) : (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {events.map(e => {
            const soldOut = e.status === 'sold_out'
            const msg = `Hola! I want to book ${e.boat_name} (${e.date}) x2 people 🚤`
            return (
              <article key={e.id} className="event-card">
                <div style={{ position: 'relative' }}>
                  <Img src={e.cover_image} alt={`${e.boat_name} boat party`} ratio="4/5" />
                  <span className="badge-live">
                    {soldOut ? 'SOLD OUT' : `LIVE · ${durationHours(e)}H ALL INCLUSIVE`}
                  </span>
                </div>
                <div style={{ padding: '18px 18px 22px' }}>
                  <h3 className="bebas" style={{ fontSize: '1.6rem', margin: '0 0 2px' }}>{e.boat_name}</h3>
                  <p className="text-muted-c" style={{ fontSize: '.85rem', margin: '0 0 10px' }}>
                    {e.description ?? 'Open bar · Live DJ · Atlantic sunset'}
                  </p>
                  <p className="text-muted-c" style={{ fontSize: '.82rem', margin: '0 0 14px' }}>
                    {e.date} · {e.time_start.slice(0, 5)}–{e.time_end.slice(0, 5)} · {e.marina}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <Price value={e.price_general} />
                    {soldOut ? (
                      <span className="bebas" style={{ color: 'var(--text-muted)', letterSpacing: '.1em' }}>SOLD OUT</span>
                    ) : (
                      <a className="btn-gold" style={{ padding: '9px 18px', fontSize: '.9rem' }}
                        href={waLink(whatsapp, msg)} target="_blank" rel="noreferrer">
                        Book via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
