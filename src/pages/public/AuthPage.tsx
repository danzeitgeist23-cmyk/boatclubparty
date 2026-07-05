import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const { session, loading } = useAuth()
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
          {mode === 'login' ? 'Welcome back on board' : 'Join the club — earn discounts every party'}
        </p>

        {confirmSent ? (
          <div className="event-card fade-up" style={{ padding: 24, textAlign: 'center', cursor: 'default' }}>
            <p className="bebas" style={{ fontSize: '1.3rem', color: 'var(--gold)', margin: '0 0 8px' }}>CHECK YOUR EMAIL ⚓</p>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.9rem' }}>
              We sent a confirmation link to <strong>{email}</strong>. Click it and come back to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            {mode === 'register' && (
              <input className="form-input" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Full name" autoComplete="name" required />
            )}
            <input className="form-input" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" type="email" autoComplete="email" required />
            <input className="form-input" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password (min. 6 characters)" type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required />
            {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem', margin: '0 0 12px' }}>{error}</p>}
            <button className="btn-gold" style={{ width: '100%' }} type="submit" disabled={busy}>
              {busy ? 'ONE MOMENT…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}

        {!confirmSent && (
          <p className="text-muted-c" style={{ textAlign: 'center', fontSize: '.85rem', marginTop: 18 }}>
            {mode === 'login' ? (
              <>No account yet?{' '}
                <button className="link-btn" onClick={() => { setMode('register'); setError('') }}>Join the club</button>
              </>
            ) : (
              <>Already a member?{' '}
                <button className="link-btn" onClick={() => { setMode('login'); setError('') }}>Sign in</button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
