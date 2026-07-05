import { useEffect, useState } from 'react'
import { supabase, type DjRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import { useRadio, type Station } from '../../context/RadioContext'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'

function mixcloudEmbed(feed: string): string {
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${encodeURIComponent(feed)}`
}

// path del perfil/feed de mixcloud a partir de una URL completa o un username
function mixcloudFeed(value: string): string {
  try {
    const u = new URL(value)
    return u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`
  } catch {
    return `/${value.replace(/^\/|\/$/g, '')}/`
  }
}

export default function MusicPage() {
  const settings = useSettings()
  const radio = useRadio()
  const [djs, setDjs] = useState<DjRow[]>([])

  useEffect(() => {
    supabase.from('djs').select('*').not('mixcloud', 'is', null)
      .then(({ data }) => setDjs((data as DjRow[]) ?? []))
  }, [])

  const stations: (Station & { logo: string })[] = [
    { key: 'pure', name: 'Pure Ibiza Radio', url: settings.radio_pure_url ?? '', logo: '/assets/radios/pure-ibiza.webp' },
    { key: 'global', name: 'Ibiza Global Radio', url: settings.radio_global_url ?? '', logo: '/assets/radios/ibiza-global.svg' },
  ].filter(s => s.url)

  // embeds: el user configurado + los mixcloud de los DJs (sin duplicados)
  const feeds = [
    ...(settings.mixcloud_user ? [{ title: 'Boat Club Party sessions', feed: mixcloudFeed(settings.mixcloud_user) }] : []),
    ...djs.filter(d => d.mixcloud).map(d => ({ title: `${d.name} on Mixcloud`, feed: mixcloudFeed(d.mixcloud!) })),
  ].filter((f, i, arr) => arr.findIndex(x => x.feed === f.feed) === i)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 90px' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', margin: 0 }}>🎧 THE SOUNDTRACK</p>
        <h1 className="bebas" style={{ fontSize: 'clamp(2.6rem, 8vw, 4.5rem)', margin: '10px 0 8px', lineHeight: .95 }}>Music & Radio</h1>
        <p className="text-muted-c" style={{ maxWidth: 520, margin: '0 0 36px' }}>
          Ibiza live radio and our latest sessions. Press play — it keeps playing while you browse.
        </p>

        <h2 className="bebas" style={{ fontSize: '1.6rem', margin: '0 0 16px' }}>
          <span style={{ color: 'var(--gold)', marginRight: 10 }}>01</span>Live Radio
        </h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: 46 }}>
          {stations.map(s => {
            const active = radio.station?.key === s.key
            const playing = active && radio.playing
            return (
              <div key={s.key} className="event-card" style={{ padding: 22, cursor: 'default', display: 'flex', alignItems: 'center', gap: 16, borderColor: active ? 'var(--gold)' : undefined }}>
                <button className="play-btn play-btn-lg" onClick={() => (active ? radio.toggle() : radio.play(s))}
                  aria-label={playing ? `Pause ${s.name}` : `Play ${s.name}`}>
                  {playing ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                  )}
                </button>
                <div style={{ flex: 1 }}>
                  <p className="bebas" style={{ margin: 0, fontSize: '1.3rem' }}>{s.name}</p>
                  <p className="text-muted-c" style={{ margin: 0, fontSize: '.75rem', letterSpacing: '.12em' }}>
                    {active && radio.error ? 'STREAM ERROR — TRY AGAIN' : playing ? '● LIVE' : 'IBIZA · 24/7'}
                  </p>
                </div>
                <img src={s.logo} alt={`${s.name} logo`} className="radio-logo" loading="lazy" />
              </div>
            )
          })}
        </div>

        <h2 className="bebas" style={{ fontSize: '1.6rem', margin: '0 0 16px' }}>
          <span style={{ color: 'var(--gold)', marginRight: 10 }}>02</span>Latest Sessions
        </h2>
        <div style={{ display: 'grid', gap: 20 }}>
          {feeds.map(f => (
            <div key={f.feed}>
              <p className="text-muted-c" style={{ fontSize: '.85rem', margin: '0 0 8px' }}>{f.title}</p>
              <iframe
                title={f.title}
                width="100%"
                height="120"
                src={mixcloudEmbed(f.feed)}
                frameBorder="0"
                loading="lazy"
                allow="autoplay"
                style={{ borderRadius: 10, border: '1px solid var(--border-soft)' }}
              />
            </div>
          ))}
          {feeds.length === 0 && <p className="text-muted-c">No sessions configured yet.</p>}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
