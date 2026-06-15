import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { useSession } from './lib/auth'
import { usandoMock } from './lib/supabase'
import { HoyScreen } from './screens/HoyScreen'
import { CobranzasScreen } from './screens/CobranzasScreen'
import { AlumnosScreen } from './screens/AlumnosScreen'
import { BalanceScreen } from './screens/BalanceScreen'
import { AboutScreen } from './screens/AboutScreen'
import { TurnoDetalleScreen } from './screens/TurnoDetalleScreen'
import { CobranzaDetalleScreen } from './screens/CobranzaDetalleScreen'
import { AlumnoNuevoScreen } from './screens/AlumnoNuevoScreen'
import { LoginScreen } from './screens/LoginScreen'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HoyScreen />} />
        <Route path="turno/:id" element={<TurnoDetalleScreen />} />
        <Route path="cobranzas" element={<CobranzasScreen />} />
        <Route path="cobranza/:id" element={<CobranzaDetalleScreen />} />
        <Route path="alumnos" element={<AlumnosScreen />} />
        <Route path="alumno/nuevo" element={<AlumnoNuevoScreen />} />
        <Route path="balance" element={<BalanceScreen />} />
        <Route path="acerca" element={<AboutScreen />} />
      </Route>
    </Routes>
  )
}

function Root() {
  const { session, loading } = useSession()

  // Modo mock (sin backend): la app es de acceso libre con datos de ejemplo.
  if (usandoMock) return <AppRoutes />

  if (loading) return <div className="login">Cargando…</div>
  if (!session) return <LoginScreen />
  return <AppRoutes />
}

export default function App() {
  return (
    <HashRouter>
      <Root />
    </HashRouter>
  )
}
