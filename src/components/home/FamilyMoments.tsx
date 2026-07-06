import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Img from '../Img'
import { useT } from '../../i18n'

type Moment = { id: string; image_url: string; caption: string | null }

// Slider "Boat Club Family Moments" — fotos gestionadas en /admin/moments
export default function FamilyMoments() {
  const track = useRef<HTMLDivElement>(null)
  const [moments, setMoments] = useState<Moment[]>([])
  const { t } = useT()

  useEffect(() => {
    supabase.from('moments').select('id,image_url,caption').order('sort')
      .then(({ data }) => setMoments((data as Moment[]) ?? []))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el || moments.length === 0) return
    const id = setInterval(() => {
      if (!el.matches(':hover')) {
        const next = el.scrollLeft + el.clientWidth * 0.72
        el.scrollTo({ left: next >= el.scrollWidth - el.clientWidth - 10 ? 0 : next, behavior: 'smooth' })
      }
    }, 3500)
    return () => clearInterval(id)
  }, [moments.length])

  if (moments.length === 0) return null

  return (
    <section id="moments" style={{ padding: '70px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="section-num">·</span>
          <h2 className="bebas" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>{t('moments.title')}</h2>
        </div>
        <p className="text-muted-c" style={{ margin: '10px 0 26px', maxWidth: 520 }}>
          {t('moments.sub')}
        </p>
      </div>
      <div ref={track} className="crowd-track">
        {moments.map(m => (
          <div key={m.id} className="crowd-slide">
            <Img src={m.image_url} alt={m.caption ?? 'Boat Club Party moment'} ratio="4/3" />
          </div>
        ))}
      </div>
    </section>
  )
}
