import { Link } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'
import { useT } from '../../i18n'

export function SocialIcons({ size = 20 }: { size?: number }) {
  const s = useSettings()
  const items = [
    { label: 'Instagram', href: s.instagram_url, icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" /></> },
    { label: 'TikTok', href: s.tiktok_url, icon: <path d="M15 4v9.5a4 4 0 1 1-4-4M15 4c.5 2.5 2 4 4.5 4.5" /> },
    { label: 'Facebook', href: s.facebook_url, icon: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" /> },
    { label: 'YouTube', href: s.youtube_url, icon: <><rect x="2.5" y="6" width="19" height="12.5" rx="3.5" /><path d="M10 9.8l5 2.7-5 2.7z" fill="currentColor" stroke="none" /></> },
  ].filter(i => i.href)

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      {items.map(i => (
        <a key={i.label} href={i.href} target="_blank" rel="noreferrer" aria-label={i.label}
          style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'color .2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{i.icon}</svg>
        </a>
      ))}
    </div>
  )
}

export default function Footer() {
  const s = useSettings()
  const { t } = useT()
  const email = s.contact_email || 'info@boatclubparty.com'

  return (
    <footer style={{ borderTop: '1px solid var(--border-soft)', padding: '54px 20px 30px' }}>
      <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div>
          <p className="bebas" style={{ fontSize: '1.4rem', color: 'var(--gold)', margin: '0 0 10px' }}>BOAT CLUB PARTY</p>
          <p className="text-muted-c" style={{ fontSize: '.88rem', lineHeight: 1.7, margin: '0 0 14px' }}>
            {t('footer.tagline')}<br />
            Puerto Rico Marina, Gran Canaria<br />
            <a href={`mailto:${email}`} className="nav-link" style={{ fontSize: '.88rem' }}>{email}</a>
          </p>
          <SocialIcons />
        </div>
        <div>
          <p className="bebas" style={{ letterSpacing: '.1em', margin: '0 0 12px' }}>{t('footer.events')}</p>
          <ul className="footer-list">
            <li><a href="/#/" className="nav-link">{t('footer.upcoming')}</a></li>
            <li><Link to="/djs" className="nav-link">{t('footer.djs')}</Link></li>
            <li><Link to="/music" className="nav-link">{t('footer.music')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="bebas" style={{ letterSpacing: '.1em', margin: '0 0 12px' }}>{t('footer.company')}</p>
          <ul className="footer-list">
            <li><Link to="/blog" className="nav-link">{t('footer.blog')}</Link></li>
            <li><Link to="/login" className="nav-link">{t('footer.account')}</Link></li>
            <li><a href="/#/" className="nav-link">{t('footer.contact')}</a></li>
          </ul>
        </div>
      </div>
      <p className="text-muted-c" style={{ textAlign: 'center', fontSize: '.75rem', marginTop: 40 }}>
        © {new Date().getFullYear()} Boat Club Party · Gran Canaria · {t('footer.rights')}
      </p>
    </footer>
  )
}
