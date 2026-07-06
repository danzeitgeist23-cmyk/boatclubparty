import { useState } from 'react'
import Img from '../Img'
import { useT } from '../../i18n'

// Fotos reales: Dani las suelta en /public/assets/gallery/<grupo>-<n>.webp sin tocar código
const GROUPS = [
  { num: '01', tKey: 'gallery.g1', prefix: 'sunset', count: 4 },
  { num: '02', tKey: 'gallery.g2', prefix: 'onboard', count: 4 },
  { num: '03', tKey: 'gallery.g3', prefix: 'crew', count: 4 },
]

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const { t } = useT()

  return (
    <section id="gallery" className="bg-secondary-c" style={{ padding: '70px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">02</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('gallery.title')}</h2>
        </div>
        <p className="text-muted-c" style={{ margin: '10px 0 8px', maxWidth: 520 }}>
          {t('gallery.sub')}
        </p>

        {GROUPS.map(g => (
          <div key={g.num} style={{ marginTop: 38 }}>
            <h3 className="bebas" style={{ fontSize: '1.4rem', margin: '0 0 14px' }}>
              <span style={{ color: 'var(--gold)', marginRight: 10 }}>{g.num}</span>{t(g.tKey)}
            </h3>
            <div className="gallery-grid">
              {Array.from({ length: g.count }, (_, i) => {
                const src = `/assets/gallery/${g.prefix}-${i + 1}.webp`
                return (
                  <button key={src} onClick={() => setLightbox(src)} aria-label={`Open photo ${t(g.tKey)} ${i + 1}`}
                    style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8, overflow: 'hidden' }}>
                    <Img src={src} alt={`${t(g.tKey)} photo ${i + 1}`} ratio="1/1" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div role="dialog" aria-label="Photo viewer" onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,15,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
          <img src={lightbox} alt="Gallery" style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: 8 }}
            onError={() => setLightbox(null)} />
        </div>
      )}
    </section>
  )
}
