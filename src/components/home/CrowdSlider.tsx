import { useEffect, useRef } from 'react'
import Img from '../Img'

// Fotos de público: /public/assets/crowd/crowd-N.webp (añadir más = subir archivo)
const SLIDES = Array.from({ length: 9 }, (_, i) => `/assets/crowd/crowd-${i + 1}.webp`)

export default function CrowdSlider() {
  const track = useRef<HTMLDivElement>(null)

  // auto-avance suave; el usuario puede arrastrar (scroll-snap)
  useEffect(() => {
    const el = track.current
    if (!el) return
    const id = setInterval(() => {
      if (!el.matches(':hover')) {
        const next = el.scrollLeft + el.clientWidth * 0.72
        el.scrollTo({ left: next >= el.scrollWidth - el.clientWidth - 10 ? 0 : next, behavior: 'smooth' })
      }
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="crowd" style={{ padding: '70px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">·</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>The crowd</h2>
        </div>
        <p className="text-muted-c" style={{ margin: '10px 0 26px', maxWidth: 520 }}>
          No stock photos. This is what our parties actually look like.
        </p>
      </div>
      <div ref={track} className="crowd-track">
        {SLIDES.map((src, i) => (
          <div key={src} className="crowd-slide">
            <Img src={src} alt={`Boat Club Party crowd ${i + 1}`} ratio="4/3" />
          </div>
        ))}
      </div>
    </section>
  )
}
