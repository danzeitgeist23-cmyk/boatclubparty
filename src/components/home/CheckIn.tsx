import { waLink } from '../../lib/whatsapp'

const STEPS = [
  { num: '01', title: 'Arrive 30 min early', text: 'Check-in opens 30 minutes before departure at Puerto Rico Marina, Gran Canaria.' },
  { num: '02', title: 'Show your ticket', text: 'Show your booking confirmation on WhatsApp at the Boat Club Party stand.' },
  { num: '03', title: 'Step on board', text: 'Grab your first drink and find your spot on deck. We handle the rest.' },
]

export default function CheckIn({ whatsapp }: { whatsapp?: string }) {
  return (
    <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span className="section-num">05</span>
        <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>Check-in & Contact</h2>
      </div>
      <p className="text-muted-c" style={{ margin: '10px 0 30px', maxWidth: 520 }}>
        Boarding point: <strong style={{ color: 'var(--text-primary)' }}>Puerto Rico Marina, Gran Canaria</strong>
      </p>

      <div className="why-grid">
        {STEPS.map(s => (
          <div key={s.num}>
            <div className="bebas" style={{ fontSize: '2.6rem', color: 'var(--gold)', lineHeight: 1 }}>{s.num}</div>
            <h3 className="bebas" style={{ fontSize: '1.35rem', margin: '10px 0 8px' }}>{s.title}</h3>
            <p className="text-muted-c" style={{ margin: 0, lineHeight: 1.6, fontSize: '.95rem' }}>{s.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 }}>
        <a className="btn-outline" href="https://maps.google.com/?q=Puerto+Rico+Marina,+Gran+Canaria" target="_blank" rel="noreferrer">Open in Maps</a>
        <a className="btn-gold" href={waLink(whatsapp, 'Hola! I have a question about Boat Club Party 🚤')} target="_blank" rel="noreferrer">WhatsApp us</a>
        <a className="btn-outline" href="mailto:info@boatclubparty.com">Email</a>
      </div>
    </section>
  )
}
