import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, type DjRow } from '../../lib/supabase'

type Form = {
  boat_name: string; date: string; time_start: string; time_end: string
  marina: string; location: string
  price_general: string; price_vip: string; capacity: string
  status: string; genres: string; bpm: string; event_type: string
  cover_image: string; description: string
}

const EMPTY: Form = {
  boat_name: '', date: '', time_start: '18:00', time_end: '22:00',
  marina: 'Puerto Rico Marina', location: 'Gran Canaria',
  price_general: '55', price_vip: '', capacity: '80',
  status: 'available', genres: '', bpm: '', event_type: '', cover_image: '', description: '',
}

type LineupState = Record<string, { selected: boolean; role: 'headliner' | 'support' }>

function slugify(boat: string, date: string): string {
  const base = boat.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return date ? `${base}-${date.slice(8, 10)}-${date.slice(5, 7)}` : base
}

export default function EventFormPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const editing = !!id
  const [form, setForm] = useState<Form>(EMPTY)
  const [djs, setDjs] = useState<DjRow[]>([])
  const [lineup, setLineup] = useState<LineupState>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('djs').select('*').order('name').then(({ data }) => setDjs((data as DjRow[]) ?? []))
    if (!id) return
    supabase.from('events').select('*, event_djs(dj_id, role)').eq('id', id).single().then(({ data }) => {
      if (!data) return
      const e = data as Record<string, unknown> & { event_djs: { dj_id: string; role: 'headliner' | 'support' }[] }
      setForm({
        boat_name: String(e.boat_name ?? ''), date: String(e.date ?? ''),
        time_start: String(e.time_start ?? '').slice(0, 5), time_end: String(e.time_end ?? '').slice(0, 5),
        marina: String(e.marina ?? ''), location: String(e.location ?? ''),
        price_general: String(e.price_general ?? ''), price_vip: e.price_vip == null ? '' : String(e.price_vip),
        capacity: String(e.capacity ?? '80'), status: String(e.status ?? 'available'),
        genres: String(e.genres ?? ''), bpm: String(e.bpm ?? ''), event_type: String(e.event_type ?? ''),
        cover_image: String(e.cover_image ?? ''), description: String(e.description ?? ''),
      })
      setLineup(Object.fromEntries(e.event_djs.map(l => [l.dj_id, { selected: true, role: l.role }])))
    })
  }, [id])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function save(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setError('')
    const payload = {
      boat_name: form.boat_name, date: form.date,
      time_start: form.time_start, time_end: form.time_end,
      marina: form.marina, location: form.location,
      price_general: Number(form.price_general),
      price_vip: form.price_vip === '' ? null : Number(form.price_vip),
      capacity: Number(form.capacity), status: form.status,
      genres: form.genres || null, bpm: form.bpm || null,
      event_type: form.event_type || null,
      cover_image: form.cover_image || null, description: form.description || null,
    }

    let eventId = id
    if (editing) {
      const { error } = await supabase.from('events').update(payload).eq('id', id!)
      if (error) { setError(error.message); setBusy(false); return }
    } else {
      const { data, error } = await supabase.from('events')
        .insert({ ...payload, slug: slugify(form.boat_name, form.date) })
        .select('id').single()
      if (error || !data) { setError(error?.message ?? 'Insert failed'); setBusy(false); return }
      eventId = data.id
    }

    // lineup: reemplazo completo
    await supabase.from('event_djs').delete().eq('event_id', eventId!)
    const rows = Object.entries(lineup)
      .filter(([, v]) => v.selected)
      .map(([dj_id, v], i) => ({ event_id: eventId!, dj_id, role: v.role, sort: v.role === 'headliner' ? 0 : i + 1 }))
    if (rows.length) {
      const { error } = await supabase.from('event_djs').insert(rows)
      if (error) { setError(error.message); setBusy(false); return }
    }
    nav('/admin/events')
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>{editing ? 'Edit event' : 'New event / party'}</h1>
      <form onSubmit={save}>
        <label className="form-label">Boat / party name</label>
        <input className="form-input" value={form.boat_name} onChange={set('boat_name')} required placeholder="Sunset Queen" />

        <div className="form-row">
          <div><label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={set('date')} required /></div>
          <div><label className="form-label">Start</label>
            <input className="form-input" type="time" value={form.time_start} onChange={set('time_start')} required /></div>
          <div><label className="form-label">End</label>
            <input className="form-input" type="time" value={form.time_end} onChange={set('time_end')} required /></div>
        </div>

        <div className="form-row">
          <div><label className="form-label">Price € (general)</label>
            <input className="form-input" type="number" min="0" step="1" value={form.price_general} onChange={set('price_general')} required /></div>
          <div><label className="form-label">Price € (VIP)</label>
            <input className="form-input" type="number" min="0" step="1" value={form.price_vip} onChange={set('price_vip')} placeholder="—" /></div>
          <div><label className="form-label">Capacity</label>
            <input className="form-input" type="number" min="1" value={form.capacity} onChange={set('capacity')} required /></div>
        </div>

        <div className="form-row">
          <div><label className="form-label">Marina</label>
            <input className="form-input" value={form.marina} onChange={set('marina')} /></div>
          <div><label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={set('status')}>
              <option value="available">available</option>
              <option value="sold_out">sold_out</option>
              <option value="cancelled">cancelled</option>
            </select></div>
        </div>

        <div className="form-row">
          <div><label className="form-label">Experience type</label>
            <input className="form-input" value={form.event_type} onChange={set('event_type')} placeholder="Day Blender · Golden Hour" list="event-types" />
            <datalist id="event-types">
              <option value="Day Blender" /><option value="Golden Hour" /><option value="Night Cruise" /><option value="Private Charter" />
            </datalist></div>
          <div><label className="form-label">Genres</label>
            <input className="form-input" value={form.genres} onChange={set('genres')} placeholder="Tech House · Afro House" /></div>
          <div><label className="form-label">BPM</label>
            <input className="form-input" value={form.bpm} onChange={set('bpm')} placeholder="124–130" /></div>
        </div>

        <label className="form-label">Cover image (URL o /assets/events/…)</label>
        <input className="form-input" value={form.cover_image} onChange={set('cover_image')} placeholder="/assets/events/event-1.webp" />

        <label className="form-label">Description</label>
        <textarea className="form-input" rows={3} value={form.description} onChange={set('description')} />

        <label className="form-label">Lineup</label>
        <div className="event-card" style={{ padding: 16, cursor: 'default', marginBottom: 16 }}>
          {djs.length === 0 && <p className="text-muted-c" style={{ margin: 0, fontSize: '.85rem' }}>No DJs yet — add them in the DJs tab.</p>}
          {djs.map(dj => {
            const l = lineup[dj.id] ?? { selected: false, role: 'support' as const }
            return (
              <div key={dj.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, cursor: 'pointer' }}>
                  <input type="checkbox" checked={l.selected}
                    onChange={e => setLineup(s => ({ ...s, [dj.id]: { ...l, selected: e.target.checked } }))} />
                  <span>{dj.name}</span>
                </label>
                {l.selected && (
                  <select className="form-input" style={{ width: 130, margin: 0, padding: '6px 8px' }}
                    value={l.role}
                    onChange={e => setLineup(s => ({ ...s, [dj.id]: { ...l, role: e.target.value as 'headliner' | 'support' } }))}>
                    <option value="headliner">headliner</option>
                    <option value="support">support</option>
                  </select>
                )}
              </div>
            )
          })}
        </div>

        {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-gold" type="submit" disabled={busy}>{busy ? 'SAVING…' : 'SAVE'}</button>
          <button className="btn-outline" type="button" onClick={() => nav('/admin/events')}>CANCEL</button>
        </div>
      </form>
    </div>
  )
}
