import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useDeporte } from '../lib/auth'
import { ACENTOS, colorPorDeporte, getAcento, getTema, setAcento, setTema, type Tema } from '../lib/tema'

const MODOS: { valor: Tema; label: string }[] = [
  { valor: 'claro', label: 'Claro' },
  { valor: 'oscuro', label: 'Oscuro' },
  { valor: 'auto', label: 'Automático' },
]

export function AparienciaScreen() {
  const navigate = useNavigate()
  const deporte = useDeporte()
  const [tema, setTemaState] = useState<Tema>(getTema())
  const [acento, setAcentoState] = useState<string>(
    getAcento() || colorPorDeporte(deporte) || ACENTOS[0].color,
  )

  const elegirModo = (t: Tema) => {
    setTema(t)
    setTemaState(t)
  }
  const elegirAcento = (color: string) => {
    setAcento(color)
    setAcentoState(color)
  }

  const esPreset = ACENTOS.some((a) => a.color.toLowerCase() === acento.toLowerCase())

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Apariencia</h1>
        </div>
      </div>

      <div className="section-title">Modo</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {MODOS.map((m) => (
          <button
            key={m.valor}
            className={tema === m.valor ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
            style={{ flex: 1 }}
            onClick={() => elegirModo(m.valor)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="card-meta">"Automático" sigue el modo claro/oscuro del teléfono.</p>

      <div className="section-title">Color de acento</div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '4px 0', alignItems: 'center' }}>
        {ACENTOS.map((a) => {
          const activo = acento.toLowerCase() === a.color.toLowerCase()
          return (
            <button
              key={a.color}
              aria-label={a.nombre}
              onClick={() => elegirAcento(a.color)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: a.color,
                border: activo ? '3px solid var(--text)' : '0.5px solid var(--border)',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          )
        })}

        <label
          aria-label="Color personalizado"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: esPreset ? '0.5px solid var(--border)' : '3px solid var(--text)',
            background: `conic-gradient(red, orange, yellow, green, cyan, blue, magenta, red)`,
            cursor: 'pointer',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <input
            type="color"
            value={acento}
            onChange={(e) => elegirAcento(e.target.value)}
            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </label>
      </div>
      <p className="card-meta" style={{ marginTop: 4 }}>
        Tocá el círculo de colores para elegir cualquiera.
      </p>
    </>
  )
}
