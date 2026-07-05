import { useState } from 'react'

type Props = {
  src?: string | null
  alt: string
  ratio?: string // '16/9' hero · '4/5' event cards · '1/1' gallery
  className?: string
}

// Imagen lazy con fallback: placeholder bg-secondary + ancla dorada.
// Dani suelta las fotos reales en /public/assets/ después sin tocar código.
export default function Img({ src, alt, ratio = '4/5', className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          aspectRatio: ratio,
          width: '100%',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="2.4" />
          <path d="M12 7.4V21M12 21c-4 0-7.5-3-8-7h3M12 21c4 0 7.5-3 8-7h-3M7 10h10" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={{ aspectRatio: ratio, width: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
}
