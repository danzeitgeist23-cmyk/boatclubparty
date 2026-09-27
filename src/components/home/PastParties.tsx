import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type EventRow } from '../../lib/supabase'
import { useT } from '../../i18n'
import Img from '../Img'

type PastEvent = EventRow & { media_items: { preview_url: string | null }[] }

// Fiestas ya celebradas que SÍ tienen fotos/vídeo en venta — el resto no se lista
// (nada que vender). Inner join filtra en la propia query.
export default function PastParties() {
  const { t } = useT()
  const [events, setEvents] = useState<PastEvent[] | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    supabase
      .from('events')
      .select('*, media_items!inner(preview_url)')
      .lt('date', today)
      .order('date', { ascending: false })
      .limit(6)
      .then(({ data }) => setEvents((data as unknown as PastEvent[]) ?? []))
  }, [])

  if (events === null || events.length === 0) return null

  return (
    <section id="past-parties" style={{ padding: '70px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.75rem', margin: '0 0 6px' }}>{t('past.kicker')}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">·</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('past.title')}</h2>
        </div>
        <p className="text-muted-c" style={{ margin: '10px 0 32px', maxWidth: 520 }}>{t('past.sub')}</p>

        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {events.map(e => (
            <Link key={e.id} to={`/media/${e.slug}`} className="event-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <Img src={e.cover_image ?? e.media_items[0]?.preview_url} alt={`${e.boat_name} photos`} ratio="4/5" />
              <div style={{ padding: '16px 18px 20px' }}>
                <h3 className="bebas" style={{ fontSize: '1.35rem', margin: '0 0 4px' }}>{e.boat_name}</h3>
                <p className="text-muted-c" style={{ margin: '0 0 12px', fontSize: '.82rem' }}>{e.date}</p>
                <span className="btn-outline" style={{ padding: '8px 16px', fontSize: '.85rem', display: 'inline-block' }}>
                  {t('media.cta')} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
