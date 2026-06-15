import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getCanchas } from '../data/repo'
import { deporteDeSesion, useSession } from '../lib/auth'
import { formatPesos } from '../lib/format'
import { useData } from '../lib/useData'

export function CanchasScreen() {
  const navigate = useNavigate()
  const { session } = useSession()
  const deporte = deporteDeSesion(session) ?? undefined
  const canchas = useData(() => getCanchas(deporte))

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Canchas</h1>
          <div className="sub">
            Compartidas entre profes{deporte ? ` de ${deporte === 'tenis' ? 'tenis' : 'pádel'}` : ''}
          </div>
        </div>
        <button className="btn btn-sm" onClick={() => navigate('/cancha/nueva')}>
          <Icon name="plus" size={16} /> Nueva
        </button>
      </div>

      {canchas?.length === 0 && <div className="empty">Todavía no hay canchas. Agregá la primera.</div>}

      {canchas?.map((c) => (
        <div className="card clickable" key={c.id} onClick={() => navigate(`/cancha/${c.id}`)}>
          <div className="card-top">
            <span className="card-time" style={{ fontSize: 15 }}>{c.nombre}</span>
            <span className="card-meta">{formatPesos(c.costoPorHora)}/h</span>
          </div>
          {c.direccion && <div className="card-meta" style={{ marginTop: 4 }}>{c.direccion}</div>}
        </div>
      ))}
    </>
  )
}
