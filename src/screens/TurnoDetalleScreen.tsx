import { type CSSProperties, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icon } from '../components/Icon'
import {
  anotarAlumno,
  cambiarEstadoTurno,
  darDeBaja,
  eliminarTurno,
  getAlumnos,
  getTurno,
  marcarAsistencia,
  reprogramarTurno,
} from '../data/repo'
import { formatFechaCorta, normalizar } from '../lib/format'
import { toast } from '../lib/toast'
import { abrirWhatsApp, mensajeRecupero } from '../lib/whatsapp'
import type { Alumno, Inscripto, Turno } from '../types'

export function TurnoDetalleScreen() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [turno, setTurno] = useState<Turno | null>(null)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const [buscaAnotar, setBuscaAnotar] = useState('')
  const [reprog, setReprog] = useState(false)
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [nuevaHora, setNuevaHora] = useState('')
  const [bajaDe, setBajaDe] = useState<Inscripto | null>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)

  const reload = useCallback(async () => {
    const t = await getTurno(id)
    setTurno(t)
    setCargando(false)
  }, [id])

  useEffect(() => {
    reload()
    getAlumnos().then(setAlumnos)
  }, [reload])

  if (cargando) return <Cargando />
  if (!turno) return <div className="empty">No se encontró el turno.</div>

  const ocupados = turno.inscriptos.length
  const lugares = turno.cupos - ocupados
  const cubreCosto = turno.precio * ocupados >= turno.costoCancha
  const suspendido = turno.estado === 'suspendido'
  const enRecupero = turno.estado === 'recupero'
  const disponibles = alumnos.filter((a) => !turno.inscriptos.some((i) => i.alumnoId === a.id))
  const qAnotar = normalizar(buscaAnotar)
  const disponiblesFiltrados = qAnotar
    ? disponibles.filter((a) => normalizar(a.nombre).includes(qAnotar) || normalizar(a.categoria).includes(qAnotar))
    : disponibles

  const accion = async (fn: () => Promise<void>) => {
    try {
      await fn()
      await reload()
    } catch {
      toast('No se pudo completar la acción. Intentá de nuevo.', 'error')
    }
  }

  const abrirReprogramar = () => {
    setNuevaFecha(turno.fecha)
    setNuevaHora(turno.hora)
    setReprog(true)
  }

  const confirmarRecupero = () => {
    if (!nuevaFecha || !nuevaHora) {
      toast('Elegí la fecha y la hora del recupero.', 'error')
      return
    }
    accion(async () => {
      await reprogramarTurno(turno.id, nuevaFecha, nuevaHora)
      setReprog(false)
      toast('Recupero coordinado.', 'success')
    })
  }

  const inputRecupero: CSSProperties = {
    flex: 1,
    height: 40,
    padding: '0 10px',
    border: '0.5px solid var(--border-strong)',
    borderRadius: 'var(--radius)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: 'inherit',
    fontSize: 15,
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
        <div className="card warning">
          <div className="card-meta" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Icon name="rain" size={14} /> Turno suspendido · coordiná el recupero
          </div>
          {!reprog ? (
            <button className="btn btn-block" onClick={abrirReprogramar}>
              <Icon name="calendar" size={16} /> Coordinar recupero
            </button>
          ) : (
            <>
              <div className="row-sub" style={{ marginBottom: 6 }}>Nueva fecha y hora</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  type="date"
                  aria-label="Fecha del recupero"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  style={inputRecupero}
                />
                <input
                  type="time"
                  aria-label="Hora del recupero"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                  style={inputRecupero}
                />
              </div>
              <button className="btn btn-accent btn-block" onClick={confirmarRecupero}>
                <Icon name="check" size={16} /> Confirmar recupero
              </button>
            </>
          )}
        </div>
      )}

      {enRecupero && (
        <div className="card warning">
          <div className="card-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" size={14} /> Recupero · {formatFechaCorta(turno.fecha)} {turno.hora}
          </div>
          <button
            className="btn btn-block"
            style={{ marginTop: 10 }}
            onClick={() =>
              abrirWhatsApp(
                mensajeRecupero(formatFechaCorta(turno.fecha), turno.hora, turno.categoria, turno.canchaNombre),
              )
            }
          >
            <Icon name="whatsapp" size={16} /> Avisar el recupero a los alumnos
          </button>
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
              onClick={() => setBajaDe(i)}
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
          {disponibles.length > 5 && (
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <span style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-3)' }}>
                <Icon name="search" size={18} />
              </span>
              <input
                className="input"
                style={{ paddingLeft: 38 }}
                placeholder="Buscar alumno…"
                value={buscaAnotar}
                onChange={(e) => setBuscaAnotar(e.target.value)}
              />
            </div>
          )}
          {disponibles.length === 0 && <div className="empty">No hay más alumnos para anotar.</div>}
          {disponibles.length > 0 && disponiblesFiltrados.length === 0 && (
            <div className="empty">Ningún alumno coincide con “{buscaAnotar}”.</div>
          )}
          {disponiblesFiltrados.map((a) => (
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
        onClick={() => setConfirmarEliminar(true)}
      >
        <Icon name="trash" size={16} /> Eliminar turno
      </button>

      {bajaDe && (
        <ConfirmDialog
          titulo="Dar de baja"
          mensaje={
            <>
              ¿Dar de baja a <strong>{bajaDe.nombre || bajaDe.iniciales}</strong> de este turno?
            </>
          }
          confirmLabel="Dar de baja"
          peligro
          onConfirm={() => {
            const alumnoId = bajaDe.alumnoId
            setBajaDe(null)
            accion(() => darDeBaja(turno.id, alumnoId))
          }}
          onCancel={() => setBajaDe(null)}
        />
      )}

      {confirmarEliminar && (
        <ConfirmDialog
          titulo="Eliminar turno"
          mensaje="¿Eliminar este turno? También se borran sus inscripciones. No se puede deshacer."
          confirmLabel="Eliminar"
          peligro
          onConfirm={() => {
            setConfirmarEliminar(false)
            eliminarTurno(turno.id)
              .then(() => navigate(-1))
              .catch(() => toast('No se pudo eliminar. Intentá de nuevo.', 'error'))
          }}
          onCancel={() => setConfirmarEliminar(false)}
        />
      )}
    </>
  )
}
