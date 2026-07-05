import { Navigate, NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from '../../components/ThemeToggle'

export default function AccountLayout() {
  const { session, profile, loading, signOut } = useAuth()
  const nav = useNavigate()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--gold)' : 'var(--text-muted)',
    textDecoration: 'none', letterSpacing: '.08em', fontSize: '.85rem',
    fontFamily: "'Bebas Neue', sans-serif",
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="nav-blur" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/" className="bebas" style={{ color: 'var(--gold)', fontSize: '1.2rem', textDecoration: 'none' }}>
            BOAT CLUB PARTY
          </Link>
          <nav style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
            <NavLink to="/account" end style={linkStyle}>MY DETAILS</NavLink>
            <NavLink to="/account/bookings" style={linkStyle}>BOOKINGS</NavLink>
            <NavLink to="/account/rewards" style={linkStyle}>REWARDS</NavLink>
            {profile?.role === 'admin' && <NavLink to="/admin/dashboard" style={linkStyle}>ADMIN</NavLink>}
            <ThemeToggle />
            <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '.8rem' }}
              onClick={async () => { await signOut(); nav('/') }}>
              SIGN OUT
            </button>
          </nav>
        </div>
      </header>
      <main style={{ padding: '30px 20px 60px', maxWidth: 900, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
