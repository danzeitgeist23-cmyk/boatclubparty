import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useT } from '../../i18n'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const { session, loading } = useAuth()
  const { t } = useT()
  const [mode, setMode] = useState<Mode>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  if (!loading && session) return <Navigate to="/account" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setError('')
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) setError(error.message)
      else if (!data.session) setConfirmSent(true) // confirmación por email activada
    }
    setBusy(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link to="/" className="bebas" style={{ display: 'block', fontSize: '1.8rem', color: 'var(--gold)', textAlign: 'center', marginBottom: 6, textDecoration: 'none' }}>
          BOAT CLUB PARTY
        </Link>
        <p className="text-muted-c" style={{ textAlign: 'center', margin: '0 0 26px', fontSize: '.9rem' }}>
          {mode === 'login' ? t('auth.back') : t('auth.join')}
        </p>

        {confirmSent ? (
          <div className="event-card fade-up" style={{ padding: 24, textAlign: 'center', cursor: 'default' }}>
            <p className="bebas" style={{ fontSize: '1.3rem', color: 'var(--gold)', margin: '0 0 8px' }}>{t('auth.checkTitle')}</p>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.9rem' }}>
              {t('auth.checkText', { email })}
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            {mode === 'register' && (
              <input className="form-input" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder={t('auth.name')} autoComplete="name" required />
            )}
            <input className="form-input" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={t('auth.email')} type="email" autoComplete="email" required />
            <input className="form-input" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={t('auth.pass')} type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required />
            {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem', margin: '0 0 12px' }}>{error}</p>}
            <button className="btn-gold" style={{ width: '100%' }} type="submit" disabled={busy}>
              {busy ? t('auth.wait') : mode === 'login' ? t('auth.signin') : t('auth.create')}
            </button>
          </form>
        )}

        {!confirmSent && (
          <p className="text-muted-c" style={{ textAlign: 'center', fontSize: '.85rem', marginTop: 18 }}>
            {mode === 'login' ? (
              <>{t('auth.no')}{' '}
                <button className="link-btn" onClick={() => { setMode('register'); setError('') }}>{t('auth.joinLink')}</button>
              </>
            ) : (
              <>{t('auth.yes')}{' '}
                <button className="link-btn" onClick={() => { setMode('login'); setError('') }}>{t('auth.signinLink')}</button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
