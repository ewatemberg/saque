import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import {
  actualizarFranja,
  crearFranja,
  eliminarFranja,
  getAlumnos,
  getCanchas,
  getFranja,
} from '../data/repo'
import { useDeporte } from '../lib/auth'
import { normalizar } from '../lib/format'
import { toast } from '../lib/toast'
import type { Alumno, Cancha, Categoria } from '../types'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const CATEGORIAS: Categoria[] = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma']

export function FranjaFormScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const deporte = useDeporte()
  const editando = Boolean(id)

  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [diaSemana, setDiaSemana] = useState(2)
  const [hora, setHora] = useState('')
  const [canchaId, setCanchaId] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('5ta')
  const [precio, setPrecio] = useState('6000')
  const [cupos, setCupos] = useState('4')
  const [duracion, setDuracion] = useState('60')
  const [costo, setCosto] = useState('')
  const [permanente, setPermanente] = useState(true)
  const [alumnoIds, setAlumnoIds] = useState<string[]>([])
  const [buscaCancha, setBuscaCancha] = useState('')
  const [buscaAlumno, setBuscaAlumno] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let activo = true
    Promise.all([getCanchas(deporte), getAlumnos()]).then(([cs, als]) => {
      if (!activo) return
      setCanchas(cs)
      setAlumnos(als)
      if (!id) {
        if (cs[0]) {
          setCanchaId(cs[0].id)
          setCosto(String(cs[0].costoPorHora))
        }
        setCargando(false)
      } else {
        getFranja(id).then((f) => {
          if (!activo || !f) {
            setCargando(false)
            return
          }
          setDiaSemana(f.diaSemana)
          setHora(f.hora)
          setCategoria(f.categoria)
          setPrecio(String(f.precio))
          setCupos(String(f.cupos))
          setDuracion(String(f.duracionMin))
          setCosto(String(f.costoCancha))
          setPermanente(f.permanente)
          setAlumnoIds(f.alumnoIds)
          const c = cs.find((x) => x.nombre === f.canchaNombre)
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

  const toggleAlumno = (aid: string) => {
    setAlumnoIds((prev) => (prev.includes(aid) ? prev.filter((x) => x !== aid) : [...prev, aid]))
  }

  const q = normalizar(buscaAlumno)
  const alumnosFiltrados = q
    ? alumnos.filter((a) => normalizar(a.nombre).includes(q) || normalizar(a.categoria).includes(q))
    : alumnos
  const hayMuchos = alumnos.length > 3

  const qc = normalizar(buscaCancha)
  const canchasFiltradas = qc
    ? canchas.filter((c) => normalizar(c.nombre + ' ' + c.direccion).includes(qc))
    : canchas
  const hayMuchasCanchas = canchas.length > 5

  const guardar = async () => {
    const cancha = canchas.find((x) => x.id === canchaId)
    if (!hora.trim() || !cancha) return
    setGuardando(true)
    const data = {
      diaSemana,
      hora: hora.trim(),
      duracionMin: Number(duracion) || 60,
      canchaNombre: cancha.nombre,
      categoria,
      precio: Number(precio) || 0,
      cupos: Number(cupos) || 4,
      costoCancha: Number(costo) || 0,
      permanente,
      alumnoIds,
    }
    try {
      if (id) await actualizarFranja(id, data)
      else await crearFranja(data)
      toast('Franja guardada', 'success')
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
          <h1>{editando ? 'Editar franja' : 'Nueva franja'}</h1>
        </div>
      </div>

      {canchas.length === 0 ? (
        <div className="card">
          <p style={{ fontSize: 14, color: 'var(--text-2)', margin: 0 }}>
            Primero agregá una cancha (pie de la app → Canchas) para crear franjas.
          </p>
        </div>
      ) : (
        <div className="card">
          <label className="field-label">Cancha</label>
          {hayMuchasCanchas && (
            <div style={{ position: 'relative', margin: '4px 0 8px' }}>
              <span style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-3)' }}>
                <Icon name="search" size={18} />
              </span>
              <input
                className="input"
                style={{ paddingLeft: 38 }}
                placeholder="Buscar cancha…"
                value={buscaCancha}
                onChange={(e) => setBuscaCancha(e.target.value)}
              />
            </div>
          )}
          <div
            style={{
              maxHeight: 180,
              overflowY: 'auto',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '4px 6px',
              marginBottom: 12,
            }}
          >
            {canchasFiltradas.length === 0 && (
              <p className="card-meta" style={{ padding: '8px 4px', margin: 0 }}>
                Ninguna cancha coincide con “{buscaCancha}”.
              </p>
            )}
            {canchasFiltradas.map((c) => (
              <label
                key={c.id}
                className="login-acepto"
                style={{
                  margin: 0,
                  padding: '8px 8px',
                  borderRadius: 'var(--radius)',
                  background: canchaId === c.id ? 'var(--accent-weak)' : undefined,
                }}
              >
                <input
                  type="radio"
                  name="cancha"
                  checked={canchaId === c.id}
                  onChange={() => elegirCancha(c.id)}
                />
                <span>
                  {c.nombre}
                  {c.direccion && <span className="card-meta"> · {c.direccion}</span>}
                </span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="dia">Día</label>
              <select id="dia" className="input" value={diaSemana} onChange={(e) => setDiaSemana(Number(e.target.value))}>
                {DIAS.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="hora">Hora</label>
              <input id="hora" className="input" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
          </div>

          <label className="field-label" htmlFor="cat">Categoría</label>
          <select id="cat" className="input" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="precio">Precio x alumno</label>
              <input id="precio" className="input" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="cupos">Cupos</label>
              <input id="cupos" className="input" type="number" value={cupos} onChange={(e) => setCupos(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="dur">Duración (min)</label>
              <input id="dur" className="input" type="number" value={duracion} onChange={(e) => setDuracion(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="costo">Costo de cancha</label>
              <input id="costo" className="input" type="number" value={costo} onChange={(e) => setCosto(e.target.value)} />
            </div>
          </div>

          <label className="login-acepto" style={{ margin: '14px 0 4px' }}>
            <input type="checkbox" checked={permanente} onChange={(e) => setPermanente(e.target.checked)} />
            <span>Permanente (se renueva todos los meses)</span>
          </label>

          <div className="field-label">
            Alumnos fijos del turno
            {alumnoIds.length > 0 && <span className="card-meta"> · {alumnoIds.length} seleccionado{alumnoIds.length === 1 ? '' : 's'}</span>}
          </div>
          {alumnos.length === 0 && <p className="card-meta">Todavía no hay alumnos para asignar.</p>}

          {hayMuchos && (
            <div style={{ position: 'relative', margin: '4px 0 8px' }}>
              <span style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-3)' }}>
                <Icon name="search" size={18} />
              </span>
              <input
                className="input"
                style={{ paddingLeft: 38 }}
                placeholder="Buscar alumno…"
                value={buscaAlumno}
                onChange={(e) => setBuscaAlumno(e.target.value)}
              />
            </div>
          )}

          {alumnos.length > 0 && alumnosFiltrados.length === 0 && (
            <p className="card-meta">Ningún alumno coincide con “{buscaAlumno}”.</p>
          )}
          {alumnosFiltrados.map((a) => (
            <label key={a.id} className="login-acepto" style={{ margin: '4px 0' }}>
              <input type="checkbox" checked={alumnoIds.includes(a.id)} onChange={() => toggleAlumno(a.id)} />
              <span>{a.nombre} <span className="card-meta">· {a.categoria}</span></span>
            </label>
          ))}

          <button className="btn btn-accent btn-block" style={{ marginTop: 16 }} onClick={guardar} disabled={guardando || !hora.trim()}>
            <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar franja'}
          </button>

          {editando && (
            <button
              className="btn btn-block"
              style={{ marginTop: 10, color: 'var(--danger)' }}
              onClick={() => {
                if (confirm('¿Eliminar esta franja? No borra los turnos ya generados.')) {
                  eliminarFranja(id as string).then(() => navigate(-1))
                }
              }}
            >
              <Icon name="trash" size={16} /> Eliminar franja
            </button>
          )}
        </div>
      )}
    </>
  )
}
