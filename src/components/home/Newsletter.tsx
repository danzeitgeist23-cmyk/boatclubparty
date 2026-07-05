import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setState('sending')
    const { error } = await supabase.from('leads').insert({ email, source: 'newsletter' })
    setState(error ? 'error' : 'ok')
    if (!error) setEmail('')
  }

  return (
    <section id="newsletter" style={{ maxWidth: 800, margin: '0 auto', padding: '70px 20px', textAlign: 'center' }}>
      <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', margin: 0 }}>Don't miss the next departure</h2>
      <p className="text-muted-c" style={{ margin: '10px 0 26px' }}>
        New dates, early-bird prices and secret parties — straight to your inbox.
      </p>

      {state === 'ok' ? (
        <p className="bebas fade-up" style={{ color: 'var(--gold)', fontSize: '1.3rem', letterSpacing: '.08em' }}>
          YOU'RE ON THE LIST ⚓
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="newsletter-input"
          />
          <button className="btn-gold" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Joining…' : 'Join'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p style={{ color: 'var(--orange)', fontSize: '.85rem', marginTop: 12 }}>
          Something went wrong — try again or write us on WhatsApp.
        </p>
      )}
    </section>
  )
}
