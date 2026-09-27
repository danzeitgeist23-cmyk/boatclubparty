import { Link } from 'react-router-dom'
import type { EventRow } from '../../lib/supabase'
import Img from '../Img'
import Price from '../Price'
import { useT } from '../../i18n'
import { localizedEventText } from '../../lib/eventContent'

function durationHours(e: EventRow): number {
  const [h1, m1] = e.time_start.split(':').map(Number)
  const [h2, m2] = e.time_end.split(':').map(Number)
  return Math.max(0, Math.round((h2 * 60 + m2 - h1 * 60 - m1) / 60))
}

// Resumen corto para la card de home — la ficha del evento sí muestra el
// texto completo. Solo el primer párrafo, cortado por palabra.
function summarize(text: string, max = 100): string {
  const firstPara = text.split('\n\n')[0].trim()
  if (firstPara.length <= max) return firstPara
  const cut = firstPara.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`
}

export default function EventsSection({ events, loading }: {
  events: EventRow[]
  loading: boolean
}) {
  const { t, lang } = useT()
  return (
    <section id="events" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 20px' }}>
      <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.75rem', margin: '0 0 6px' }}>{t('events.kicker')}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span className="section-num">01</span>
        <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('events.title')}</h2>
      </div>
      <p className="text-muted-c" style={{ margin: '10px 0 32px', maxWidth: 520 }}>
        {t('events.sub')}
      </p>

      {loading ? (
        <p className="text-muted-c">{t('events.loading')}</p>
      ) : (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {events.map(e => {
            const soldOut = e.status === 'sold_out'
            const description = localizedEventText(e, lang).description ?? t('events.fallbackDesc')
            return (
              <article key={e.id} className="event-card">
                <Link to={`/events/${e.slug}`} style={{ display: 'block', position: 'relative' }}>
                  <Img src={e.cover_image} alt={`${e.boat_name} boat party`} ratio="4/5" />
                  <span className="badge-live">
                    {soldOut ? t('events.soldout') : t('events.live', { h: durationHours(e) })}
                  </span>
                </Link>
                <div style={{ padding: '18px 18px 22px' }}>
                  {e.event_type && (
                    <span className="type-badge" style={{ marginBottom: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4.5 13.5h5L9.5 22 19 10h-5.5z" /></svg>
                      {e.event_type}
                    </span>
                  )}
                  <h3 className="bebas" style={{ fontSize: '1.6rem', margin: '0 0 2px' }}>
                    <Link to={`/events/${e.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{e.boat_name}</Link>
                  </h3>
                  <p className="text-muted-c" style={{ fontSize: '.85rem', margin: '0 0 10px' }}>
                    {summarize(description)}
                  </p>
                  <p style={{ fontSize: '.82rem', margin: '0 0 14px' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{e.time_start.slice(0, 5)}–{e.time_end.slice(0, 5)}</span>
                    <span className="text-muted-c"> · {e.date} · {e.marina}</span>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <Price value={e.price_general} />
                    {soldOut ? (
                      <span className="bebas" style={{ color: 'var(--text-muted)', letterSpacing: '.1em' }}>{t('events.soldout')}</span>
                    ) : (
                      <Link className="btn-gold" style={{ padding: '9px 18px', fontSize: '.9rem' }} to={`/events/${e.slug}`}>
                        {t('events.book')}
                      </Link>
                    )}
                  </div>
                  <Link to={`/media/${e.slug}`} className="nav-link" style={{ fontSize: '.78rem', display: 'inline-block', marginTop: 10 }}>
                    {t('media.cta')} →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
