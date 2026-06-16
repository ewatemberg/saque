import { type CSSProperties, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { SesionContext, idDeSesion, perfilPublicoDeSesion, setPerfilPublico } from '../lib/auth'
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

export function MiPaginaScreen() {
  const navigate = useNavigate()
  const session = useContext(SesionContext)
  const inicial = perfilPublicoDeSesion(session)
  const profeId = idDeSesion(session)

  const [nombre, setNombre] = useState(inicial.nombre)
  const [whatsapp, setWhatsapp] = useState(inicial.whatsapp)
  const [guardando, setGuardando] = useState(false)

  const link = profeId ? `${window.location.origin}/#/c/${profeId}` : ''

  const guardar = async () => {
    setGuardando(true)
    try {
      await setPerfilPublico(nombre.trim(), whatsapp.trim())
      toast('Datos guardados', 'success')
    } catch {
      toast('No se pudo guardar. Intentá de nuevo.', 'error')
    } finally {
      setGuardando(false)
    }
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link)
      toast('Link copiado', 'success')
    } catch {
      toast('No se pudo copiar el link.', 'error')
    }
  }

  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mis turnos disponibles', url: link })
      } catch {
        /* el usuario canceló */
      }
    } else {
      copiar()
    }
  }

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Mi página pública</h1>
        </div>
      </div>

      <p className="card-meta" style={{ marginBottom: 14 }}>
        Compartí un link abierto con tu calendario de turnos disponibles. Cualquiera puede verlo sin
        instalar nada, y reservar un lugar escribiéndote por WhatsApp.
      </p>

      <div className="card">
        <label className="row-sub" htmlFor="nombre">Nombre público</label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Profe Emilio"
          style={inputStyle}
        />

        <label className="row-sub" htmlFor="whatsapp">WhatsApp (con código de país)</label>
        <input
          id="whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="Ej. +54 9 221 555-1234"
          inputMode="tel"
          style={inputStyle}
        />

        <button className="btn btn-accent btn-block" onClick={guardar} disabled={guardando}>
          <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

      <div className="section-title">Tu link</div>
      {profeId ? (
        <div className="card">
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-2)',
              wordBreak: 'break-all',
              marginBottom: 12,
              fontFamily: 'monospace',
            }}
          >
            {link}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-block" style={{ flex: 1 }} onClick={copiar}>
              Copiar
            </button>
            <button className="btn btn-accent btn-block" style={{ flex: 1 }} onClick={compartir}>
              <Icon name="whatsapp" size={16} /> Compartir
            </button>
          </div>
        </div>
      ) : (
        <div className="empty">
          El link aparece cuando entrás con tu cuenta (en modo de prueba sin conexión no hay link).
        </div>
      )}
    </>
  )
}
