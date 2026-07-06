import { useState, type FormEvent } from 'react'
import { supabase, type EventRow } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { waLink } from '../lib/whatsapp'
import { useT } from '../i18n'

// Reserva real: inserta ticket 'pending' (cuenta contra el cupo vía trigger)
// y abre WhatsApp para confirmar el pago (fase 1: cobro manual).
export default function BookingForm({ event, unitPrice, discountLabel, whatsapp }: {
  event: EventRow
  unitPrice: number
  discountLabel?: string
  whatsapp?: string
}) {
  const { session, profile } = useAuth()
  const { t } = useT()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [qty, setQty] = useState(2)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'full' | 'error'>('idle')

  const left = Math.max(0, event.capacity - event.sold)
  const total = unitPrice * qty

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase.from('tickets').insert({
      event_id: event.id,
      name: name || profile?.full_name || 'Guest',
      email,
      whatsapp: phone || profile?.whatsapp || null,
      ticket_type: 'general',
      quantity: qty,
      total,
      status: 'pending',
      user_id: session?.user.id ?? null,
    })
    if (error) {
      setState(error.message.includes('SOLD_OUT') ? 'full' : 'error')
      return
    }
    setState('ok')
    const msg = `Hola! Booking request: ${event.boat_name} (${event.date}) — ${qty}x general${discountLabel ? ` · ${discountLabel}` : ''} → €${total.toFixed(0)} total. Name: ${name} 🚤`
    window.open(waLink(whatsapp, msg), '_blank')
  }

  if (state === 'ok') {
    return (
      <div className="fade-up" style={{ textAlign: 'center', padding: '14px 0' }}>
        <p className="bebas" style={{ color: 'var(--gold)', fontSize: '1.4rem', margin: '0 0 6px' }}>{t('book.reserved')}</p>
        <p className="text-muted-c" style={{ margin: 0, fontSize: '.88rem' }}>{t('book.reservedText')}</p>
      </div>
    )
  }

  if (state === 'full' || left === 0) {
    return <p className="bebas" style={{ color: 'var(--orange)', letterSpacing: '.1em', textAlign: 'center' }}>{t('book.full')}</p>
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="text-muted-c" style={{ fontSize: '.85rem' }}>{t('book.guests')}</span>
          <button type="button" className="qty-btn" aria-label="Less" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <span className="bebas" style={{ fontSize: '1.4rem', minWidth: 28, textAlign: 'center' }}>{qty}</span>
          <button type="button" className="qty-btn" aria-label="More" onClick={() => setQty(q => Math.min(left, q + 1))}>+</button>
        </div>
        <span className="bebas" style={{ fontSize: '1.3rem' }}>€{total.toFixed(0)}</span>
      </div>
      {left <= 15 && (
        <p style={{ color: 'var(--orange)', fontSize: '.8rem', margin: '0 0 12px' }}>{t('book.left', { n: left })}</p>
      )}
      <input className="form-input" placeholder={t('book.name')} value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
      <input className="form-input" placeholder={t('book.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
      <input className="form-input" placeholder={t('book.wa')} type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
      {state === 'error' && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{t('book.error')}</p>}
      <button className="btn-gold" type="submit" disabled={state === 'sending'} style={{ width: '100%', boxSizing: 'border-box' }}>
        {state === 'sending' ? t('book.reserving') : t('book.now')}
      </button>
      <p className="text-muted-c" style={{ fontSize: '.75rem', margin: '10px 0 0', textAlign: 'center' }}>
        {t('book.cancel')}
      </p>
    </form>
  )
}
