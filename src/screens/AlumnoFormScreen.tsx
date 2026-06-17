import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icon } from '../components/Icon'
import { actualizarAlumno, crearAlumno, eliminarAlumno, getAlumno, setActivoAlumno } from '../data/repo'
import { toast } from '../lib/toast'
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
  const [confirmarBaja, setConfirmarBaja] = useState(false)
  const [activo, setActivo] = useState(true)

  useEffect(() => {
    if (!id) return
    getAlumno(id).then((a) => {
      if (a) {
        setNombre(a.nombre)
        setTelefono(a.telefono)
        setCategoria(a.categoria)
        setTipo(a.tipo)
        setMontoAbono(a.montoAbono ? String(a.montoAbono) : '')
        setActivo(a.activo)
      }
      setCargando(false)
    })
  }, [id])

  const cambiarActivo = async (nuevo: boolean) => {
    try {
      await setActivoAlumno(id as string, nuevo)
      setActivo(nuevo)
      toast(nuevo ? 'Alumno reactivado' : 'Alumno desactivado', 'success')
      navigate(-1)
    } catch {
      toast('No se pudo actualizar. Intentá de nuevo.', 'error')
    }
  }

  if (cargando) return <Cargando />

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
      toast('Alumno guardado', 'success')
      navigate(-1)
    } catch {
      setGuardando(false)
      toast('No se pudo guardar. Revisá tu conexión e intentá de nuevo.', 'error')
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

        {editando && !activo && (
          <div className="card muted" style={{ margin: '12px 0 0', padding: '10px 12px' }}>
            <span className="card-meta">Este alumno está inactivo: no aparece en las listas ni se le generan cuotas.</span>
          </div>
        )}

        <button className="btn btn-accent btn-block" style={{ marginTop: 16 }} onClick={guardar} disabled={guardando || !nombre.trim()}>
          <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar alumno'}
        </button>

        {editando && (
          <button
            className={activo ? 'btn btn-block' : 'btn btn-accent btn-block'}
            style={{ marginTop: 10 }}
            onClick={() => cambiarActivo(!activo)}
          >
            <Icon name={activo ? 'alert' : 'check'} size={16} />{' '}
            {activo ? 'Desactivar alumno' : 'Reactivar alumno'}
          </button>
        )}

        {editando && (
          <button
            className="btn btn-block"
            style={{ marginTop: 10, fontSize: 13, color: 'var(--text-3)' }}
            onClick={() => setConfirmarBaja(true)}
          >
            <Icon name="trash" size={14} /> Eliminar definitivamente
          </button>
        )}
      </div>

      {confirmarBaja && (
        <ConfirmDialog
          titulo="Eliminar alumno"
          mensaje={
            <>
              ¿Eliminar a <strong>{nombre || 'este alumno'}</strong>? También se borran sus inscripciones y
              cuotas. No se puede deshacer.
            </>
          }
          confirmLabel="Eliminar"
          peligro
          onConfirm={() => {
            eliminarAlumno(id as string)
              .then(() => {
                toast('Alumno eliminado', 'success')
                navigate(-1)
              })
              .catch(() => {
                setConfirmarBaja(false)
                toast('No se pudo eliminar. Intentá de nuevo.', 'error')
              })
          }}
          onCancel={() => setConfirmarBaja(false)}
        />
      )}
    </>
  )
}
