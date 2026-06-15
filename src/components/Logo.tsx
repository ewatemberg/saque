// Logo de Saque: una pelota (de tenis/padel) con su costura. Símbolo agnóstico
// que sirve para ambos deportes. Usa el color de marca (--accent), que se
// adapta a modo claro/oscuro.

interface Props {
  size?: number
}

export function Logo({ size = 28 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke="var(--accent)" strokeWidth="2.6" />
      <path d="M12.5 19 Q24 25 35.5 19" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M12.5 29 Q24 35 35.5 29" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}
