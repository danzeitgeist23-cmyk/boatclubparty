import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'
import { useT } from '../../i18n'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import Img from '../../components/Img'

function FamilyCta({ percent }: { percent: string }) {
  const { session, profile, loading, refreshProfile } = useAuth()
  const { t } = useT()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (loading) return null

  if (!session) {
    return (
      <div>
        <Link className="btn-gold" to="/login?next=/family">{t('family.loginCta')}</Link>
        <p className="text-muted-c" style={{ fontSize: '.85rem', margin: '10px 0 0' }}>{t('family.loginSub')}</p>
      </div>
    )
  }

  if (profile?.is_family) {
    return (
      <div className="event-card fade-up" style={{ padding: 22, cursor: 'default', maxWidth: 420 }}>
        <p className="bebas" style={{ color: 'var(--gold)', fontSize: '1.35rem', margin: '0 0 8px' }}>{t('family.alreadyTitle')}</p>
        <p className="text-muted-c" style={{ margin: '0 0 16px', fontSize: '.9rem' }}>{t('family.alreadyText', { percent })}</p>
        <Link className="btn-outline" to="/account/rewards">{t('family.viewRewards')}</Link>
      </div>
    )
  }

  async function join() {
    setBusy(true); setError('')
    const { error } = await supabase.from('profiles').update({ is_family: true }).eq('id', session!.user.id)
    if (error) { setError(error.message); setBusy(false); return }
    await refreshProfile()
    setBusy(false)
  }

  return (
    <div>
      <button className="btn-gold" onClick={join} disabled={busy}>
        {busy ? t('family.joining') : t('family.joinBtn')}
      </button>
      {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem', margin: '10px 0 0' }}>{error}</p>}
    </div>
  )
}

export default function FamilyPage() {
  const settings = useSettings()
  const { t } = useT()
  const percent = settings.family_discount_percent || '10'

  const benefits = [
    { icon: <><path d="M4 14v-6l8-4 8 4v6" /><path d="M4 14l8 4 8-4M4 14v4l8 4 8-4v-4" /></>, title: t('family.b1t'), text: t('family.b1x') },
    { icon: <><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" /></>, title: t('family.b2t'), text: t('family.b2x', { percent }) },
    { icon: <><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></>, title: t('family.b3t'), text: t('family.b3x', { percent }) },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />

      <header style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 20px' }}>
        <div className="hero-grid">
          <div>
            <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', fontWeight: 600, margin: 0 }}>
              ⚓ {t('family.kicker')}
            </p>
            <h1 className="bebas" style={{ fontSize: 'clamp(3rem, 9vw, 5.5rem)', lineHeight: .95, margin: '14px 0 18px' }}>
              {t('family.title')}
            </h1>
            <p className="text-muted-c" style={{ maxWidth: 460, fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 30px' }}>
              {t('family.sub', { percent })}
            </p>
            <FamilyCta percent={percent} />
          </div>
          <Img src="/assets/crowd/crowd-4.webp" alt="Boat Club Family" ratio="16/11" className="hero-img" />
        </div>
      </header>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '50px 20px 20px' }}>
        <h2 className="bebas" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', margin: '0 0 12px' }}>{t('family.whatTitle')}</h2>
        <p className="text-muted-c" style={{ lineHeight: 1.7, fontSize: '1rem', margin: 0 }}>{t('family.whatText')}</p>
      </section>

      <section className="bg-secondary-c" style={{ padding: '70px 20px', marginTop: 40 }}>
        <div className="why-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {benefits.map(b => (
            <div key={b.title}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{b.icon}</svg>
              <h3 className="bebas" style={{ fontSize: '1.35rem', margin: '14px 0 8px' }}>{b.title}</h3>
              <p className="text-muted-c" style={{ margin: 0, lineHeight: 1.6, fontSize: '.95rem' }}>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
