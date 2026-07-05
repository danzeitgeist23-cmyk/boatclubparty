// Lógica de descuentos (fase 1: el sistema calcula y comunica, no cobra)
// precio_final = price × (1 - tier%) × (1 - family%) · tope combinado 25%
export type Tier = { id?: number; min_bookings: number; percent: number; label: string }

export const DISCOUNT_CAP = 25

const byMin = (tiers: Tier[]) => [...tiers].sort((a, b) => a.min_bookings - b.min_bookings)

export function activeTier(tiers: Tier[], bookings: number): Tier | null {
  return byMin(tiers).filter(t => bookings >= t.min_bookings).pop() ?? null
}

export function nextTier(tiers: Tier[], bookings: number): Tier | null {
  return byMin(tiers).find(t => bookings < t.min_bookings) ?? null
}

export function totalDiscountPercent(tierPercent: number, familyPercent: number): number {
  const effective = (1 - (1 - tierPercent / 100) * (1 - familyPercent / 100)) * 100
  return Math.min(Math.round(effective * 10) / 10, DISCOUNT_CAP)
}

export function discountedPrice(price: number, totalPercent: number): number {
  return price * (1 - totalPercent / 100)
}
