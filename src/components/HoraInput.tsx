// Selector de hora propio (hora + minutos) en vez del <input type="time">, que
// abre el diálogo de reloj nativo del SO — en algunos Android (Samsung) ese
// diálogo se corta. Con dos <select> se ve igual en todos los dispositivos.

const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTOS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

interface Props {
  value: string // "HH:MM" o ""
  onChange: (value: string) => void
  id?: string
}

export function HoraInput({ value, onChange, id }: Props) {
  const [h = '', m = ''] = (value || '').split(':')
  // Si el minuto guardado no cae en pasos de 5 (datos viejos), lo conservamos.
  const minutos = m && !MINUTOS.includes(m) ? [...MINUTOS, m].sort() : MINUTOS

  const set = (nh: string, nm: string) => onChange(nh && nm ? `${nh}:${nm}` : '')

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <select
        id={id}
        className="input"
        value={h}
        onChange={(e) => set(e.target.value, m || '00')}
        style={{ flex: 1 }}
        aria-label="Hora"
      >
        <option value="" disabled>
          hs
        </option>
        {HORAS.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      <select
        className="input"
        value={m}
        onChange={(e) => set(h || '00', e.target.value)}
        style={{ flex: 1 }}
        aria-label="Minutos"
      >
        <option value="" disabled>
          min
        </option>
        {minutos.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </div>
  )
}
