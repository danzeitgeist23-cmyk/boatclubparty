import { useState } from 'react'

// Compartir por WhatsApp (siempre presente) + copiar enlace
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href
  const waShare = `https://wa.me/?text=${encodeURIComponent(`${title} 🚤 ${url}`)}`

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <a href={waShare} target="_blank" rel="noreferrer" className="btn-outline"
        style={{ padding: '8px 16px', fontSize: '.85rem' }}>
        Share on WhatsApp
      </a>
      <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '.85rem' }}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          } catch { /* clipboard bloqueado: no-op */ }
        }}>
        {copied ? 'Copied ✓' : 'Copy link'}
      </button>
    </div>
  )
}
