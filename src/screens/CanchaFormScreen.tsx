import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { actualizarCancha, crearCancha, getCancha } from '../data/repo'
import { deporteDeSesion, useSession } from '../lib/auth'

export function CanchaFormScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useSession()
  const editando = Boolean(id)

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [contacto, setContacto] = useState('')
  const [costo, setCosto] = useState('')
  const [cargando, setCargando] = useState(editando)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!id) return
    getCancha(id).then((c) => {
      if (c) {
        setNombre(c.nombre)
        setDireccion(c.direccion)
        setContacto(c.contacto)
        setCosto(String(c.costoPorHora))
      }
      setCargando(false)
    })
  }, [id])

  if (cargando) return <div className="empty">Cargando…</div>

  const guardar = async () => {
    if (!nombre.trim()) return
    setGuardando(true)
    const data = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      contacto: contacto.trim(),
      costoPorHora: Number(costo) || 0,
    }
    try {
      if (id) await actualizarCancha(id, data)
      else await crearCancha(data, deporteDeSesion(session) ?? 'padel')
      navigate(-1)
    } catch {
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
          <h1>{editando ? 'Editar cancha' : 'Nueva cancha'}</h1>
        </div>
      </div>

      <div className="card">
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          className="input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Club Norte - Cancha 1"
        />

        <label className="field-label" htmlFor="dir">Dirección</label>
        <input
          id="dir"
          className="input"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Calle, número, barrio"
        />

        <label className="field-label" htmlFor="contacto">Contacto (teléfono / notas)</label>
        <input
          id="contacto"
          className="input"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          placeholder="Teléfono del club, encargado…"
        />

        <label className="field-label" htmlFor="costo">Costo por hora (referencia)</label>
        <input
          id="costo"
          className="input"
          type="number"
          inputMode="numeric"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          placeholder="12000"
        />

        <button
          className="btn btn-accent btn-block"
          style={{ marginTop: 16 }}
          onClick={guardar}
          disabled={guardando || !nombre.trim()}
        >
          <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar cancha'}
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 14, textAlign: 'center' }}>
        Las canchas son compartidas: otros profes verán y podrán corregir estos datos.
      </p>
    </>
  )
}
