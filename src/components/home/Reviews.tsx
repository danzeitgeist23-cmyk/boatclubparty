const REVIEWS = [
  { name: 'Sophie', origin: 'United Kingdom', text: 'Best day of our holiday. Open bar was actually unlimited and the sunset from the deck is unreal.' },
  { name: 'Lukas', origin: 'Germany', text: 'Booked for my stag do — 12 of us. The crew treated us like VIPs and the DJ read the crowd perfectly.' },
  { name: 'Marta', origin: 'Spain', text: 'Repetimos seguro. Nada que ver con otras fiestas en barco: aquí no te enlatan, hay espacio y buen rollo.' },
  { name: 'Emma', origin: 'Netherlands', text: 'The photos they took during the party were amazing. Felt safe, organised and 100% fun.' },
]

function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" stroke="none" aria-hidden="true">
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
    </svg>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-secondary-c" style={{ padding: '70px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">04</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>What people say</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0 30px', flexWrap: 'wrap' }}>
          <span className="bebas" style={{ fontSize: '3.4rem', lineHeight: 1, color: 'var(--gold)' }}>4.9</span>
          <div>
            <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} />)}</div>
            <p className="text-muted-c" style={{ margin: '4px 0 0', fontSize: '.85rem' }}>Google Reviews</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {REVIEWS.map(r => (
            <figure key={r.name} className="event-card" style={{ padding: 22, margin: 0, cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span className="bebas" aria-hidden="true" style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--gold)', color: '#0A0A0F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  {r.name[0]}
                </span>
                <figcaption>
                  <strong style={{ fontSize: '.95rem' }}>{r.name}</strong>
                  <p className="text-muted-c" style={{ margin: 0, fontSize: '.78rem' }}>{r.origin}</p>
                </figcaption>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>{[...Array(5)].map((_, i) => <Star key={i} />)}</div>
              <blockquote className="text-muted-c" style={{ margin: 0, fontSize: '.92rem', lineHeight: 1.55 }}>"{r.text}"</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
