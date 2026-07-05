import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Moment = { id: string; image_url: string; caption: string | null; sort: number; active: boolean }

export default function MomentsAdminPage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => supabase.from('moments').select('*').order('sort').then(({ data }) => setMoments((data as Moment[]) ?? []))
  useEffect(() => { load() }, [])

  async function upload(file: File) {
    setBusy(true); setError('')
    const path = `moments/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error: upErr } = await supabase.storage.from('previews').upload(path, file)
    if (upErr) { setError(upErr.message); setBusy(false); return }
    const { data } = supabase.storage.from('previews').getPublicUrl(path)
    const nextSort = Math.max(0, ...moments.map(m => m.sort)) + 1
    const { error: insErr } = await supabase.from('moments').insert({ image_url: data.publicUrl, sort: nextSort })
    if (insErr) setError(insErr.message)
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
    load()
  }

  const toggle = async (m: Moment) => { await supabase.from('moments').update({ active: !m.active }).eq('id', m.id); load() }
  const remove = async (m: Moment) => {
    if (!window.confirm('Delete this photo from the slider?')) return
    await supabase.from('moments').delete().eq('id', m.id); load()
  }

  return (
    <div>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Family Moments</h1>
      <p className="text-muted-c" style={{ margin: '0 0 18px', fontSize: '.9rem' }}>
        Las fotos del slider "Boat Club Family Moments" de la home. Sube una foto y aparece al momento.
      </p>

      <label className="btn-gold" style={{ display: 'inline-block', cursor: 'pointer', marginBottom: 6 }}>
        {busy ? 'UPLOADING…' : '+ UPLOAD PHOTO'}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} disabled={busy}
          onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{error}</p>}

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', marginTop: 16 }}>
        {moments.map(m => (
          <div key={m.id} className="event-card" style={{ cursor: 'default', opacity: m.active ? 1 : .45 }}>
            <img src={m.image_url} alt={m.caption ?? 'Moment'} loading="lazy"
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: 10, display: 'flex', gap: 6, justifyContent: 'space-between' }}>
              <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '.72rem' }} onClick={() => toggle(m)}>
                {m.active ? 'HIDE' : 'SHOW'}
              </button>
              <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '.72rem', borderColor: 'var(--orange)', color: 'var(--orange)' }} onClick={() => remove(m)}>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
