import { useEffect, useRef, useState, type FormEvent } from 'react'
import { supabase, type DjRow } from '../../lib/supabase'

type Form = { slug: string; name: string; tagline: string; image: string; instagram: string; mixcloud: string }
const EMPTY: Form = { slug: '', name: '', tagline: '', image: '', instagram: '', mixcloud: '' }

export default function DjsAdminPage() {
  const [djs, setDjs] = useState<DjRow[]>([])
  const [form, setForm] = useState<Form>(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [library, setLibrary] = useState<string[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => supabase.from('djs').select('*').order('name').then(({ data }) => setDjs((data as DjRow[]) ?? []))
  useEffect(() => { load() }, [])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function uploadPhoto(file: File) {
    setUploading(true); setError('')
    const path = `djs/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error } = await supabase.storage.from('previews').upload(path, file)
    if (error) { setError(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('previews').getPublicUrl(path)
    setForm(f => ({ ...f, image: data.publicUrl }))
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function openLibrary() {
    if (library) { setLibrary(null); return } // toggle cerrar si ya está abierta
    const { data, error } = await supabase.storage.from('previews').list('djs', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error) { setError(error.message); return }
    setLibrary((data ?? []).map(f => supabase.storage.from('previews').getPublicUrl(`djs/${f.name}`).data.publicUrl))
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setError('')
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      tagline: form.tagline || null,
      image: form.image || null,
      instagram: form.instagram || null,
      mixcloud: form.mixcloud || null,
    }
    const q = editingId
      ? supabase.from('djs').update(payload).eq('id', editingId)
      : supabase.from('djs').insert(payload)
    const { error } = await q
    if (error) { setError(error.message); return }
    setForm(EMPTY); setEditingId(null); load()
  }

  const edit = (dj: DjRow) => {
    setEditingId(dj.id)
    setForm({ slug: dj.slug, name: dj.name, tagline: dj.tagline ?? '', image: dj.image ?? '', instagram: dj.instagram ?? '', mixcloud: dj.mixcloud ?? '' })
  }

  const toggleActive = async (dj: DjRow) => {
    await supabase.from('djs').update({ is_active: !dj.is_active }).eq('id', dj.id)
    load()
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>DJs</h1>

      <form onSubmit={save} className="event-card" style={{ padding: 18, cursor: 'default', marginBottom: 22 }}>
        <p className="bebas" style={{ margin: '0 0 12px', letterSpacing: '.1em' }}>{editingId ? 'EDIT DJ' : 'ADD DJ'}</p>
        <div className="form-row">
          <div><label className="form-label">Name</label>
            <input className="form-input" value={form.name} onChange={set('name')} required /></div>
          <div><label className="form-label">Tagline</label>
            <input className="form-input" value={form.tagline} onChange={set('tagline')} placeholder="Resident Pure Ibiza Radio" /></div>
        </div>

        <label className="form-label">Photo</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
          {form.image && (
            <img src={form.image} alt="Preview" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-soft)' }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <input className="form-input" style={{ marginBottom: 8 }} value={form.image} onChange={set('image')} placeholder="URL, o sube/elige una foto abajo" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <label className="btn-outline" style={{ padding: '7px 14px', fontSize: '.8rem', cursor: 'pointer', display: 'inline-block' }}>
                {uploading ? 'SUBIENDO…' : '📁 SUBIR DESDE MI PC'}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading}
                  onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
              </label>
              <button type="button" className="btn-outline" style={{ padding: '7px 14px', fontSize: '.8rem' }} onClick={openLibrary}>
                🖼️ {library ? 'CERRAR GALERÍA' : 'ELEGIR DE LA GALERÍA'}
              </button>
            </div>
          </div>
        </div>

        {library && (
          <div className="event-card" style={{ padding: 12, cursor: 'default', marginBottom: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
            {library.length === 0 && <p className="text-muted-c" style={{ fontSize: '.8rem', margin: 0 }}>Todavía no hay fotos subidas.</p>}
            {library.map(url => (
              <button key={url} type="button" onClick={() => { setForm(f => ({ ...f, image: url })); setLibrary(null) }}
                style={{ padding: 0, border: form.image === url ? '2px solid var(--gold)' : '1px solid var(--border-soft)', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: 'none' }}>
                <img src={url} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        )}

        <div className="form-row">
          <div><label className="form-label">Instagram URL</label>
            <input className="form-input" value={form.instagram} onChange={set('instagram')} /></div>
          <div><label className="form-label">Mixcloud URL</label>
            <input className="form-input" value={form.mixcloud} onChange={set('mixcloud')} /></div>
        </div>
        {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-gold" type="submit" style={{ padding: '8px 20px', fontSize: '.9rem' }}>{editingId ? 'UPDATE' : 'ADD'}</button>
          {editingId && <button className="btn-outline" type="button" style={{ padding: '8px 20px', fontSize: '.9rem' }} onClick={() => { setEditingId(null); setForm(EMPTY) }}>CANCEL</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gap: 10 }}>
        {djs.map(dj => (
          <div key={dj.id} className="event-card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default', gap: 10, flexWrap: 'wrap', opacity: dj.is_active ? 1 : .55 }}>
            <div>
              <span className="bebas" style={{ fontSize: '1.1rem' }}>{dj.name}</span>
              <span className="text-muted-c" style={{ fontSize: '.8rem', marginLeft: 10 }}>{dj.tagline}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '.78rem' }} onClick={() => edit(dj)}>EDIT</button>
              <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '.78rem' }} onClick={() => toggleActive(dj)}>
                {dj.is_active ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
