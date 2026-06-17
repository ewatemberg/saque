import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icon } from '../components/Icon'
import { generarTurnosDelMes, getFranjas, proximoMes } from '../data/repo'
import { formatPesos } from '../lib/format'
import { toast } from '../lib/toast'
import type { Franja } from '../types'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function FranjasScreen() {
  const navigate = useNavigate()
  const [franjas, setFranjas] = useState<Franja[] | null>(null)
  const [confirmarGenerar, setConfirmarGenerar] = useState(false)
  const [conflicto, setConflicto] = useState<{ creados: number; conflictos: number } | null>(null)
  const prox = proximoMes()

  const reload = useCallback(() => {
    getFranjas().then(setFranjas)
  }, [])
  useEffect(() => {
    reload()
  }, [reload])

  const toastResultado = (creados: number) => {
    toast(
      creados > 0 ? `Listo: ${creados} turno(s) de ${prox.etiqueta}.` : 'No se generaron turnos nuevos.',
      creados > 0 ? 'success' : 'info',
    )
  }

  const ejecutar = async (sobrescribir: boolean) => {
    try {
      const r = await generarTurnosDelMes(sobrescribir)
      if (!sobrescribir && r.conflictos > 0) {
        setConflicto(r)
        return
      }
      toastResultado(r.creados)
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
        <button className="btn btn-accent btn-block" style={{ marginBottom: 14 }} onClick={() => setConfirmarGenerar(true)}>
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

      {confirmarGenerar && (
        <ConfirmDialog
          titulo={`Generar turnos de ${prox.etiqueta}`}
          mensaje={`Se van a generar los turnos de ${prox.etiqueta} a partir de tus franjas, con sus alumnos fijos. ¿Continuar?`}
          confirmLabel="Generar"
          onConfirm={() => {
            setConfirmarGenerar(false)
            ejecutar(false)
          }}
          onCancel={() => setConfirmarGenerar(false)}
        />
      )}

      {conflicto && (
        <ConfirmDialog
          titulo="Ya había turnos"
          mensaje={`${conflicto.conflictos} turno(s) ya existían en esas fechas y se saltearon. ¿Querés sobrescribirlos también?`}
          confirmLabel="Sobrescribir"
          peligro
          onConfirm={() => {
            setConflicto(null)
            ejecutar(true)
          }}
          onCancel={() => {
            const creados = conflicto.creados
            setConflicto(null)
            toastResultado(creados)
          }}
        />
      )}
    </>
  )
}
