const FAQS = [
  { q: 'What is included in the ticket?', a: '4 hours on board with unlimited open bar (cocktails, beer, soft drinks), live DJ, and access to the event photos. VIP tickets add priority boarding and reserved seating area.' },
  { q: 'Can I cancel my booking?', a: 'Yes — free cancellation up to 48 hours before departure. Contact us on WhatsApp and we refund or move your booking, no questions asked.' },
  { q: 'What happens if the weather is bad?', a: 'Safety first: if the captain cancels a departure, you choose between a full refund or a free rebooking on any future date.' },
  { q: 'What should I bring?', a: 'Swimwear, towel, sunscreen and your party mood. Leave glass bottles at home — everything you need to drink is already on board.' },
  { q: 'Is there an age limit?', a: 'All guests must be 18+. Bring a valid ID — it will be checked at boarding together with your ticket.' },
  { q: 'How do I pay?', a: 'Booking is confirmed via WhatsApp and payment is arranged there (phase 1). Online checkout is coming soon.' },
]

export default function Faq() {
  return (
    <section id="faq" className="bg-secondary-c" style={{ padding: '70px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">06</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>FAQ</h2>
        </div>

        <div style={{ marginTop: 26 }}>
          {FAQS.map(f => (
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
            <strong className="bebas" style={{ letterSpacing: '.06em', fontSize: '1.1rem' }}>BOOKING PROMISE</strong>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.9rem' }}>Free cancellation up to 48h before departure.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
