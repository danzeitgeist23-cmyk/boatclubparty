import { useEffect } from 'react'

type HeadOptions = {
  title: string
  description?: string
  image?: string
  type?: string
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// SPA sin SSR: gestiona <title> + meta description/Open Graph/Twitter Card a
// mano (sin react-helmet). Restaura el título anterior al desmontar para que
// la navegación entre páginas no deje metadatos de la página previa.
export function useDocumentHead({ title, description, image, type = 'website' }: HeadOptions) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title
    setMeta('property', 'og:title', title)
    setMeta('name', 'twitter:title', title)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', window.location.href)
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
    if (image) {
      const absolute = image.startsWith('http') ? image : `${window.location.origin}${image}`
      setMeta('property', 'og:image', absolute)
      setMeta('name', 'twitter:card', 'summary_large_image')
      setMeta('name', 'twitter:image', absolute)
    }
    return () => { document.title = prevTitle }
  }, [title, description, image, type])
}
