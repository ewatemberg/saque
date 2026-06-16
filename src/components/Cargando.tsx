// Indicador de carga con la temática: una pelota que rebota mientras gira.

interface Props {
  texto?: string
  size?: number
}

export function Cargando({ texto = 'Cargando…', size = 44 }: Props) {
  return (
    <div className="cargando">
      <span className="cargando-ball">
        <svg className="ball-spin" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="18" stroke="var(--accent)" strokeWidth="3" />
          <path d="M9 18 Q24 26 39 18" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          <path d="M9 30 Q24 38 39 30" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
      {texto && <div className="cargando-txt">{texto}</div>}
    </div>
  )
}
