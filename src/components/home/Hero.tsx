import Img from '../Img'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/boatclubparty',
    icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" /></>,
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@boatclubparty',
    icon: <path d="M15 4v9.5a4 4 0 1 1-4-4M15 4c.5 2.5 2 4 4.5 4.5" />,
  },
]

export default function Hero() {
  return (
    <header id="top" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 32px', position: 'relative' }}>
      <div className="hero-grid">
        <div>
          <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', fontWeight: 600, margin: 0 }}>
            GRAN CANARIA · ATLANTIC VIP PARTIES
          </p>
          <h1 className="bebas" style={{ fontSize: 'clamp(3.4rem, 11vw, 7rem)', lineHeight: .95, margin: '14px 0 18px' }}>
            Boat Club<br />Party.
          </h1>
          <p className="text-muted-c" style={{ maxWidth: 480, fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 26px' }}>
            Open bar, live DJs and limited capacity on the Atlantic.
            Four hours you will never forget — and photos to prove it.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a className="btn-gold" href="#events">Book Now</a>
            <a className="btn-outline" href="#gallery">See the vibe</a>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 30 }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
              </a>
            ))}
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
