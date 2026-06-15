import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { actualizarAlumno, crearAlumno, eliminarAlumno, getAlumno } from '../data/repo'
import type { Categoria, TipoAlumno } from '../types'

const CATEGORIAS: Categoria[] = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma']

const soportaContactos =
  typeof navigator !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window

export function AlumnoFormScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('5ta')
  const [tipo, setTipo] = useState<TipoAlumno>('fijo')
  const [montoAbono, setMontoAbono] = useState('')
  const [cargando, setCargando] = useState(editando)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!id) return
    getAlumno(id).then((a) => {
      if (a) {
        setNombre(a.nombre)
        setTelefono(a.telefono)
        setCategoria(a.categoria)
        setTipo(a.tipo)
        setMontoAbono(a.montoAbono ? String(a.montoAbono) : '')
      }
      setCargando(false)
    })
  }, [id])

  if (cargando) return <div className="empty">Cargando…</div>

  const importarContacto = async () => {
    try {
      const contactos = await (navigator as any).contacts.select(['name', 'tel'], { multiple: false })
      if (contactos && contactos.length > 0) {
        const c = contactos[0]
        if (c.name?.[0]) setNombre(c.name[0])
        if (c.tel?.[0]) setTelefono(c.tel[0])
      }
    } catch {
      // cancelado o sin permiso
    }
  }

  const guardar = async () => {
    if (!nombre.trim()) return
    setGuardando(true)
    const data = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      categoria,
      tipo,
      montoAbono: Number(montoAbono) || 0,
    }
    try {
      if (id) await actualizarAlumno(id, data)
      else await crearAlumno(data)
      navigate(-1)
    } catch {
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>{editando ? 'Editar alumno' : 'Nuevo alumno'}</h1>
        </div>
      </div>

      {soportaContactos && !editando && (
        <button className="btn btn-block" style={{ marginBottom: 16 }} onClick={importarContacto}>
          <Icon name="user" size={16} /> Importar del teléfono
        </button>
      )}

      <div className="card">
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          className="input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre y apellido"
        />

        <label className="field-label" htmlFor="tel">Teléfono (WhatsApp)</label>
        <input
          id="tel"
          className="input"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="+54 9 11 ..."
        />

        <label className="field-label" htmlFor="cat">Categoría</label>
        <select id="cat" className="input" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <span className="field-label">Tipo</span>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            className={tipo === 'fijo' ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
            style={{ flex: 1 }}
            onClick={() => setTipo('fijo')}
          >
            Fijo (abono)
          </button>
          <button
            className={tipo === 'ocasional' ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
            style={{ flex: 1 }}
            onClick={() => setTipo('ocasional')}
          >
            Ocasional
          </button>
        </div>

        {tipo === 'fijo' && (
          <>
            <label className="field-label" htmlFor="abono">Cuota mensual (abono)</label>
            <input
              id="abono"
              className="input"
              type="number"
              inputMode="numeric"
              value={montoAbono}
              onChange={(e) => setMontoAbono(e.target.value)}
              placeholder="25000"
            />
          </>
        )}

        <button className="btn btn-accent btn-block" style={{ marginTop: 16 }} onClick={guardar} disabled={guardando || !nombre.trim()}>
          <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar alumno'}
        </button>

        {editando && (
          <button
            className="btn btn-block"
            style={{ marginTop: 10, color: 'var(--danger)' }}
            onClick={() => {
              if (confirm('¿Eliminar este alumno? También se borran sus inscripciones y cuotas.')) {
                eliminarAlumno(id as string).then(() => navigate(-1))
              }
            }}
          >
            <Icon name="trash" size={16} /> Eliminar alumno
          </button>
        )}
      </div>
    </>
  )
}
