import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'
import { useT, LANGS } from '../../i18n'
import type { Lang } from '../../i18n/translations'

// tKey → etiqueta traducida · hash → sección de la home · path → página propia
const LINKS = [
  { tKey: 'nav.events', hash: '#events' },
  { tKey: 'nav.calendar', path: '/calendar' },
  { tKey: 'nav.djs', path: '/djs' },
  { tKey: 'nav.music', path: '/music' },
  { tKey: 'nav.blog', path: '/blog' },
  { tKey: 'nav.contact', hash: '#contact' },
] as const

function AccountIcon({ label }: { label: string }) {
  return (
    <Link to="/account" aria-label={label} className="theme-toggle" style={{ textDecoration: 'none' }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
      </svg>
    </Link>
  )
}

function LangSelect() {
  const { lang, setLang } = useT()
  return (
    <select
      aria-label="Language"
      className="lang-select"
      value={lang}
      onChange={e => setLang(e.target.value as Lang)}
    >
      {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  )
}

function NavItem({ link, onClick, style }: { link: (typeof LINKS)[number]; onClick?: () => void; style?: React.CSSProperties }) {
  const onHome = useLocation().pathname === '/'
  const { t } = useT()
  const label = t(link.tKey)
  if ('path' in link && link.path) {
    return <Link to={link.path} className="nav-link" style={style} onClick={onClick}>{label}</Link>
  }
  const hash = 'hash' in link ? link.hash : '#top'
  // fuera de la home, el ancla no existe: volvemos a la home
  return onHome
    ? <a href={hash} className="nav-link" style={style} onClick={onClick}>{label}</a>
    : <Link to="/" className="nav-link" style={style} onClick={onClick}>{label}</Link>
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { t } = useT()

  return (
    <nav className="nav-blur" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-soft)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <a href="#top" className="bebas" style={{ fontSize: '1.35rem', color: 'var(--gold)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          BOAT CLUB PARTY
        </a>

        {/* Desktop */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: 22 }}>
          {LINKS.map(l => <NavItem key={l.tKey} link={l} />)}
          <LangSelect />
          <AccountIcon label={t('nav.account')} />
          <ThemeToggle />
          <a className="btn-gold" href="#events" style={{ padding: '9px 22px', fontSize: '.95rem' }}>{t('nav.book')}</a>
        </div>

        {/* Mobile */}
        <div className="nav-mobile" style={{ alignItems: 'center', gap: 10 }}>
          <LangSelect />
          <AccountIcon label={t('nav.account')} />
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
            <NavItem key={l.tKey} link={l} style={{ padding: '10px 0', fontSize: '1rem' }} onClick={() => setOpen(false)} />
          ))}
          <a className="btn-gold" href="#events" style={{ marginTop: 8, textAlign: 'center' }} onClick={() => setOpen(false)}>{t('nav.book')}</a>
        </div>
      )}
    </nav>
  )
}
