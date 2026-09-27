import type { EventRow } from './supabase'

// Devuelve la descripción/marina en el idioma activo si existe traducción en
// content_i18n; si no, cae al inglés de las columnas base (nunca vacío).
export function localizedEventText(event: EventRow, lang: string) {
  const localized = event.content_i18n?.[lang]
  return {
    description: localized?.description ?? event.description,
    marina: localized?.marina ?? event.marina,
  }
}
