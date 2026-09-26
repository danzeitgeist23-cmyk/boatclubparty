import { useEffect, useRef, useState, type FormEvent } from 'react'
import { supabase, type EventRow } from '../../lib/supabase'

type MediaItem = { id: string; event_id: string | null; type: string; title: string; preview_url: string | null; price: number }

const TYPES = [
  { value: 'photo_pack', label: 'Photo Pack' },
  { value: 'video', label: 'Video' },
  { value: 'single_photo', label: 'Single Photo' },
]

export default function MediaAdminPage() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [items, setItems] = useState<MediaItem[]>([])
  const [eventId, setEventId] = useState('')
  const [type, setType] = useState('photo_pack')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const previewRef = useRef<HTMLInputElement>(null)
  const fullRef = useRef<HTMLInputElement>(null)

  const load = () => {
    supabase.from('events').select('*').order('date').then(({ data }) => setEvents((data as EventRow[]) ?? []))
    supabase.from('media_items').select('id,event_id,type,title,preview_url,price').order('created_at', { ascending: false })
      .then(({ data }) => setItems((data as MediaItem[]) ?? []))
  }
  useEffect(() => { load() }, [])

  async function uploadTo(bucket: string, file: File): Promise<string> {
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) throw error
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const previewFile = previewRef.current?.files?.[0]
    if (!previewFile) { setError('Preview image required'); return }
    setBusy(true); setError('')
    try {
      const preview_url = await uploadTo('previews', previewFile)
      const fullFile = fullRef.current?.files?.[0]
      const full_url = fullFile ? await uploadTo('media', fullFile) : null
      const { error: insErr } = await supabase.from('media_items')
        .insert({ event_id: eventId || null, type, title, price: Number(price), preview_url, full_url })
      if (insErr) throw insErr
      setTitle(''); setPrice('')
      if (previewRef.current) previewRef.current.value = ''
      if (fullRef.current) fullRef.current.value = ''
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (item: MediaItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return
    await supabase.from('media_items').delete().eq('id', item.id)
    load()
  }

  const eventName = (id: string | null) => events.find(e => e.id === id)?.boat_name ?? '—'

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Media</h1>
      <p className="text-muted-c" style={{ margin: '0 0 18px', fontSize: '.9rem' }}>
        Fotos y vídeos a la venta por evento. El preview (con marca de agua) es público; el archivo completo va al bucket privado — se entrega manualmente tras el pago (fase 1).
      </p>

      <form onSubmit={submit} className="event-card" style={{ padding: 18, cursor: 'default', marginBottom: 22 }}>
        <p className="bebas" style={{ letterSpacing: '.12em', margin: '0 0 12px' }}>ADD MEDIA ITEM</p>
        <div className="form-row">
          <div><label className="form-label">Event</label>
            <select className="form-input" value={eventId} onChange={e => setEventId(e.target.value)} required>
              <option value="" disabled>Select event…</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.boat_name} · {e.date}</option>)}
            </select></div>
          <div><label className="form-label">Type</label>
            <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select></div>
        </div>
        <div className="form-row">
          <div><label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Sunset pack — 30 photos" /></div>
          <div><label className="form-label">Price €</label>
            <input className="form-input" type="number" min="0" step="1" value={price} onChange={e => setPrice(e.target.value)} required /></div>
        </div>
        <label className="form-label">Preview (con marca de agua, público)</label>
        <input ref={previewRef} className="form-input" type="file" accept="image/*" required />
        <label className="form-label">Archivo completo (opcional ahora — bucket privado)</label>
        <input ref={fullRef} className="form-input" type="file" accept="image/*,video/*" />
        {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{error}</p>}
        <button className="btn-gold" type="submit" disabled={busy} style={{ padding: '8px 20px', fontSize: '.9rem' }}>
          {busy ? 'UPLOADING…' : 'ADD ITEM'}
        </button>
      </form>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.map(item => (
          <div key={item.id} className="event-card" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center', cursor: 'default' }}>
            {item.preview_url && <img src={item.preview_url} alt={item.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="bebas" style={{ fontSize: '1.05rem' }}>{item.title}</span>
              <p className="text-muted-c" style={{ margin: '2px 0 0', fontSize: '.78rem' }}>
                {eventName(item.event_id)} · {item.type} · €{Number(item.price).toFixed(0)}
              </p>
            </div>
            <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '.78rem', borderColor: 'var(--orange)', color: 'var(--orange)' }} onClick={() => remove(item)}>
              DELETE
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-c" style={{ fontSize: '.9rem' }}>No media items yet.</p>}
      </div>
    </div>
  )
}
