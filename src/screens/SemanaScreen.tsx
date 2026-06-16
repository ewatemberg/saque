import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { getTurnosRango } from '../data/repo'
import type { Turno } from '../types'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function iso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

function lunesDeSemana(offset: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const idx = (d.getDay() + 6) % 7 // 0 = lunes
  d.setDate(d.getDate() - idx + offset * 7)
  return d
}

export function SemanaScreen() {
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)
  const [turnos, setTurnos] = useState<Turno[] | null>(null)

  const hoy = iso(new Date())
  const lunes = lunesDeSemana(offset)
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(lunes.getDate() + i)
    return d
  })
  const desde = iso(dias[0])
  const hasta = iso(dias[6])

  useEffect(() => {
    setTurnos(null)
    getTurnosRango(desde, hasta).then(setTurnos)
  }, [desde, hasta])

  const etiqueta = `${dias[0].getDate()}/${dias[0].getMonth() + 1} – ${dias[6].getDate()}/${dias[6].getMonth() + 1}`

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" title="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Semana</h1>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
          <button className="icon-btn" aria-label="Semana anterior" title="Semana anterior" onClick={() => setOffset(offset - 1)}>
            <Icon name="chevron-left" size={18} />
          </button>
          {etiqueta}
          <button className="icon-btn" aria-label="Semana siguiente" title="Semana siguiente" onClick={() => setOffset(offset + 1)}>
            <Icon name="chevron-right" size={18} />
          </button>
        </span>
      </div>

      {!turnos && <Cargando />}

      {turnos &&
        dias.map((d) => {
          const fecha = iso(d)
          const delDia = turnos.filter((t) => t.fecha === fecha)
          const esHoy = fecha === hoy
          return (
            <div key={fecha}>
              <div className={`dia-header${esHoy ? ' hoy' : ''}`}>
                <span>
                  {DIAS[(d.getDay() + 6) % 7]} {d.getDate()}/{d.getMonth() + 1}
                  {esHoy ? ' · hoy' : ''}
                </span>
                {delDia.length > 0 && (
                  <span className="dia-count">
                    {delDia.length} {delDia.length === 1 ? 'turno' : 'turnos'}
                  </span>
                )}
              </div>

              {delDia.length === 0 && <div className="dia-vacio">Sin turnos</div>}

              {delDia.map((t) => {
                const ocupados = t.inscriptos.length
                const completo = ocupados >= t.cupos
                const suspendido = t.estado !== 'activo'
                return (
                  <div
                    className="card clickable"
                    key={t.id}
                    onClick={() => navigate(`/turno/${t.id}`)}
                    style={{ marginTop: 8, marginBottom: 0 }}
                  >
                    <div className="card-top">
                      <div>
                        <span
                          className="card-time"
                          style={suspendido ? { textDecoration: 'line-through', color: 'var(--text-2)' } : undefined}
                        >
                          {t.hora}
                        </span>{' '}
                        <span className="card-meta">· {t.canchaNombre} · {t.categoria}</span>
                      </div>
                      <span className={`pill ${suspendido ? 'pill-neutral' : completo ? 'pill-success' : 'pill-warning'}`}>
                        {suspendido ? 'suspendido' : `${ocupados}/${t.cupos}`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
    </>
  )
}
