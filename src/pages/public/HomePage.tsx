import ThemeToggle from '../../components/ThemeToggle'
import { useEvents } from '../../hooks/useEvents'

// ⚠️ PLACEHOLDER — Claude Code: checkpoint B/C/D del megaprompt reemplazan esto
// Estructura objetivo: Nav → Hero → Countdown → Events → Gallery → Why Us
//                      → Reviews → Check-in → FAQ → Newsletter → Footer
export default function HomePage() {
  const { events, loading } = useEvents()

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border-soft)' }}>
        <span className="bebas" style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>BOAT CLUB PARTY</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ThemeToggle />
          <a className="btn-gold" href="#events">Book Now</a>
        </div>
      </nav>

      <main style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '.2em', fontSize: '.8rem' }}>GRAN CANARIA · ATLANTIC VIP PARTIES</p>
        <h1 className="bebas" style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', margin: '8px 0 16px', lineHeight: 1 }}>
          Boat Club Party.
        </h1>
        <p className="text-muted-c" style={{ maxWidth: 520 }}>
          Open bar, live DJs and limited capacity on the Atlantic. Scaffold conectado a Supabase — home real pendiente de checkpoints B–D.
        </p>

        <section id="events" style={{ marginTop: 60 }}>
          <div className="section-num">01</div>
          <h2 className="bebas" style={{ fontSize: '2rem' }}>Upcoming Events</h2>
          {loading ? <p className="text-muted-c">Loading events…</p> : (
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: 20 }}>
              {events.map(e => (
                <div key={e.id} className="event-card" style={{ padding: 20 }}>
                  <div className="bebas" style={{ fontSize: '1.5rem' }}>{e.boat_name}</div>
                  <p className="text-muted-c" style={{ fontSize: '.85rem' }}>
                    {e.date} · {e.time_start.slice(0,5)}–{e.time_end.slice(0,5)} · {e.marina}
                  </p>
                  <div style={{ color: 'var(--gold)', fontFamily: 'Bebas Neue', fontSize: '1.3rem' }}>
                    From €{Number(e.price_general).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
