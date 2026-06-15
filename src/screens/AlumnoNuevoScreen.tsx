import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { crearAlumno } from '../data/repo'
import type { Categoria, TipoAlumno } from '../types'

const CATEGORIAS: Categoria[] = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma']

// La API de contactos del navegador solo está disponible en móvil (Chrome
// Android) y sobre HTTPS/localhost. En desktop no aparece el botón.
const soportaContactos =
  typeof navigator !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window

export function AlumnoNuevoScreen() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('5ta')
  const [tipo, setTipo] = useState<TipoAlumno>('fijo')
  const [guardando, setGuardando] = useState(false)

  const importarContacto = async () => {
    try {
      const contactos = await (navigator as any).contacts.select(['name', 'tel'], { multiple: false })
      if (contactos && contactos.length > 0) {
        const c = contactos[0]
        if (c.name?.[0]) setNombre(c.name[0])
        if (c.tel?.[0]) setTelefono(c.tel[0])
      }
    } catch {
      // el usuario canceló o no dio permiso; no hacemos nada
    }
  }

  const guardar = async () => {
    if (!nombre.trim()) return
    setGuardando(true)
    try {
      await crearAlumno({ nombre: nombre.trim(), telefono: telefono.trim(), categoria, tipo })
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
          <h1>Nuevo alumno</h1>
        </div>
      </div>

      {soportaContactos && (
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
        <select
          id="cat"
          className="input"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria)}
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
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

        <button className="btn btn-accent btn-block" onClick={guardar} disabled={guardando || !nombre.trim()}>
          <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar alumno'}
        </button>
      </div>

      {!soportaContactos && (
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 14, textAlign: 'center' }}>
          El botón "Importar del teléfono" aparece en el celular, para traer el contacto de tu agenda.
        </p>
      )}
    </>
  )
}
