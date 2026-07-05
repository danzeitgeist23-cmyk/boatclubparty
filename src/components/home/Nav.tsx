import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'

function AccountIcon() {
  return (
    <Link to="/account" aria-label="My account" className="theme-toggle" style={{ textDecoration: 'none' }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
      </svg>
    </Link>
  )
}

// hash → sección de la home · path → página propia
const LINKS = [
  { label: 'Events', hash: '#events' },
  { label: 'DJs', path: '/djs' },
  { label: 'Music', path: '/music' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', hash: '#contact' },
] as const

function NavItem({ link, onClick, style }: { link: (typeof LINKS)[number]; onClick?: () => void; style?: React.CSSProperties }) {
  const onHome = useLocation().pathname === '/'
  if ('path' in link && link.path) {
    return <Link to={link.path} className="nav-link" style={style} onClick={onClick}>{link.label}</Link>
  }
  const hash = 'hash' in link ? link.hash : '#top'
  // fuera de la home, el ancla no existe: volvemos a la home
  return onHome
    ? <a href={hash} className="nav-link" style={style} onClick={onClick}>{link.label}</a>
    : <Link to="/" className="nav-link" style={style} onClick={onClick}>{link.label}</Link>
}

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav-blur" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-soft)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <a href="#top" className="bebas" style={{ fontSize: '1.35rem', color: 'var(--gold)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          BOAT CLUB PARTY
        </a>

        {/* Desktop */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: 26 }}>
          {LINKS.map(l => <NavItem key={l.label} link={l} />)}
          {/* i18n fase 2 — estructura preparada, solo EN */}
          <span className="text-muted-c" style={{ fontSize: '.75rem', letterSpacing: '.15em', border: '1px solid var(--border-soft)', borderRadius: 4, padding: '4px 8px' }}>EN</span>
          <AccountIcon />
          <ThemeToggle />
          <a className="btn-gold" href="#events" style={{ padding: '9px 22px', fontSize: '.95rem' }}>Book Now</a>
        </div>

        {/* Mobile */}
        <div className="nav-mobile" style={{ alignItems: 'center', gap: 10 }}>
          <AccountIcon />
          <ThemeToggle />
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
            style={{ background: 'transparent', border: '1px solid var(--border-soft)', borderRadius: 8, color: 'var(--text-primary)', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="fade-up" style={{ borderTop: '1px solid var(--border-soft)', padding: '10px 20px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {LINKS.map(l => (
            <NavItem key={l.label} link={l} style={{ padding: '10px 0', fontSize: '1rem' }} onClick={() => setOpen(false)} />
          ))}
          <a className="btn-gold" href="#events" style={{ marginTop: 8, textAlign: 'center' }} onClick={() => setOpen(false)}>Book Now</a>
        </div>
      )}
    </nav>
  )
}
