import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { deporteDeSesion, useSession } from './lib/auth'
import { usandoMock } from './lib/supabase'
import { HoyScreen } from './screens/HoyScreen'
import { TurnoDetalleScreen } from './screens/TurnoDetalleScreen'
import { TurnoFormScreen } from './screens/TurnoFormScreen'
import { CobranzasScreen } from './screens/CobranzasScreen'
import { CobranzaDetalleScreen } from './screens/CobranzaDetalleScreen'
import { AlumnosScreen } from './screens/AlumnosScreen'
import { AlumnoNuevoScreen } from './screens/AlumnoNuevoScreen'
import { CanchasScreen } from './screens/CanchasScreen'
import { CanchaFormScreen } from './screens/CanchaFormScreen'
import { BalanceScreen } from './screens/BalanceScreen'
import { AboutScreen } from './screens/AboutScreen'
import { TerminosScreen } from './screens/TerminosScreen'
import { PrivacidadScreen } from './screens/PrivacidadScreen'
import { LoginScreen } from './screens/LoginScreen'
import { DeporteScreen } from './screens/DeporteScreen'

// Guard: decide si mostrar login / selección de deporte / la app.
// Renderiza AppLayout (con su <Outlet/>) cuando el acceso está habilitado.
function RequireAuth() {
  const { session, loading } = useSession()
  if (usandoMock) return <AppLayout />
  if (loading) return <div className="login">Cargando…</div>
  if (!session) return <LoginScreen />
  if (!deporteDeSesion(session)) return <DeporteScreen />
  return <AppLayout />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Públicas (accesibles sin login) */}
        <Route path="/terminos" element={<TerminosScreen />} />
        <Route path="/privacidad" element={<PrivacidadScreen />} />

        {/* App (requiere login) */}
        <Route element={<RequireAuth />}>
          <Route index element={<HoyScreen />} />
          <Route path="turno/nuevo" element={<TurnoFormScreen />} />
          <Route path="turno/:id" element={<TurnoDetalleScreen />} />
          <Route path="turno/:id/editar" element={<TurnoFormScreen />} />
          <Route path="cobranzas" element={<CobranzasScreen />} />
          <Route path="cobranza/:id" element={<CobranzaDetalleScreen />} />
          <Route path="alumnos" element={<AlumnosScreen />} />
          <Route path="alumno/nuevo" element={<AlumnoNuevoScreen />} />
          <Route path="canchas" element={<CanchasScreen />} />
          <Route path="cancha/nueva" element={<CanchaFormScreen />} />
          <Route path="cancha/:id" element={<CanchaFormScreen />} />
          <Route path="balance" element={<BalanceScreen />} />
          <Route path="acerca" element={<AboutScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
