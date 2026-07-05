import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'
import { activeTier, nextTier, totalDiscountPercent, DISCOUNT_CAP, type Tier } from '../../lib/discounts'

export default function RewardsPage() {
  const { profile } = useAuth()
  const settings = useSettings()
  const [tiers, setTiers] = useState<Tier[]>([])

  useEffect(() => {
    supabase
      .from('discount_tiers')
      .select('*')
      .order('min_bookings')
      .then(({ data }) => setTiers((data as Tier[]) ?? []))
  }, [])

  if (!profile || tiers.length === 0) return <p className="text-muted-c">Loading rewards…</p>

  const bookings = profile.bookings_count
  const current = activeTier(tiers, bookings)
  const next = nextTier(tiers, bookings)
  const familyPercent = profile.is_family ? Number(settings.family_discount_percent ?? 0) : 0
  const total = totalDiscountPercent(current?.percent ?? 0, familyPercent)
  const progress = next ? Math.min(100, (bookings / next.min_bookings) * 100) : 100

  return (
    <div className="fade-up" style={{ maxWidth: 640 }}>
      <h1 className="bebas" style={{ fontSize: '2.2rem', margin: '0 0 4px' }}>Rewards</h1>
      <p className="text-muted-c" style={{ margin: '0 0 26px', fontSize: '.9rem' }}>
        Every paid booking levels you up. Discounts apply automatically when you book.
      </p>

      <div className="event-card" style={{ padding: 26, cursor: 'default', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.75rem', letterSpacing: '.2em' }}>CURRENT TIER</p>
            <p className="bebas" style={{ fontSize: '2.6rem', lineHeight: 1.1, margin: 0, color: 'var(--gold)' }}>
              {current?.label ?? 'Rookie'}
            </p>
            <p className="text-muted-c" style={{ margin: '4px 0 0', fontSize: '.85rem' }}>
              {bookings} paid {bookings === 1 ? 'booking' : 'bookings'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.75rem', letterSpacing: '.2em' }}>ACTIVE DISCOUNT</p>
            <p className="bebas" style={{ fontSize: '2.6rem', lineHeight: 1.1, margin: 0 }}>{total}%</p>
            {profile.is_family && (
              <span className="bebas" style={{ border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: 999, padding: '3px 12px', fontSize: '.8rem', letterSpacing: '.12em' }}>
                ⚓ BOAT CLUB FAMILY +{familyPercent}%
              </span>
            )}
          </div>
        </div>

        {next && (
          <div style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: 6 }}>
              <span className="text-muted-c">Progress to {next.label} ({next.percent}%)</span>
              <span style={{ color: 'var(--gold)' }}>{bookings}/{next.min_bookings}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-secondary)', border: '1px solid var(--border-soft)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', transition: 'width .4s' }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {tiers.map(t => {
          const reached = bookings >= t.min_bookings
          return (
            <div key={t.label} className="event-card" style={{ padding: 18, cursor: 'default', textAlign: 'center', opacity: reached ? 1 : .55, borderColor: reached ? 'var(--gold)' : undefined }}>
              <p className="bebas" style={{ fontSize: '1.4rem', margin: 0, color: reached ? 'var(--gold)' : 'var(--text-primary)' }}>{t.label}</p>
              <p className="text-muted-c" style={{ margin: '4px 0 0', fontSize: '.8rem' }}>{t.min_bookings}+ bookings → {t.percent}%</p>
            </div>
          )
        })}
      </div>

      <p className="text-muted-c" style={{ fontSize: '.78rem', marginTop: 18 }}>
        Tier and Family discounts combine, capped at {DISCOUNT_CAP}%. Applied to your booking message on WhatsApp — payment stays personal, like always.
      </p>
    </div>
  )
}
