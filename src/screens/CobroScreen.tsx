import { type CSSProperties, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { SesionContext, linkCobroDeSesion, setLinkCobro } from '../lib/auth'
import { toast } from '../lib/toast'

const inputStyle: CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  margin: '6px 0 14px',
  border: '0.5px solid var(--border-strong)',
  borderRadius: 'var(--radius)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: 'inherit',
  fontSize: 16,
  boxSizing: 'border-box',
}

export function CobroScreen() {
  const navigate = useNavigate()
  const session = useContext(SesionContext)
  const [link, setLink] = useState(linkCobroDeSesion(session))
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    setGuardando(true)
    try {
      await setLinkCobro(link.trim())
      toast('Link de cobro guardado', 'success')
    } catch {
      toast('No se pudo guardar. Intentá de nuevo.', 'error')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Cobro con MercadoPago</h1>
        </div>
      </div>

      <p className="card-meta" style={{ marginBottom: 14, lineHeight: 1.5 }}>
        Pegá tu <strong>link de pago de MercadoPago</strong>. Cuando le recuerdes una cuota a un alumno por
        WhatsApp, el link se suma al mensaje para que pueda pagarte de una.
      </p>

      <div className="card">
        <label className="row-sub" htmlFor="mplink">Link de pago de MercadoPago</label>
        <input
          id="mplink"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://mpago.la/…"
          inputMode="url"
          style={inputStyle}
        />
        <button className="btn btn-accent btn-block" onClick={guardar} disabled={guardando}>
          <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

      <div className="section-title">¿De dónde saco el link?</div>
      <div className="card">
        <p className="card-meta" style={{ margin: 0, lineHeight: 1.6 }}>
          En la app de MercadoPago: <strong>Cobrar → Link de pago</strong>. Podés crear un link con monto
          libre (el alumno escribe cuánto paga) y reutilizarlo para todos. Pegá ese link acá.
        </p>
      </div>

      <p className="card-meta" style={{ marginTop: 14, lineHeight: 1.5 }}>
        Por ahora la cuota la marcás como pagada vos cuando te entra la plata. La conciliación automática
        (que se marque sola) llega más adelante.
      </p>
    </>
  )
}
