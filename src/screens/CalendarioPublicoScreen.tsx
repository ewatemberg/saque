import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { getPerfilPublico, getTurnosPublicos } from '../data/repo'
import { abrirWhatsApp } from '../lib/whatsapp'
import type { PerfilPublico, TurnoPublico } from '../types'

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

export function CalendarioPublicoScreen() {
  const { profeId = '' } = useParams()
  const [offset, setOffset] = useState(0)
  const [perfil, setPerfil] = useState<PerfilPublico | null | undefined>(undefined)
  const [turnos, setTurnos] = useState<TurnoPublico[] | null>(null)

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
    getPerfilPublico(profeId)
      .then(setPerfil)
      .catch(() => setPerfil(null))
  }, [profeId])

  useEffect(() => {
    setTurnos(null)
    getTurnosPublicos(profeId, desde, hasta)
      .then(setTurnos)
      .catch(() => setTurnos([]))
  }, [profeId, desde, hasta])

  const etiqueta = `${dias[0].getDate()}/${dias[0].getMonth() + 1} – ${dias[6].getDate()}/${dias[6].getMonth() + 1}`

  if (perfil === undefined) {
    return (
      <div className="landing">
        <Cargando />
      </div>
    )
  }

  const titulo = perfil?.nombre?.trim() || 'Turnos disponibles'

  return (
    <div className="landing">
      <div className="landing-hero" style={{ paddingBottom: 12 }}>
        <span>
          <Logo size={48} />
        </span>
        <h1 style={{ fontSize: 26 }}>{titulo}</h1>
        <div className="tagline">
          Turnos disponibles {perfil?.deporte ? `de ${perfil.deporte === 'padel' ? 'pádel' : 'tenis'}` : ''} 🎾
        </div>
      </div>

      <div className="screen-header" style={{ marginTop: 8 }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>Semana</h2>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
          <button className="icon-btn" aria-label="Semana anterior" onClick={() => setOffset(offset - 1)}>
            <Icon name="chevron-left" size={18} />
          </button>
          {etiqueta}
          <button className="icon-btn" aria-label="Semana siguiente" onClick={() => setOffset(offset + 1)}>
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
              </div>

              {delDia.length === 0 && <div className="dia-vacio">Sin turnos</div>}

              {delDia.map((t, i) => {
                const lugares = t.cupos - t.ocupados
                const completo = lugares <= 0
                const diaTexto = `${DIAS[(d.getDay() + 6) % 7].toLowerCase()} ${d.getDate()}/${d.getMonth() + 1}`
                const mensaje = `Hola${perfil?.nombre ? ' ' + perfil.nombre.split(' ')[0] : ''}! Vi en tu calendario que tenés lugar el ${diaTexto} a las ${t.hora} (${t.categoria}, ${t.canchaNombre}). ¿Me sumo?`
                return (
                  <div
                    className={`card${completo ? ' muted' : ''}`}
                    key={`${fecha}-${t.hora}-${i}`}
                    style={{ marginTop: 8, marginBottom: 0 }}
                  >
                    <div className="card-top">
                      <div>
                        <span className="card-time" style={completo ? { color: 'var(--text-2)' } : undefined}>
                          {t.hora}
                        </span>{' '}
                        <span className="card-meta">· {t.canchaNombre} · {t.categoria}</span>
                      </div>
                      <span className={`pill ${completo ? 'pill-neutral' : 'pill-warning'}`}>
                        {completo ? 'completo' : `${lugares} ${lugares === 1 ? 'lugar' : 'lugares'}`}
                      </span>
                    </div>
                    {!completo && perfil?.whatsapp && (
                      <button
                        className="btn btn-block"
                        style={{ marginTop: 10 }}
                        onClick={() => abrirWhatsApp(mensaje, perfil.whatsapp)}
                      >
                        <Icon name="whatsapp" size={16} /> Reservar por WhatsApp
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}

      <p className="card-meta" style={{ textAlign: 'center', marginTop: 24 }}>
        Calendario gestionado con Saque
      </p>
    </div>
  )
}
