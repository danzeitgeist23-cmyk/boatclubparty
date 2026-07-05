import { useRadio } from '../context/RadioContext'

// Barra global: visible mientras haya una emisora seleccionada, en cualquier ruta
export default function MiniPlayer() {
  const { station, playing, error, toggle, stop } = useRadio()
  if (!station) return null

  return (
    <div className="mini-player fade-up" role="region" aria-label="Radio player">
      <span className="live-dot" aria-hidden="true" style={{ opacity: playing ? 1 : .3 }} />
      <div style={{ minWidth: 0 }}>
        <p className="bebas" style={{ margin: 0, fontSize: '.95rem', letterSpacing: '.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {station.name}
        </p>
        <p className="text-muted-c" style={{ margin: 0, fontSize: '.65rem', letterSpacing: '.15em' }}>
          {error ? 'STREAM ERROR' : playing ? 'LIVE NOW' : 'PAUSED'}
        </p>
      </div>
      <button className="play-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
        )}
      </button>
      <button onClick={stop} aria-label="Close player"
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  )
}
