import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const login = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else nav('/admin/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div className="bebas" style={{ fontSize: '1.8rem', color: 'var(--gold)', textAlign: 'center', marginBottom: 24 }}>
          BCP · ADMIN
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
          style={{ width: '100%', padding: 12, marginBottom: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-soft)', borderRadius: 6, color: 'var(--text-primary)' }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', padding: 12, marginBottom: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-soft)', borderRadius: 6, color: 'var(--text-primary)' }} />
        {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{error}</p>}
        <button className="btn-gold" style={{ width: '100%' }} onClick={login} disabled={loading}>
          {loading ? 'SIGNING IN…' : 'SIGN IN'}
        </button>
      </div>
    </div>
  )
}
