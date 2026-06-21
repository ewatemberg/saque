import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { SesionContext, esAdmin, signOut } from '../lib/auth'
import { usandoMock } from '../lib/supabase'
import { APP_VERSION } from '../version'

const OPCIONES = [
  { label: 'Mi página pública', to: '/mi-pagina' },
  { label: 'Gastos (insumos)', to: '/gastos' },
  { label: 'Cobro con MercadoPago', to: '/cobro' },
  { label: 'Franjas', to: '/franjas' },
  { label: 'Canchas', to: '/canchas' },
  { label: 'Apariencia', to: '/apariencia' },
  { label: 'Ayuda', to: '/ayuda' },
  { label: 'Acerca de', to: '/acerca' },
  { label: 'Términos y Privacidad', to: '/terminos' },
]

export function MenuScreen() {
  const navigate = useNavigate()
  const session = useContext(SesionContext)
  const opciones = usandoMock || esAdmin(session) ? [...OPCIONES, { label: 'Métricas (admin)', to: '/admin' }] : OPCIONES
  return (
    <>
      <div className="screen-header">
        <h1>Menú</h1>
      </div>

      {opciones.map((o) => (
        <div className="row clickable" key={o.to} onClick={() => navigate(o.to)}>
          <div className="row-main">
            <div className="row-name">{o.label}</div>
          </div>
          <div className="row-right">
            <Icon name="chevron-right" size={18} />
          </div>
        </div>
      ))}

      <button
        className="btn btn-block"
        style={{ marginTop: 18, color: 'var(--danger)' }}
        onClick={() => signOut()}
      >
        Cerrar sesión
      </button>

      <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 20 }}>
        Saque v{APP_VERSION}
      </p>
    </>
  )
}
