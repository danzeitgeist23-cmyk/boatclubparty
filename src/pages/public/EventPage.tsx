import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, type DjRow, type EventRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import { useAuth } from '../../hooks/useAuth'
import { activeTier, totalDiscountPercent, discountedPrice, type Tier } from '../../lib/discounts'
import { waLink } from '../../lib/whatsapp'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import ShareButtons from '../../components/ShareButtons'
import Img from '../../components/Img'

type EventWithLineup = EventRow & {
  event_djs: { role: 'headliner' | 'support'; sort: number; djs: DjRow | null }[]
}

export default function EventPage() {
  const { slug } = useParams()
  const settings = useSettings()
  const { session, profile } = useAuth()
  const [event, setEvent] = useState<EventWithLineup | null | undefined>(undefined)
  const [tiers, setTiers] = useState<Tier[]>([])
  const [qty, setQty] = useState(2)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('events')
      .select('*, event_djs(role, sort, djs(*))')
      .eq('slug', slug)
      .single()
      .then(({ data }) => setEvent((data as unknown as EventWithLineup) ?? null))
    supabase.from('discount_tiers').select('*').order('min_bookings')
      .then(({ data }) => setTiers((data as Tier[]) ?? []))
  }, [slug])

  const discount = useMemo(() => {
    if (!profile) return 0
    const tier = activeTier(tiers, profile.bookings_count)
    const familyPercent = profile.is_family ? Number(settings.family_discount_percent ?? 0) : 0
    return totalDiscountPercent(tier?.percent ?? 0, familyPercent)
  }, [profile, tiers, settings.family_discount_percent])

  if (event === undefined) return <div style={{ minHeight: '100vh' }}><Nav /><p className="text-muted-c" style={{ padding: 40, textAlign: 'center' }}>Loading event…</p></div>
  if (event === null) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1 className="bebas" style={{ fontSize: '2rem' }}>Event not found</h1>
          <Link className="btn-gold" to="/">Back to home</Link>
        </div>
      </div>
    )
  }

  const soldOut = event.status === 'sold_out'
  const base = Number(event.price_general)
  const unit = discount > 0 ? discountedPrice(base, discount) : base
  const total = unit * qty
  const lineup = [...event.event_djs].sort((a, b) => a.sort - b.sort)
  const tierLabel = profile ? activeTier(tiers, profile.bookings_count)?.label : null

  const waMsg = profile
    ? `Hola! I'm ${profile.full_name ?? 'a member'}${tierLabel ? ` (${tierLabel}${profile.is_family ? ' + Family' : ''}, ${discount}% off)` : ''} — I want to book ${event.boat_name} (${event.date}) x${qty} → €${total.toFixed(0)} total 🚤`
    : `Hola! I want to book ${event.boat_name} (${event.date}) x${qty} people 🚤`

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 20px 70px' }}>
        <Link to="/" className="nav-link" style={{ fontSize: '.85rem' }}>← All events</Link>

        <div className="event-detail-grid" style={{ marginTop: 18 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden' }}>
            <Img src={event.cover_image} alt={event.boat_name} ratio="4/5" />
          </div>

          <div>
            {soldOut && <span className="badge-live" style={{ position: 'static', display: 'inline-block', marginBottom: 12 }}>SOLD OUT</span>}
            <p style={{ color: 'var(--gold)', letterSpacing: '.22em', fontSize: '.75rem', margin: 0 }}>
              {event.date} · {event.time_start.slice(0, 5)}–{event.time_end.slice(0, 5)} · {event.marina}
            </p>
            <h1 className="bebas" style={{ fontSize: 'clamp(2.6rem, 7vw, 4rem)', margin: '8px 0 10px', lineHeight: .95 }}>
              {event.boat_name}
            </h1>
            <p className="text-muted-c" style={{ margin: '0 0 18px', lineHeight: 1.6 }}>
              {event.description ?? 'Open bar, live DJs and limited capacity on the Atlantic.'}
            </p>

            {(event.genres || event.bpm) && (
              <p style={{ margin: '0 0 22px', fontSize: '.9rem' }}>
                {event.genres && <span style={{ color: 'var(--text-primary)' }}>{event.genres}</span>}
                {event.bpm && <span className="text-muted-c"> · {event.bpm} BPM</span>}
              </p>
            )}

            {lineup.length > 0 && (
              <div style={{ marginBottom: 26 }}>
                <p className="bebas" style={{ letterSpacing: '.15em', margin: '0 0 12px', fontSize: '1.05rem' }}>LINEUP</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {lineup.map(l => l.djs && (
                    <Link key={l.djs.id} to="/djs" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', width: 92 }}>
                      <div style={{ borderRadius: '50%', overflow: 'hidden', border: l.role === 'headliner' ? '2px solid var(--gold)' : '1px solid var(--border-soft)' }}>
                        <Img src={l.djs.image} alt={l.djs.name} ratio="1/1" />
                      </div>
                      <p className="bebas" style={{ margin: '6px 0 0', fontSize: '.9rem', lineHeight: 1.1 }}>{l.djs.name}</p>
                      <p className="text-muted-c" style={{ margin: 0, fontSize: '.62rem', letterSpacing: '.12em' }}>{l.role.toUpperCase()}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="event-card" style={{ padding: 22, cursor: 'default', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                {discount > 0 ? (
                  <>
                    <span className="text-muted-c" style={{ textDecoration: 'line-through', fontSize: '1.05rem' }}>€{base.toFixed(0)}</span>
                    <span className="bebas" style={{ color: 'var(--gold)', fontSize: '2rem' }}>€{unit.toFixed(0)}</span>
                    <span className="bebas" style={{ border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: 999, padding: '3px 12px', fontSize: '.78rem', letterSpacing: '.1em' }}>
                      {tierLabel?.toUpperCase()}{profile?.is_family ? ' + FAMILY' : ''} −{discount}%
                    </span>
                  </>
                ) : (
                  <span className="bebas" style={{ color: 'var(--gold)', fontSize: '2rem' }}>€{base.toFixed(0)}</span>
                )}
                <span className="text-muted-c" style={{ fontSize: '.85rem' }}>per person · open bar included</span>
              </div>

              {!soldOut && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '18px 0' }}>
                    <span className="text-muted-c" style={{ fontSize: '.85rem' }}>Guests</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button className="qty-btn" aria-label="Less" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                      <span className="bebas" style={{ fontSize: '1.4rem', minWidth: 28, textAlign: 'center' }}>{qty}</span>
                      <button className="qty-btn" aria-label="More" onClick={() => setQty(q => Math.min(20, q + 1))}>+</button>
                    </div>
                    <span className="bebas" style={{ marginLeft: 'auto', fontSize: '1.3rem' }}>€{total.toFixed(0)}</span>
                  </div>
                  <a className="btn-gold" style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
                    href={waLink(settings.whatsapp_number, waMsg)} target="_blank" rel="noreferrer">
                    BOOK VIA WHATSAPP
                  </a>
                  {!session && (
                    <p className="text-muted-c" style={{ fontSize: '.78rem', margin: '10px 0 0' }}>
                      <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link> to unlock member discounts.
                    </p>
                  )}
                </>
              )}
            </div>

            <ShareButtons title={`${event.boat_name} · ${event.date} · Boat Club Party`} />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
