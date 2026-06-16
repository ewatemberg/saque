import { NavLink, Outlet } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'
import { APP_VERSION } from '../version'

interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

const items: NavItem[] = [
  { to: '/', label: 'Hoy', icon: 'calendar', end: true },
  { to: '/cobranzas', label: 'Cobranzas', icon: 'cash' },
  { to: '/alumnos', label: 'Alumnos', icon: 'users' },
  { to: '/balance', label: 'Balance', icon: 'chart' },
]

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'active' : undefined
}

export function AppLayout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <Logo size={26} />
          Saque
        </div>
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.end} className={navClass}>
            <Icon name={it.icon} size={20} />
            {it.label}
          </NavLink>
        ))}
      </aside>

      <main className="content">
        <Outlet />
        <footer className="app-footer">
          <span style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <NavLink to="/franjas">Franjas</NavLink>
            <NavLink to="/canchas">Canchas</NavLink>
            <NavLink to="/apariencia">Apariencia</NavLink>
            <NavLink to="/ayuda">Ayuda</NavLink>
            <NavLink to="/acerca">Acerca de</NavLink>
            <NavLink to="/terminos">Términos</NavLink>
          </span>
          <span>v{APP_VERSION}</span>
        </footer>
      </main>

      <nav className="bottomnav">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.end} className={navClass}>
            <Icon name={it.icon} size={20} />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
