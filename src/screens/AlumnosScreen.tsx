import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getAlumnos } from '../data/repo'
import { descargarCSV } from '../lib/csv'
import { normalizar } from '../lib/format'
import { useData } from '../lib/useData'
import { abrirWhatsApp } from '../lib/whatsapp'
import type { Categoria } from '../types'

const CATEGORIAS: Categoria[] = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma']

export function AlumnosScreen() {
  const navigate = useNavigate()
  const alumnos = useData(getAlumnos)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<Categoria | 'todas'>('todas')
  const [verInactivos, setVerInactivos] = useState(false)

  const q = normalizar(query)
  const activosCount = alumnos?.filter((a) => a.activo).length ?? 0
  const inactivosCount = alumnos?.filter((a) => !a.activo).length ?? 0
  const filtrados =
    alumnos?.filter(
      (a) =>
        a.activo !== verInactivos &&
        normalizar(a.nombre).includes(q) &&
        (cat === 'todas' || a.categoria === cat),
    ) ?? []

  const exportar = () => {
    if (!alumnos) return
    descargarCSV(
      'alumnos-saque.csv',
      ['Nombre', 'Categoría', 'Tipo', 'Teléfono', 'Cuota mensual'],
      alumnos.map((a) => [a.nombre, a.categoria, a.tipo, a.telefono, a.montoAbono]),
    )
  }

  const hayMuchos = (alumnos?.length ?? 0) > 3

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Alumnos</h1>
          <div className="sub">
            {alumnos ? `${activosCount} activos${inactivosCount ? ` · ${inactivosCount} inactivos` : ''}` : ''}
          </div>
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

      {hayMuchos && (
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

      {inactivosCount > 0 && (
        <button
          className={verInactivos ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
          style={{ marginBottom: 12 }}
          onClick={() => setVerInactivos((v) => !v)}
        >
          {verInactivos ? '← Ver activos' : `Ver inactivos (${inactivosCount})`}
        </button>
      )}

      {hayMuchos && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            className={cat === 'todas' ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
            onClick={() => setCat('todas')}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              className={cat === c ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {alumnos && alumnos.length === 0 && (
        <div className="empty">Todavía no cargaste alumnos. Tocá "Nuevo" para agregar el primero.</div>
      )}
      {alumnos && alumnos.length > 0 && filtrados.length === 0 && (
        <div className="empty">No hay alumnos para ese filtro.</div>
      )}

      {filtrados.map((a) => (
        <div className="row clickable" key={a.id} onClick={() => navigate(`/alumno/${a.id}`)}>
          <span className={`avatar ${a.activo ? (a.tipo === 'ocasional' ? 'neutral' : '') : 'neutral'}`}>
            {a.iniciales}
          </span>
          <div className="row-main">
            <div className="row-name" style={a.activo ? undefined : { color: 'var(--text-2)' }}>{a.nombre}</div>
            <div className="row-sub">
              {a.categoria} · {a.tipo}
              {!a.activo && ' · inactivo'}
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
