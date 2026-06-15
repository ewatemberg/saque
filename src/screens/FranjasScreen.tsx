import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { generarTurnosDelMes, getFranjas, proximoMes } from '../data/repo'
import { formatPesos } from '../lib/format'
import { toast } from '../lib/toast'
import type { Franja } from '../types'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function FranjasScreen() {
  const navigate = useNavigate()
  const [franjas, setFranjas] = useState<Franja[] | null>(null)
  const prox = proximoMes()

  const reload = useCallback(() => {
    getFranjas().then(setFranjas)
  }, [])
  useEffect(() => {
    reload()
  }, [reload])

  const generar = async () => {
    if (!window.confirm(`Se van a generar los turnos de ${prox.etiqueta} a partir de tus franjas. ¿Continuar?`)) {
      return
    }
    try {
      let r = await generarTurnosDelMes(false)
      if (r.conflictos > 0) {
        const ow = window.confirm(
          `${r.conflictos} turno(s) ya existían en esas fechas y se saltearon. ¿Querés sobrescribirlos también?`,
        )
        if (ow) r = await generarTurnosDelMes(true)
      }
      toast(
        r.creados > 0 ? `Listo: ${r.creados} turno(s) de ${prox.etiqueta}.` : 'No se generaron turnos nuevos.',
        r.creados > 0 ? 'success' : 'info',
      )
    } catch {
      toast('No se pudieron generar los turnos. Intentá de nuevo.', 'error')
    }
  }

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Franjas</h1>
          <div className="sub">Turnos recurrentes</div>
        </div>
        <button className="btn btn-sm" onClick={() => navigate('/franja/nueva')}>
          <Icon name="plus" size={16} /> Nueva
        </button>
      </div>

      {franjas && franjas.length > 0 && (
        <button className="btn btn-accent btn-block" style={{ marginBottom: 14 }} onClick={generar}>
          <Icon name="calendar" size={16} /> Generar turnos de {prox.etiqueta}
        </button>
      )}

      {franjas?.length === 0 && (
        <div className="empty">Todavía no tenés franjas. Creá una y después generás los turnos del mes.</div>
      )}

      {franjas?.map((f) => (
        <div className="card clickable" key={f.id} onClick={() => navigate(`/franja/${f.id}`)}>
          <div className="card-top">
            <div>
              <span className="card-time">
                {DIAS[f.diaSemana]} {f.hora}
              </span>{' '}
              <span className="card-meta">· {f.canchaNombre} · {f.categoria}</span>
            </div>
            {f.permanente && <span className="pill pill-neutral">permanente</span>}
          </div>
          <div className="card-meta" style={{ marginTop: 6 }}>
            {f.alumnoIds.length}/{f.cupos} alumnos fijos · {formatPesos(f.precio)} x alumno
          </div>
        </div>
      ))}
    </>
  )
}
