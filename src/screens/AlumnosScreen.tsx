import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getAlumnos } from '../data/repo'
import { descargarCSV } from '../lib/csv'
import { normalizar } from '../lib/format'
import { useData } from '../lib/useData'
import { abrirWhatsApp } from '../lib/whatsapp'

export function AlumnosScreen() {
  const navigate = useNavigate()
  const alumnos = useData(getAlumnos)
  const [query, setQuery] = useState('')

  const q = normalizar(query)
  const filtrados = alumnos?.filter((a) => normalizar(a.nombre).includes(q)) ?? []

  const exportar = () => {
    if (!alumnos) return
    descargarCSV(
      'alumnos-saque.csv',
      ['Nombre', 'Categoría', 'Tipo', 'Teléfono', 'Cuota mensual'],
      alumnos.map((a) => [a.nombre, a.categoria, a.tipo, a.telefono, a.montoAbono]),
    )
  }

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Alumnos</h1>
          <div className="sub">{alumnos ? `${alumnos.length} en total` : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" aria-label="Exportar CSV" title="Exportar a CSV" onClick={exportar} disabled={!alumnos?.length}>
            <Icon name="download" size={16} />
          </button>
          <button className="btn btn-sm" onClick={() => navigate('/alumno/nuevo')}>
            <Icon name="plus" size={16} /> Nuevo
          </button>
        </div>
      </div>

      {alumnos && alumnos.length > 3 && (
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-3)' }}>
            <Icon name="search" size={18} />
          </span>
          <input
            className="input"
            style={{ paddingLeft: 38 }}
            placeholder="Buscar alumno…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {alumnos && alumnos.length === 0 && (
        <div className="empty">Todavía no cargaste alumnos. Tocá "Nuevo" para agregar el primero.</div>
      )}
      {alumnos && alumnos.length > 0 && filtrados.length === 0 && (
        <div className="empty">No hay alumnos que coincidan con "{query}".</div>
      )}

      {filtrados.map((a) => (
        <div className="row clickable" key={a.id} onClick={() => navigate(`/alumno/${a.id}`)}>
          <span className={`avatar ${a.tipo === 'ocasional' ? 'neutral' : ''}`}>{a.iniciales}</span>
          <div className="row-main">
            <div className="row-name">{a.nombre}</div>
            <div className="row-sub">
              {a.categoria} · {a.tipo}
            </div>
          </div>
          <div className="row-right">
            <button
              className="btn btn-sm"
              aria-label={`Escribir a ${a.nombre}`}
              onClick={(e) => {
                e.stopPropagation()
                abrirWhatsApp('Hola! ', a.telefono)
              }}
            >
              <Icon name="whatsapp" size={16} />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
