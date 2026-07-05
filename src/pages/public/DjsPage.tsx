import { useEffect, useState } from 'react'
import { supabase, type DjRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import Img from '../../components/Img'

export default function DjsPage() {
  const [djs, setDjs] = useState<DjRow[] | null>(null)
  const settings = useSettings()

  useEffect(() => {
    supabase.from('djs').select('*').order('name')
      .then(({ data }) => setDjs((data as DjRow[]) ?? []))
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 70px' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', margin: 0 }}>THE SOUND OF THE ATLANTIC</p>
        <h1 className="bebas" style={{ fontSize: 'clamp(2.6rem, 8vw, 4.5rem)', margin: '10px 0 8px', lineHeight: .95 }}>Our DJs</h1>
        <p className="text-muted-c" style={{ maxWidth: 520, margin: '0 0 36px' }}>
          Residents and guests who make every departure a festival. Want to play on board? Write us.
        </p>

        {djs === null ? (
          <p className="text-muted-c">Loading…</p>
        ) : (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
            {djs.map(dj => (
              <article key={dj.id} className="event-card" style={{ cursor: 'default' }}>
                <Img src={dj.image} alt={dj.name} ratio="1/1" />
                <div style={{ padding: '16px 18px 20px' }}>
                  <h2 className="bebas" style={{ fontSize: '1.5rem', margin: 0 }}>{dj.name}</h2>
                  {dj.tagline && <p className="text-muted-c" style={{ margin: '2px 0 12px', fontSize: '.85rem' }}>{dj.tagline}</p>}
                  <div style={{ display: 'flex', gap: 12 }}>
                    {dj.instagram && (
                      <a href={dj.instagram} target="_blank" rel="noreferrer" aria-label={`${dj.name} on Instagram`} style={{ color: 'var(--gold)', display: 'inline-flex' }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" /></svg>
                      </a>
                    )}
                    {dj.mixcloud && (
                      <a href={dj.mixcloud} target="_blank" rel="noreferrer" aria-label={`${dj.name} on Mixcloud`} style={{ color: 'var(--gold)', display: 'inline-flex' }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v4H5a1 1 0 0 1-1-1v-3zM20 15h-3v4h2a1 1 0 0 0 1-1v-3z" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
