import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ThemeToggle from '../../components/ThemeToggle'

export default function AdminLayout() {
  const nav = useNavigate()
  const logout = async () => { await supabase.auth.signOut(); nav('/admin/login') }

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--gold)' : 'var(--text-muted)',
    textDecoration: 'none', letterSpacing: '.08em', fontSize: '.85rem',
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid var(--border-soft)' }}>
        <span className="bebas" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>BCP ADMIN</span>
        <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <NavLink to="/admin/dashboard" style={linkStyle}>DASHBOARD</NavLink>
          <NavLink to="/admin/events" style={linkStyle}>EVENTS</NavLink>
          <ThemeToggle />
          <button className="btn-outline" style={{ padding: '6px 16px', fontSize: '.85rem' }} onClick={logout}>LOGOUT</button>
        </nav>
      </header>
      <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
