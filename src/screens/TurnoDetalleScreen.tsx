import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import {
  anotarAlumno,
  cambiarEstadoTurno,
  darDeBaja,
  eliminarTurno,
  getAlumnos,
  getTurno,
  marcarAsistencia,
} from '../data/repo'
import { toast } from '../lib/toast'
import { abrirWhatsApp } from '../lib/whatsapp'
import type { Alumno, Turno } from '../types'

export function TurnoDetalleScreen() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [turno, setTurno] = useState<Turno | null>(null)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarPicker, setMostrarPicker] = useState(false)

  const reload = useCallback(async () => {
    const t = await getTurno(id)
    setTurno(t)
    setCargando(false)
  }, [id])

  useEffect(() => {
    reload()
    getAlumnos().then(setAlumnos)
  }, [reload])

  if (cargando) return <div className="empty">Cargando…</div>
  if (!turno) return <div className="empty">No se encontró el turno.</div>

  const ocupados = turno.inscriptos.length
  const lugares = turno.cupos - ocupados
  const cubreCosto = turno.precio * ocupados >= turno.costoCancha
  const suspendido = turno.estado !== 'activo'
  const disponibles = alumnos.filter((a) => !turno.inscriptos.some((i) => i.alumnoId === a.id))

  const accion = async (fn: () => Promise<void>) => {
    try {
      await fn()
      await reload()
    } catch {
      toast('No se pudo completar la acción. Intentá de nuevo.', 'error')
    }
  }

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <div>
            <h1>{turno.hora}</h1>
            <div className="sub">
              {turno.canchaNombre} · {turno.categoria}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-sm"
            aria-label="Editar turno"
            onClick={() => navigate(`/turno/${turno.id}/editar`)}
          >
            <Icon name="edit" size={16} />
          </button>
          {suspendido ? (
            <button className="btn btn-sm" onClick={() => accion(() => cambiarEstadoTurno(turno.id, 'activo'))}>
              Reactivar
            </button>
          ) : (
            <button className="btn btn-sm" onClick={() => accion(() => cambiarEstadoTurno(turno.id, 'suspendido'))}>
              Suspender
            </button>
          )}
        </div>
      </div>

      {suspendido && (
        <div className="card muted">
          <span className="card-meta">
            <Icon name="rain" size={14} /> Turno suspendido · recupero pendiente
          </span>
        </div>
      )}

      {!suspendido && lugares > 0 && cubreCosto && (
        <div className="card warning">
          <div className="card-top">
            <span className="pill pill-warning">
              {lugares} {lugares > 1 ? 'lugares' : 'lugar'} libre · {ocupados}/{turno.cupos}
            </span>
          </div>
          <button
            className="btn btn-block"
            style={{ marginTop: 10 }}
            onClick={() =>
              abrirWhatsApp(
                `Hola! Se liberó un lugar el ${turno.hora} (${turno.categoria}, ${turno.canchaNombre}). ¿Lo querés?`,
              )
            }
          >
            <Icon name="whatsapp" size={16} /> Avisar lugar libre
          </button>
        </div>
      )}

      {!suspendido && !cubreCosto && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--danger)' }}>
            <Icon name="alert" size={16} /> Con {ocupados} {ocupados === 1 ? 'alumno' : 'alumnos'} no cubre el costo de
            cancha
          </div>
        </div>
      )}

      <div className="section-title">
        Asistencia · {ocupados}/{turno.cupos}
      </div>

      {turno.inscriptos.map((i) => (
        <div className="row" key={i.alumnoId}>
          <span className={`avatar ${i.asistio ? '' : 'neutral'}`}>{i.iniciales}</span>
          <div className="row-main">
            <div className="row-name">{i.nombre || i.iniciales}</div>
            <div className="row-sub">{i.asistio ? 'asistió' : 'sin marcar'}</div>
          </div>
          <div className="row-right">
            <button
              className={i.asistio ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
              aria-label={i.asistio ? 'Marcar como ausente' : 'Marcar asistencia'}
              onClick={() => accion(() => marcarAsistencia(turno.id, i.alumnoId, !i.asistio))}
            >
              <Icon name="check" size={16} />
            </button>
            <button
              className="btn btn-sm"
              aria-label={`Dar de baja a ${i.nombre || i.iniciales}`}
              onClick={() => {
                if (confirm(`¿Dar de baja a ${i.nombre || i.iniciales} de este turno?`)) {
                  accion(() => darDeBaja(turno.id, i.alumnoId))
                }
              }}
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        </div>
      ))}

      {ocupados === 0 && <div className="empty">Todavía no hay alumnos anotados.</div>}

      {lugares > 0 && !mostrarPicker && (
        <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => setMostrarPicker(true)}>
          <Icon name="plus" size={16} /> Anotar alumno
        </button>
      )}

      {mostrarPicker && (
        <>
          <div className="section-title">Elegí un alumno</div>
          {disponibles.length === 0 && <div className="empty">No hay más alumnos para anotar.</div>}
          {disponibles.map((a) => (
            <div className="row" key={a.id}>
              <span className="avatar">{a.iniciales}</span>
              <div className="row-main">
                <div className="row-name">{a.nombre}</div>
                <div className="row-sub">
                  {a.categoria} · {a.tipo}
                </div>
              </div>
              <div className="row-right">
                <button
                  className="btn btn-sm"
                  onClick={() =>
                    accion(async () => {
                      await anotarAlumno(turno.id, a.id)
                      setMostrarPicker(false)
                    })
                  }
                >
                  Anotar
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <button
        className="btn btn-block"
        style={{ marginTop: 24, color: 'var(--danger)' }}
        onClick={() => {
          if (confirm('¿Eliminar este turno? También se borran sus inscripciones.')) {
            eliminarTurno(turno.id)
              .then(() => navigate(-1))
              .catch(() => toast('No se pudo eliminar. Intentá de nuevo.', 'error'))
          }
        }}
      >
        <Icon name="trash" size={16} /> Eliminar turno
      </button>
    </>
  )
}
