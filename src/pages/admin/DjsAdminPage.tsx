import { useEffect, useState, type FormEvent } from 'react'
import { supabase, type DjRow } from '../../lib/supabase'

type Form = { slug: string; name: string; tagline: string; image: string; instagram: string; mixcloud: string }
const EMPTY: Form = { slug: '', name: '', tagline: '', image: '', instagram: '', mixcloud: '' }

export default function DjsAdminPage() {
  const [djs, setDjs] = useState<DjRow[]>([])
  const [form, setForm] = useState<Form>(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = () => supabase.from('djs').select('*').order('name').then(({ data }) => setDjs((data as DjRow[]) ?? []))
  useEffect(() => { load() }, [])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

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
        <label className="form-label">Photo (URL o /assets/djs/…)</label>
        <input className="form-input" value={form.image} onChange={set('image')} placeholder="/assets/djs/nombre.webp" />
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
