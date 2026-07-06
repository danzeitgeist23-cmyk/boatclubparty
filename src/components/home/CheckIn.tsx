import { waLink } from '../../lib/whatsapp'
import { useT } from '../../i18n'

export default function CheckIn({ whatsapp }: { whatsapp?: string }) {
  const { t } = useT()
  const steps = [
    { num: '01', title: t('checkin.t1'), text: t('checkin.x1') },
    { num: '02', title: t('checkin.t2'), text: t('checkin.x2') },
    { num: '03', title: t('checkin.t3'), text: t('checkin.x3') },
  ]

  return (
    <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span className="section-num">05</span>
        <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('checkin.title')}</h2>
      </div>
      <p className="text-muted-c" style={{ margin: '10px 0 30px', maxWidth: 520 }}>
        {t('checkin.boarding')} <strong style={{ color: 'var(--text-primary)' }}>Puerto Rico Marina, Gran Canaria</strong>
      </p>

      <div className="why-grid">
        {steps.map(s => (
          <div key={s.num}>
            <div className="bebas" style={{ fontSize: '2.6rem', color: 'var(--gold)', lineHeight: 1 }}>{s.num}</div>
            <h3 className="bebas" style={{ fontSize: '1.35rem', margin: '10px 0 8px' }}>{s.title}</h3>
            <p className="text-muted-c" style={{ margin: 0, lineHeight: 1.6, fontSize: '.95rem' }}>{s.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 }}>
        <a className="btn-outline" href="https://maps.google.com/?q=Puerto+Rico+Marina,+Gran+Canaria" target="_blank" rel="noreferrer">{t('checkin.maps')}</a>
        <a className="btn-gold" href={waLink(whatsapp, 'Hola! I have a question about Boat Club Party 🚤')} target="_blank" rel="noreferrer">{t('checkin.wa')}</a>
        <a className="btn-outline" href="mailto:owawild23@gmail.com">{t('checkin.email')}</a>
      </div>
    </section>
  )
}
