import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useT } from '../i18n'

// Supabase envía el link de recuperación con los tokens en el fragmento #...
// de la URL. Con HashRouter eso choca con el propio '#/ruta' del router, así
// que en vez de depender de una ruta, escuchamos el evento PASSWORD_RECOVERY
// globalmente: aparezca donde aparezca el usuario, se muestra este overlay.
export default function ResetPasswordGate() {
  const [active, setActive] = useState(false)
  const [password, setPassword] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')
  const { t } = useT()
  const nav = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setActive(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('saving'); setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setState('error'); return }
    setState('ok')
    setTimeout(() => { setActive(false); nav('/account') }, 1500)
  }

  if (!active) return null

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,10,15,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="event-card fade-up" style={{ padding: 28, cursor: 'default', width: '100%', maxWidth: 380 }}>
        <p className="bebas" style={{ fontSize: '1.5rem', color: 'var(--gold)', margin: '0 0 4px' }}>{t('auth.resetTitle')}</p>
        {state === 'ok' ? (
          <p className="text-muted-c" style={{ fontSize: '.9rem' }}>{t('auth.resetOk')}</p>
        ) : (
          <form onSubmit={submit} style={{ marginTop: 14 }}>
            <input className="form-input" type="password" minLength={6} required autoFocus
              placeholder={t('auth.resetNew')} value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem', margin: '0 0 12px' }}>{error}</p>}
            <button className="btn-gold" style={{ width: '100%' }} type="submit" disabled={state === 'saving'}>
              {state === 'saving' ? t('auth.wait') : t('auth.resetSave')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
