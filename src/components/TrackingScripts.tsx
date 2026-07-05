import { useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'

// Inyecta GA4 / Google Ads / Meta Pixel SOLO si su ID está configurado en settings.
// Cambiar un ID en /admin/connectors surte efecto sin deploy.
export default function TrackingScripts() {
  const s = useSettings()

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    const ids = [s.ga4_id, s.gads_id].filter(Boolean)
    if (ids.length && !document.getElementById('bcp-gtag')) {
      const script = document.createElement('script')
      script.id = 'bcp-gtag'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`
      document.head.appendChild(script)
      w.dataLayer = (w.dataLayer as unknown[]) ?? []
      const gtag = (...args: unknown[]) => { (w.dataLayer as unknown[]).push(args) }
      w.gtag = gtag
      gtag('js', new Date())
      ids.forEach(id => gtag('config', id))
    }
  }, [s.ga4_id, s.gads_id])

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    if (s.meta_pixel_id && !w.fbq) {
      const fbq = (...args: unknown[]) => {
        const q = (fbq as unknown as { queue: unknown[] }).queue
        q.push(args)
      }
      ;(fbq as unknown as { queue: unknown[] }).queue = []
      w.fbq = fbq
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://connect.facebook.net/en_US/fbevents.js'
      document.head.appendChild(script)
      ;(w.fbq as (...a: unknown[]) => void)('init', s.meta_pixel_id)
      ;(w.fbq as (...a: unknown[]) => void)('track', 'PageView')
    }
  }, [s.meta_pixel_id])

  return null
}
