import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getResumenHoy, getTurnosHoy } from '../data/repo'
import { signOut } from '../lib/auth'
import { formatCompacto } from '../lib/format'
import { useData } from '../lib/useData'
import { abrirWhatsApp } from '../lib/whatsapp'
import type { Turno } from '../types'

export function HoyScreen() {
  const navigate = useNavigate()
  const turnos = useData(getTurnosHoy)
  const resumen = useData(getResumenHoy)

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Hoy</h1>
          <div className="sub">jueves 15 jun · Profe Emilio</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Nuevo turno" onClick={() => navigate('/turno/nuevo')}>
            <Icon name="plus" />
          </button>
          <Icon name="bell" label="Notificaciones" />
          <button className="icon-btn" aria-label="Cerrar sesión" onClick={() => signOut()}>
            <Icon name="user" />
          </button>
        </div>
      </div>

      <div className="metrics">
        <Metric label="Turnos" value={resumen ? String(resumen.turnos) : '–'} />
        <Metric label="Alumnos" value={resumen ? String(resumen.alumnos) : '–'} />
        <Metric label="Neto día" value={resumen ? formatCompacto(resumen.netoDia) : '–'} />
      </div>

      {turnos?.map((t) => (
        <TurnoCard key={t.id} turno={t} />
      ))}
    </>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  )
}

function CardMeta({ turno }: { turno: Turno }) {
  return (
    <span className="card-meta">
      · {turno.canchaNombre} · {turno.categoria}
    </span>
  )
}

function TurnoCard({ turno }: { turno: Turno }) {
  const navigate = useNavigate()
  const abrir = () => navigate(`/turno/${turno.id}`)
  const ocupados = turno.inscriptos.length
  const lugares = turno.cupos - ocupados

  if (turno.estado === 'suspendido') {
    return (
      <div className="card muted clickable" onClick={abrir}>
        <div className="card-top">
          <div>
            <span className="card-time" style={{ textDecoration: 'line-through', color: 'var(--text-2)' }}>
              {turno.hora}
            </span>{' '}
            <CardMeta turno={turno} />
          </div>
          <span className="pill pill-neutral">
            <Icon name="rain" size={13} /> suspendido
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
          <span className="card-meta">recupero pendiente</span>
          <button
            className="btn btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              abrir()
            }}
          >
            Reprogramar
          </button>
        </div>
      </div>
    )
  }

  const cubreCosto = turno.precio * ocupados >= turno.costoCancha

  if (lugares === 0) {
    return (
      <div className="card clickable" onClick={abrir}>
        <div className="card-top">
          <div>
            <span className="card-time">{turno.hora}</span> <CardMeta turno={turno} />
          </div>
          <span className="pill pill-success">
            completo {ocupados}/{turno.cupos}
          </span>
        </div>
        <div className="avatars">
          {turno.inscriptos.map((i) => (
            <span key={i.alumnoId} className="avatar">
              {i.iniciales}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (!cubreCosto) {
    return (
      <div className="card clickable" onClick={abrir}>
        <div className="card-top">
          <div>
            <span className="card-time">{turno.hora}</span> <CardMeta turno={turno} />
          </div>
          <span className="pill pill-danger">
            {ocupados}/{turno.cupos}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: 'var(--danger)' }}>
          <Icon name="alert" size={15} /> no cubre el costo de cancha
        </div>
      </div>
    )
  }

  const mensaje = `Hola! Se liberó un lugar el ${turno.hora} (${turno.categoria}, ${turno.canchaNombre}). ¿Lo querés?`

  return (
    <div className="card warning clickable" onClick={abrir}>
      <div className="card-top">
        <div>
          <span className="card-time">{turno.hora}</span> <CardMeta turno={turno} />
        </div>
        <span className="pill pill-warning">
          {lugares} {lugares > 1 ? 'lugares' : 'lugar'} libre · {ocupados}/{turno.cupos}
        </span>
      </div>
      <button
        className="btn btn-block"
        style={{ marginTop: 10 }}
        onClick={(e) => {
          e.stopPropagation()
          abrirWhatsApp(mensaje)
        }}
      >
        <Icon name="whatsapp" size={16} /> Avisar lugar libre
      </button>
    </div>
  )
}
