import { useT } from '../../i18n'

export default function Faq() {
  const { t } = useT()
  const faqs = [1, 2, 3, 4, 5, 6].map(i => ({ q: t(`faq.q${i}`), a: t(`faq.a${i}`) }))

  return (
    <section id="faq" className="bg-secondary-c" style={{ padding: '70px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">06</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('faq.title')}</h2>
        </div>

        <div style={{ marginTop: 26 }}>
          {faqs.map(f => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p className="text-muted-c" style={{ margin: '10px 0 4px', lineHeight: 1.6, fontSize: '.95rem' }}>{f.a}</p>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 34, border: '1px solid var(--gold)', borderRadius: 10, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <div>
            <strong className="bebas" style={{ letterSpacing: '.06em', fontSize: '1.1rem' }}>{t('faq.promise')}</strong>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.9rem' }}>{t('faq.promiseText')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
