import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ThemeToggle from '../../components/ThemeToggle'

function Icon({ path }: { path: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path}
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <Icon path={<><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>} /> },
  { to: '/admin/events', label: 'Events', icon: <Icon path={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} /> },
  { to: '/admin/djs', label: 'DJs', icon: <Icon path={<><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="2.5" y="13" width="4" height="6" rx="1.5" /><rect x="17.5" y="13" width="4" height="6" rx="1.5" /></>} /> },
  { to: '/admin/moments', label: 'Moments', icon: <Icon path={<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M21 16l-5.5-5.5L6 20" /></>} /> },
  { to: '/admin/media', label: 'Media', icon: <Icon path={<><path d="M20.6 12.3L12.7 20.2a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8L11.8 3.5H19a2 2 0 0 1 2 2v6.8z" /><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" /></>} /> },
  { to: '/admin/messages', label: 'Messages', icon: <Icon path={<path d="M4 4h16v12H8l-4 4z" />} /> },
  { to: '/admin/connectors', label: 'Connectors', icon: <Icon path={<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>} /> },
]

export default function AdminLayout() {
  const nav = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const logout = async () => { await supabase.auth.signOut(); nav('/admin/login') }

  const title = NAV_ITEMS.find(i => location.pathname.startsWith(i.to))?.label ?? 'Admin'

  return (
    <div className="admin-shell">
      <div className="admin-topbar-mobile">
        <button aria-label="Open menu" onClick={() => setOpen(true)}
          style={{ background: 'transparent', border: '1px solid var(--border-soft)', borderRadius: 8, color: 'var(--text-primary)', width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <span className="bebas" style={{ color: 'var(--gold)', fontSize: '1.1rem', letterSpacing: '.06em' }}>{title.toUpperCase()}</span>
        <ThemeToggle />
      </div>

      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 20px' }}>
          <span className="bebas" style={{ color: 'var(--gold)', fontSize: '1.25rem', letterSpacing: '.04em' }}>BCP ADMIN</span>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="admin-sidebar-close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}
              className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}>
              {item.icon}
              {item.label.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginTop: 10, borderTop: '1px solid var(--border-soft)' }}>
          <ThemeToggle />
          <button className="btn-outline" style={{ padding: '6px 16px', fontSize: '.8rem' }} onClick={logout}>LOGOUT</button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
