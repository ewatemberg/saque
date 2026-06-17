import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icon } from '../components/Icon'
import { eliminarProfe, getMetricasAdmin } from '../data/repo'
import { SesionContext, esAdmin } from '../lib/auth'
import { usandoMock } from '../lib/supabase'
import { toast } from '../lib/toast'
import type { MetricasAdmin, ProfeMetrica } from '../types'

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function etiquetaMes(periodo: string): string {
  const m = Number(periodo.split('-')[1])
  return MESES_CORTOS[m - 1] ?? periodo
}

export function AdminScreen() {
  const navigate = useNavigate()
  const session = useContext(SesionContext)
  const permitido = usandoMock || esAdmin(session)
  const [m, setM] = useState<MetricasAdmin | null>(null)
  const [aBorrar, setABorrar] = useState<ProfeMetrica | null>(null)

  const reload = useCallback(() => {
    if (permitido) getMetricasAdmin().then(setM)
  }, [permitido])
  useEffect(() => {
    reload()
  }, [reload])

  const confirmarBorrado = async () => {
    if (!aBorrar) return
    try {
      await eliminarProfe(aBorrar.id)
      toast('Profe eliminado', 'success')
      setABorrar(null)
      reload()
    } catch {
      setABorrar(null)
      toast('No se pudo eliminar. Intentá de nuevo.', 'error')
    }
  }

  const header = (
    <div className="screen-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
          <Icon name="chevron-left" size={22} />
        </button>
        <h1>Métricas</h1>
      </div>
    </div>
  )

  if (!permitido) {
    return (
      <>
        {header}
        <div className="empty">Esta sección es solo para el administrador de Saque.</div>
      </>
    )
  }

  if (!m) {
    return (
      <>
        {header}
        <Cargando />
      </>
    )
  }

  const maxAltas = Math.max(1, ...m.altasPorMes.map((a) => a.profes))

  return (
    <>
      {header}

      <div className="metrics">
        <Metric label="Profes" value={m.profes} destacado />
        <Metric label="Alumnos" value={m.alumnos} />
        <Metric label="Turnos" value={m.turnos} />
      </div>
      <div className="metrics" style={{ marginTop: 4 }}>
        <Metric label="Franjas" value={m.franjas} />
        <Metric label="Canchas" value={m.canchas} />
        <Metric label="Prom. alumnos/profe" value={m.profes > 0 ? Math.round(m.alumnos / m.profes) : 0} />
      </div>

      <div className="section-title">Profes por deporte</div>
      <div className="metrics">
        <Metric label="Pádel" value={m.porDeporte.padel} />
        <Metric label="Tenis" value={m.porDeporte.tenis} />
        <Metric label="Sin elegir" value={Math.max(0, m.profes - m.porDeporte.padel - m.porDeporte.tenis)} />
      </div>

      {m.altasPorMes.length > 0 && (
        <>
          <div className="section-title">Altas de profes por mes</div>
          <div className="chart">
            {m.altasPorMes.map((a) => (
              <div className="chart-col" key={a.periodo}>
                <div className="chart-val">{a.profes}</div>
                <div className="chart-track">
                  <div className="chart-bar" style={{ height: `${Math.round((a.profes / maxAltas) * 100)}%` }} />
                </div>
                <div className="chart-label">{etiquetaMes(a.periodo)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-title">Por profe ({m.porProfe.length})</div>
      {m.porProfe.map((p) => {
        const inactivo = p.alumnos === 0 && p.turnos === 0 && p.franjas === 0
        return (
          <div className="row" key={p.id}>
            <div className="row-main">
              <div className="row-name">
                {p.nombre}
                {p.deporte && <span className="card-meta"> · {p.deporte === 'tenis' ? 'tenis' : 'pádel'}</span>}
                {inactivo && <span className="pill pill-neutral" style={{ marginLeft: 6, fontSize: 10 }}>sin actividad</span>}
              </div>
              <div className="row-sub">{p.email}</div>
              <div className="row-sub" style={{ fontSize: 11 }}>
                alta {p.creado ?? '—'} · último acceso {p.ultimo_acceso ?? '—'}
              </div>
            </div>
            <div className="row-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-2)', textAlign: 'right', lineHeight: 1.35 }}>
                <strong style={{ color: 'var(--text)' }}>{p.alumnos}</strong> al. · {p.turnos} t. · {p.franjas} fr.
              </span>
              <button
                className="btn btn-sm"
                aria-label={`Eliminar a ${p.nombre}`}
                title="Eliminar profe"
                style={{ color: 'var(--danger)' }}
                onClick={() => setABorrar(p)}
              >
                <Icon name="trash" size={15} />
              </button>
            </div>
          </div>
        )
      })}

      {aBorrar && (
        <ConfirmDialog
          titulo="Eliminar profe"
          mensaje={
            <>
              ¿Eliminar a <strong>{aBorrar.nombre}</strong> ({aBorrar.email})? Se borran todos sus datos
              (alumnos, turnos, cobranzas). No se puede deshacer.
            </>
          }
          confirmLabel="Eliminar"
          peligro
          onConfirm={confirmarBorrado}
          onCancel={() => setABorrar(null)}
        />
      )}
    </>
  )
}

function Metric({ label, value, destacado }: { label: string; value: number; destacado?: boolean }) {
  return (
    <div className="metric">
      <div className="label">{label}</div>
      <div className="value" style={destacado ? { color: 'var(--accent)' } : undefined}>{value}</div>
    </div>
  )
}
