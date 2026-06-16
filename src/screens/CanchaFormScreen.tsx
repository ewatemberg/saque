import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { actualizarCancha, crearCancha, getCancha, getCanchas } from '../data/repo'
import { useDeporte } from '../lib/auth'
import { normalizar } from '../lib/format'
import { toast } from '../lib/toast'
import type { Cancha } from '../types'

function pareceMismo(a: string, b: string): boolean {
  const na = normalizar(a)
  const nb = normalizar(b)
  if (na.length < 4 || nb.length < 4) return na === nb
  return na === nb || na.includes(nb) || nb.includes(na)
}

export function CanchaFormScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const deporte = useDeporte()
  const editando = Boolean(id)

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [contacto, setContacto] = useState('')
  const [costo, setCosto] = useState('')
  const [existentes, setExistentes] = useState<Cancha[]>([])
  const [cargando, setCargando] = useState(editando)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!id) getCanchas(deporte).then(setExistentes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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

  if (cargando) return <Cargando />

  const posiblesDuplicados =
    !id && nombre.trim().length >= 3 ? existentes.filter((c) => pareceMismo(c.nombre, nombre)) : []

  const guardar = async () => {
    if (!nombre.trim()) return
    if (
      posiblesDuplicados.length > 0 &&
      !window.confirm('Puede que esta cancha ya exista (mirá el aviso de arriba). ¿Crearla igual?')
    ) {
      return
    }
    setGuardando(true)
    const data = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      contacto: contacto.trim(),
      costoPorHora: Number(costo) || 0,
    }
    try {
      if (id) await actualizarCancha(id, data)
      else await crearCancha(data, deporte ?? 'padel')
      toast('Cancha guardada', 'success')
      navigate(-1)
    } catch {
      setGuardando(false)
      toast('No se pudo guardar. Revisá tu conexión e intentá de nuevo.', 'error')
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

        {posiblesDuplicados.length > 0 && (
          <div
            style={{
              background: 'var(--warning-bg)',
              border: '0.5px solid var(--warning)',
              borderRadius: 'var(--radius)',
              padding: '10px 12px',
              margin: '8px 0 4px',
            }}
          >
            <div style={{ fontSize: 12.5, color: 'var(--warning)', fontWeight: 500, marginBottom: 6 }}>
              <Icon name="alert" size={14} /> ¿No será una de estas que ya existe?
            </div>
            {posiblesDuplicados.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cancha/${c.id}`)}
                style={{ cursor: 'pointer', fontSize: 13, padding: '4px 0', color: 'var(--text)' }}
              >
                • {c.nombre} <span className="card-meta">— usar esta</span>
              </div>
            ))}
          </div>
        )}

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
