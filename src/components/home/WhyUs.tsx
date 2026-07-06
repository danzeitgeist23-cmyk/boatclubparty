import { useT } from '../../i18n'

export default function WhyUs() {
  const { t } = useT()
  const points = [
    { num: '01', title: t('why.t1'), text: t('why.x1') },
    { num: '02', title: t('why.t2'), text: t('why.x2') },
    { num: '03', title: t('why.t3'), text: t('why.x3') },
  ]

  return (
    <section id="why" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span className="section-num">03</span>
        <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('why.title')}</h2>
      </div>
      <div className="why-grid" style={{ marginTop: 34 }}>
        {points.map(p => (
          <div key={p.num}>
            <div className="bebas" style={{ fontSize: '2.6rem', color: 'var(--gold)', lineHeight: 1 }}>{p.num}</div>
            <h3 className="bebas" style={{ fontSize: '1.45rem', margin: '10px 0 8px' }}>{p.title}</h3>
            <p className="text-muted-c" style={{ margin: 0, lineHeight: 1.6, fontSize: '.95rem' }}>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
