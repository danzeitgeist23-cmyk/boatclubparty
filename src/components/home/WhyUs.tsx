const POINTS = [
  { num: '01', title: 'Open bar on board', text: 'Unlimited drinks the whole trip — cocktails, beer, soft drinks. No hidden extras once you step on deck.' },
  { num: '02', title: 'Real event photos', text: 'A photographer sails with us. Relive your party in high resolution and grab your own shots after the event.' },
  { num: '03', title: 'Limited capacity VIP', text: 'We never pack the boat. Space to dance, sunset views for everyone, and a crowd that came to party.' },
]

export default function WhyUs() {
  return (
    <section id="why" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span className="section-num">03</span>
        <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>Built for the Atlantic</h2>
      </div>
      <div className="why-grid" style={{ marginTop: 34 }}>
        {POINTS.map(p => (
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
