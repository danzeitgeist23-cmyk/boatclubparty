import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

// Editor de la tabla settings — regla de oro: nada hardcoded en JSX.
const GROUPS: { title: string; keys: { key: string; label: string; hint?: string }[] }[] = [
  {
    title: 'TRACKING',
    keys: [
      { key: 'ga4_id', label: 'Google Analytics 4 ID', hint: 'G-XXXXXXX · se inyecta al guardarlo, sin deploy' },
      { key: 'gads_id', label: 'Google Ads tag ID', hint: 'AW-XXXXXXX' },
      { key: 'meta_pixel_id', label: 'Meta Pixel ID' },
    ],
  },
  {
    title: 'CONTACTO Y SOCIAL',
    keys: [
      { key: 'whatsapp_number', label: 'WhatsApp', hint: '+34XXXXXXXXX — lo usan todos los CTAs' },
      { key: 'contact_email', label: 'Email de contacto' },
      { key: 'instagram_url', label: 'Instagram URL' },
      { key: 'tiktok_url', label: 'TikTok URL' },
      { key: 'facebook_url', label: 'Facebook URL' },
      { key: 'youtube_url', label: 'YouTube URL', hint: 'el icono aparece al rellenarlo' },
    ],
  },
  {
    title: 'MÚSICA Y CALENDARIO',
    keys: [
      { key: 'mixcloud_user', label: 'Mixcloud user' },
      { key: 'radio_pure_url', label: 'Stream Pure Ibiza Radio' },
      { key: 'radio_global_url', label: 'Stream Ibiza Global Radio' },
      { key: 'gcal_embed_url', label: 'Google Calendar embed URL', hint: 'Google Calendar → Ajustes → Integrar → URL pública; se muestra en /calendar' },
    ],
  },
  {
    title: 'FAMILY',
    keys: [{ key: 'family_discount_percent', label: '% descuento Boat Club Family' }],
  },
]

export default function ConnectorsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')

  useEffect(() => {
    supabase.from('settings').select('key,value').then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(r => [r.key, r.value ?? ''])))
    })
  }, [])

  async function saveAll() {
    setState('saving')
    const rows = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }))
    const { error } = await supabase.from('settings').upsert(rows)
    setState(error ? 'error' : 'ok')
    if (!error) setTimeout(() => setState('idle'), 2500)
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="bebas" style={{ fontSize: '1.8rem' }}>Connectors</h1>
      <p className="text-muted-c" style={{ margin: '0 0 24px', fontSize: '.9rem' }}>
        Todo lo configurable de la web. Los cambios surten efecto al recargar — sin deploy.
      </p>

      {GROUPS.map(g => (
        <div key={g.title} className="event-card" style={{ padding: 20, cursor: 'default', marginBottom: 18 }}>
          <p className="bebas" style={{ letterSpacing: '.15em', margin: '0 0 14px', color: 'var(--gold)' }}>{g.title}</p>
          {g.keys.map(({ key, label, hint }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <input className="form-input" value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
              {hint && <p className="text-muted-c" style={{ fontSize: '.72rem', margin: '-8px 0 12px' }}>{hint}</p>}
            </div>
          ))}
        </div>
      ))}

      <button className="btn-gold" onClick={saveAll} disabled={state === 'saving'}>
        {state === 'saving' ? 'SAVING…' : 'SAVE ALL'}
      </button>
      {state === 'ok' && <span style={{ color: 'var(--gold)', marginLeft: 14 }}>Saved ✓</span>}
      {state === 'error' && <span style={{ color: 'var(--orange)', marginLeft: 14 }}>Error — ¿tienes rol admin?</span>}
    </div>
  )
}
