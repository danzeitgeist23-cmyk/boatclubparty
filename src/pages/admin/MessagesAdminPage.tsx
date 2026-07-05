import { useEffect, useState, type FormEvent } from 'react'
import { supabase, type EventRow } from '../../lib/supabase'

// Mensajes programados: aquí se administran; N8N (fase 2) los lee y envía.
type Msg = {
  id: string; event_id: string | null; title: string; body: string
  channel: 'whatsapp' | 'email'; send_offset_hours: number | null
  send_at: string | null; active: boolean; sent_at: string | null
}

type Form = { title: string; body: string; event_id: string; channel: string; mode: 'offset' | 'fixed'; offset: string; send_at: string }
const EMPTY: Form = { title: '', body: '', event_id: '', channel: 'whatsapp', mode: 'offset', offset: '24', send_at: '' }

export default function MessagesAdminPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [form, setForm] = useState<Form>(EMPTY)
  const [error, setError] = useState('')

  const load = () => supabase.from('scheduled_messages').select('*').order('created_at', { ascending: false })
    .then(({ data }) => setMsgs((data as Msg[]) ?? []))

  useEffect(() => {
    load()
    supabase.from('events').select('*').order('date').then(({ data }) => setEvents((data as EventRow[]) ?? []))
  }, [])

  async function save(e: FormEvent) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.from('scheduled_messages').insert({
      title: form.title,
      body: form.body,
      event_id: form.event_id || null,
      channel: form.channel,
      send_offset_hours: form.mode === 'offset' ? Number(form.offset) : null,
      send_at: form.mode === 'fixed' && form.send_at ? new Date(form.send_at).toISOString() : null,
    })
    if (error) { setError(error.message); return }
    setForm(EMPTY); load()
  }

  const toggle = async (m: Msg) => { await supabase.from('scheduled_messages').update({ active: !m.active }).eq('id', m.id); load() }
  const remove = async (m: Msg) => {
    if (!window.confirm(`Delete "${m.title}"?`)) return
    await supabase.from('scheduled_messages').delete().eq('id', m.id); load()
  }

  const eventName = (id: string | null) => events.find(e => e.id === id)?.boat_name ?? 'Todos / general'

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Auto-messages (N8N)</h1>
      <p className="text-muted-c" style={{ margin: '0 0 18px', fontSize: '.9rem' }}>
        Mensajes informativos y avisos previos al evento. N8N los leerá de aquí para enviarlos
        (fase 2) — tú los administras ya: escribe, activa/desactiva, borra.
      </p>

      <form onSubmit={save} className="event-card" style={{ padding: 18, cursor: 'default', marginBottom: 22 }}>
        <p className="bebas" style={{ letterSpacing: '.12em', margin: '0 0 12px' }}>NEW MESSAGE</p>
        <label className="form-label">Título interno</label>
        <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Recordatorio 24h antes" />
        <label className="form-label">Mensaje</label>
        <textarea className="form-input" rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required
          placeholder={'¡Mañana zarpamos! ⚓ Recuerda: check-in 30 min antes en {marina}. Trae bañador y ganas. Tu reserva: {nombre} x{plazas}.'} />
        <p className="text-muted-c" style={{ fontSize: '.72rem', margin: '-8px 0 12px' }}>
          Variables para N8N: {'{nombre} {evento} {fecha} {hora} {marina} {plazas}'}
        </p>
        <div className="form-row">
          <div><label className="form-label">Evento</label>
            <select className="form-input" value={form.event_id} onChange={e => setForm(f => ({ ...f, event_id: e.target.value }))}>
              <option value="">Todos / general</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.boat_name} · {e.date}</option>)}
            </select></div>
          <div><label className="form-label">Canal</label>
            <select className="form-input" value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
              <option value="whatsapp">whatsapp</option>
              <option value="email">email</option>
            </select></div>
        </div>
        <div className="form-row">
          <div><label className="form-label">Cuándo</label>
            <select className="form-input" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value as Form['mode'] }))}>
              <option value="offset">Horas antes del evento</option>
              <option value="fixed">Fecha y hora fija</option>
            </select></div>
          {form.mode === 'offset' ? (
            <div><label className="form-label">Horas antes</label>
              <input className="form-input" type="number" min="1" value={form.offset} onChange={e => setForm(f => ({ ...f, offset: e.target.value }))} /></div>
          ) : (
            <div><label className="form-label">Enviar el</label>
              <input className="form-input" type="datetime-local" value={form.send_at} onChange={e => setForm(f => ({ ...f, send_at: e.target.value }))} required /></div>
          )}
        </div>
        {error && <p style={{ color: 'var(--orange)', fontSize: '.85rem' }}>{error}</p>}
        <button className="btn-gold" type="submit" style={{ padding: '8px 20px', fontSize: '.9rem' }}>ADD MESSAGE</button>
      </form>

      <div style={{ display: 'grid', gap: 10 }}>
        {msgs.map(m => (
          <div key={m.id} className="event-card" style={{ padding: 14, cursor: 'default', opacity: m.active ? 1 : .5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <span className="bebas" style={{ fontSize: '1.05rem' }}>{m.title}</span>
                <p className="text-muted-c" style={{ margin: '2px 0 6px', fontSize: '.78rem' }}>
                  {eventName(m.event_id)} · {m.channel} · {m.send_offset_hours != null ? `${m.send_offset_hours}h antes` : m.send_at?.slice(0, 16).replace('T', ' ')}
                  {m.sent_at && ' · ✓ enviado'}
                </p>
                <p className="text-muted-c" style={{ margin: 0, fontSize: '.85rem' }}>{m.body}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '.75rem' }} onClick={() => toggle(m)}>
                  {m.active ? 'PAUSE' : 'ACTIVATE'}
                </button>
                <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '.75rem', borderColor: 'var(--orange)', color: 'var(--orange)' }} onClick={() => remove(m)}>
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
        {msgs.length === 0 && <p className="text-muted-c" style={{ fontSize: '.9rem' }}>No hay mensajes todavía.</p>}
      </div>
    </div>
  )
}
