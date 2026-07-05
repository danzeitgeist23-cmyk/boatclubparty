import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export default function AccountPage() {
  const { session, profile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setWhatsapp(profile.whatsapp ?? '')
    }
  }, [profile])

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!session) return
    setState('saving')
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, whatsapp })
      .eq('id', session.user.id)
    setState(error ? 'error' : 'ok')
  }

  return (
    <div className="fade-up" style={{ maxWidth: 480 }}>
      <h1 className="bebas" style={{ fontSize: '2.2rem', margin: '0 0 4px' }}>My details</h1>
      <p className="text-muted-c" style={{ margin: '0 0 26px', fontSize: '.9rem' }}>
        We use your WhatsApp to confirm bookings and send your event photos.
      </p>

      <form onSubmit={save}>
        <label className="form-label">Email</label>
        <input className="form-input" value={session?.user.email ?? ''} disabled />
        <label className="form-label">Full name</label>
        <input className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" />
        <label className="form-label">WhatsApp</label>
        <input className="form-input" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+34 600 000 000" type="tel" />
        <button className="btn-gold" type="submit" disabled={state === 'saving'}>
          {state === 'saving' ? 'SAVING…' : 'SAVE'}
        </button>
        {state === 'ok' && <span style={{ color: 'var(--gold)', marginLeft: 14, fontSize: '.9rem' }}>Saved ✓</span>}
        {state === 'error' && <span style={{ color: 'var(--orange)', marginLeft: 14, fontSize: '.9rem' }}>Error — try again</span>}
      </form>
    </div>
  )
}
