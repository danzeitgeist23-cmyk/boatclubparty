import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, type EventRow, type MediaItemRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import { useT } from '../../i18n'
import { waLink } from '../../lib/whatsapp'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import Img from '../../components/Img'
import Price from '../../components/Price'

const TYPE_KEY: Record<MediaItemRow['type'], string> = {
  photo_pack: 'media.typePack',
  video: 'media.typeVideo',
  single_photo: 'media.typeSingle',
}

export default function MediaPage() {
  const { slug } = useParams()
  const settings = useSettings()
  const { t } = useT()
  const [event, setEvent] = useState<EventRow | null | undefined>(undefined)
  const [items, setItems] = useState<MediaItemRow[] | null>(null)

  useEffect(() => {
    if (!slug) return
    supabase.from('events').select('*').eq('slug', slug).single()
      .then(({ data }) => setEvent((data as EventRow) ?? null))
  }, [slug])

  useEffect(() => {
    if (!event) return
    supabase.from('media_items').select('id,event_id,type,title,preview_url,price')
      .eq('event_id', event.id).order('created_at')
      .then(({ data }) => setItems((data as MediaItemRow[]) ?? []))
  }, [event])

  if (event === undefined) return <div style={{ minHeight: '100vh' }}><Nav /><p className="text-muted-c" style={{ padding: 40, textAlign: 'center' }}>{t('media.loading')}</p></div>
  if (event === null) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 className="bebas" style={{ fontSize: '2rem' }}>{t('event.notFound')}</h1>
          <Link className="btn-gold" to="/">{t('event.backHome')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 20px 70px' }}>
        <Link to={`/events/${event.slug}`} className="nav-link" style={{ fontSize: '.85rem' }}>
          {t('media.back', { event: event.boat_name })}
        </Link>

        <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.75rem', margin: '18px 0 6px' }}>{t('media.kicker')}</p>
        <h1 className="bebas" style={{ fontSize: 'clamp(2.4rem, 7vw, 3.6rem)', margin: '0 0 10px', lineHeight: .95 }}>{t('media.title')}</h1>
        <p className="text-muted-c" style={{ maxWidth: 560, margin: '0 0 34px' }}>
          {t('media.sub', { event: event.boat_name })}
        </p>

        {items === null ? (
          <p className="text-muted-c">{t('media.loading')}</p>
        ) : items.length === 0 ? (
          <div className="event-card" style={{ padding: 36, cursor: 'default', maxWidth: 480, textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 14px' }}>
              <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5.5-4-4.5 4-3-2-5 3" />
            </svg>
            <p className="bebas" style={{ fontSize: '1.3rem', margin: '0 0 6px' }}>{t('media.emptyTitle')}</p>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.9rem' }}>{t('media.emptyText')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {items.map(item => {
              const msg = `Hola! I want to buy "${item.title}" from ${event.boat_name} (${event.date}) — €${Number(item.price).toFixed(0)} 🚤`
              return (
                <article key={item.id} className="event-card">
                  <div style={{ position: 'relative' }}>
                    <Img src={item.preview_url} alt={item.title} ratio="4/3" />
                    <span className="type-badge" style={{ position: 'absolute', top: 12, left: 12 }}>{t(TYPE_KEY[item.type])}</span>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <h3 className="bebas" style={{ fontSize: '1.3rem', margin: '0 0 12px' }}>{item.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <Price value={item.price} prefix="" />
                      <a className="btn-gold" style={{ padding: '9px 16px', fontSize: '.85rem' }}
                        href={waLink(settings.whatsapp_number, msg)} target="_blank" rel="noreferrer">
                        {t('media.buy')}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
