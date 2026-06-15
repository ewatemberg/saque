import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getAlumnos } from '../data/repo'
import { useData } from '../lib/useData'
import { abrirWhatsApp } from '../lib/whatsapp'

export function AlumnosScreen() {
  const navigate = useNavigate()
  const alumnos = useData(getAlumnos)

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Alumnos</h1>
          <div className="sub">{alumnos ? `${alumnos.length} en total` : ''}</div>
        </div>
        <button className="btn btn-sm" onClick={() => navigate('/alumno/nuevo')}>
          <Icon name="plus" size={16} /> Nuevo
        </button>
      </div>

      {alumnos?.map((a) => (
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
