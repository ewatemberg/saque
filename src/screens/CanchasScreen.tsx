import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getCanchas } from '../data/repo'
import { useDeporte } from '../lib/auth'
import { formatPesos, normalizar } from '../lib/format'
import { useData } from '../lib/useData'

export function CanchasScreen() {
  const navigate = useNavigate()
  const deporte = useDeporte()
  const canchas = useData(() => getCanchas(deporte))
  const [query, setQuery] = useState('')

  const q = normalizar(query)
  const filtradas = canchas?.filter((c) => normalizar(c.nombre + ' ' + c.direccion).includes(q)) ?? []

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

      {canchas && canchas.length > 5 && (
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-3)' }}>
            <Icon name="search" size={18} />
          </span>
          <input
            className="input"
            style={{ paddingLeft: 38 }}
            placeholder="Buscar cancha…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {canchas?.length === 0 && <div className="empty">Todavía no hay canchas. Agregá la primera.</div>}
      {canchas && canchas.length > 0 && filtradas.length === 0 && (
        <div className="empty">No hay canchas que coincidan con "{query}".</div>
      )}

      {filtradas.map((c) => (
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
