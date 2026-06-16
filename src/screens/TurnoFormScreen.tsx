import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { actualizarTurno, crearTurno, getCanchas, getTurno } from '../data/repo'
import { useDeporte } from '../lib/auth'
import { toast } from '../lib/toast'
import type { Cancha, Categoria } from '../types'

const CATEGORIAS: Categoria[] = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma']

function hoyISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

export function TurnoFormScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const deporte = useDeporte()
  const editando = Boolean(id)

  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [fecha, setFecha] = useState(hoyISO())
  const [hora, setHora] = useState('')
  const [canchaId, setCanchaId] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('5ta')
  const [precio, setPrecio] = useState('6000')
  const [cupos, setCupos] = useState('4')
  const [duracion, setDuracion] = useState('60')
  const [costo, setCosto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let activo = true
    getCanchas(deporte).then((cs) => {
      if (!activo) return
      setCanchas(cs)
      if (!id) {
        // alta: precargar la primera cancha y su costo de referencia
        if (cs[0]) {
          setCanchaId(cs[0].id)
          setCosto(String(cs[0].costoPorHora))
        }
        setCargando(false)
      } else {
        getTurno(id).then((t) => {
          if (!activo || !t) {
            setCargando(false)
            return
          }
          setFecha(t.fecha || hoyISO())
          setHora(t.hora)
          setCategoria(t.categoria)
          setPrecio(String(t.precio))
          setCupos(String(t.cupos))
          setDuracion(String(t.duracionMin))
          setCosto(String(t.costoCancha))
          const c = cs.find((x) => x.nombre === t.canchaNombre)
          if (c) setCanchaId(c.id)
          setCargando(false)
        })
      }
    })
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (cargando) return <Cargando />

  const elegirCancha = (cid: string) => {
    setCanchaId(cid)
    const c = canchas.find((x) => x.id === cid)
    if (c) setCosto(String(c.costoPorHora))
  }

  const guardar = async () => {
    const cancha = canchas.find((x) => x.id === canchaId)
    if (!hora.trim() || !cancha) return
    setGuardando(true)
    const data = {
      fecha,
      hora: hora.trim(),
      duracionMin: Number(duracion) || 60,
      canchaNombre: cancha.nombre,
      categoria,
      precio: Number(precio) || 0,
      cupos: Number(cupos) || 4,
      costoCancha: Number(costo) || 0,
    }
    try {
      if (id) await actualizarTurno(id, data)
      else await crearTurno(data)
      toast('Turno guardado', 'success')
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
          <h1>{editando ? 'Editar turno' : 'Nuevo turno'}</h1>
        </div>
      </div>

      {canchas.length === 0 ? (
        <div className="card">
          <p style={{ fontSize: 14, color: 'var(--text-2)', margin: 0 }}>
            Primero agregá una cancha (en el pie de la app → Canchas) para poder crear turnos.
          </p>
        </div>
      ) : (
        <div className="card">
          <label className="field-label" htmlFor="cancha">Cancha</label>
          <select id="cancha" className="input" value={canchaId} onChange={(e) => elegirCancha(e.target.value)}>
            {canchas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="fecha">Fecha</label>
              <input id="fecha" className="input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="hora">Hora</label>
              <input id="hora" className="input" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
          </div>

          <label className="field-label" htmlFor="cat">Categoría</label>
          <select id="cat" className="input" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="precio">Precio x alumno</label>
              <input id="precio" className="input" type="number" inputMode="numeric" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="cupos">Cupos</label>
              <input id="cupos" className="input" type="number" inputMode="numeric" value={cupos} onChange={(e) => setCupos(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="dur">Duración (min)</label>
              <input id="dur" className="input" type="number" inputMode="numeric" value={duracion} onChange={(e) => setDuracion(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="costo">Costo de cancha</label>
              <input id="costo" className="input" type="number" inputMode="numeric" value={costo} onChange={(e) => setCosto(e.target.value)} />
            </div>
          </div>

          <button
            className="btn btn-accent btn-block"
            style={{ marginTop: 16 }}
            onClick={guardar}
            disabled={guardando || !hora.trim()}
          >
            <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar turno'}
          </button>
        </div>
      )}
    </>
  )
}
