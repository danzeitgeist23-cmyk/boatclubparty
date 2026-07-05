// Único formateador de precios de la web (bug histórico #2: precios inconsistentes).
// El valor SOLO vive en Supabase/EVENTS — nunca hardcodear un precio en JSX.
type Props = {
  value: number | string
  prefix?: string
  size?: string
}

export default function Price({ value, prefix = 'From ', size = '1.4rem' }: Props) {
  return (
    <span className="bebas" style={{ color: 'var(--gold)', fontSize: size }}>
      {prefix}€{Number(value).toFixed(0)}
    </span>
  )
}
