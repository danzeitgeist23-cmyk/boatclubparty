// Construye enlaces wa.me desde settings.whatsapp_number (nunca hardcoded)
export function waLink(number: string | undefined, text: string): string {
  const digits = (number ?? '').replace(/\D/g, '')
  const encoded = encodeURIComponent(text)
  // un móvil ES son 11 dígitos con prefijo; placeholders tipo "+34XXXXXXXXX" quedan en 2
  const valid = digits.length >= 9
  return valid ? `https://wa.me/${digits}?text=${encoded}` : `https://wa.me/?text=${encoded}`
}
