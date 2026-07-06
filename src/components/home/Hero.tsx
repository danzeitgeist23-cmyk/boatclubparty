import Img from '../Img'
import { SocialIcons } from './Footer'
import { useT } from '../../i18n'

export default function Hero() {
  const { t } = useT()
  return (
    <header id="top" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 32px', position: 'relative' }}>
      <div className="hero-grid">
        <div>
          <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', fontWeight: 600, margin: 0 }}>
            {t('hero.tagline')}
          </p>
          <h1 className="bebas" style={{ fontSize: 'clamp(3.4rem, 11vw, 7rem)', lineHeight: .95, margin: '14px 0 18px' }}>
            Boat Club<br />Party.
          </h1>
          <p className="text-muted-c" style={{ maxWidth: 480, fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 26px' }}>
            {t('hero.sub')}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a className="btn-gold" href="#events">{t('hero.book')}</a>
            <a className="btn-outline" href="#gallery">{t('hero.vibe')}</a>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 30 }}>
            <SocialIcons />
            <span className="bebas" style={{ marginLeft: 6, border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: 999, padding: '4px 14px', fontSize: '.85rem', letterSpacing: '.12em' }}>
              SINCE 2024
            </span>
          </div>
        </div>

        <Img src="/assets/hero/hero.webp" alt="Boat Club Party on the Atlantic" ratio="16/11" className="hero-img" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
        <a href="#countdown" aria-label="Scroll down" className="bounce" style={{ color: 'var(--gold)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', fontSize: '.65rem', letterSpacing: '.3em' }}>
          SCROLL
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </a>
      </div>
    </header>
  )
}
