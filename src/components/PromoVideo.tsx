import { useState } from 'react'

// Autoplay muted (obligatorio en móvil) + botón para activar el sonido con un tap.
export default function PromoVideo({ src }: { src: string }) {
  const [muted, setMuted] = useState(true)

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      <video
        src={src}
        autoPlay
        muted={muted}
        loop
        playsInline
        style={{ width: '100%', display: 'block', aspectRatio: '9/16', objectFit: 'cover', background: 'var(--bg-secondary)' }}
      />
      <button
        onClick={() => setMuted(m => !m)}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        style={{
          position: 'absolute', bottom: 12, right: 12,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(10,10,15,.6)', border: '1px solid rgba(255,255,255,.4)',
          color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M23 9l-6 6M17 9l6 6" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
          </svg>
        )}
      </button>
    </div>
  )
}
