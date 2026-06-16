import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ToastHost } from './components/ToastHost'
import { Cargando } from './components/Cargando'
import { deporteDeSesion, useSession } from './lib/auth'
import { usandoMock } from './lib/supabase'
import { HoyScreen } from './screens/HoyScreen'
import { SemanaScreen } from './screens/SemanaScreen'
import { TurnoDetalleScreen } from './screens/TurnoDetalleScreen'
import { TurnoFormScreen } from './screens/TurnoFormScreen'
import { CobranzasScreen } from './screens/CobranzasScreen'
import { CobranzaDetalleScreen } from './screens/CobranzaDetalleScreen'
import { AlumnosScreen } from './screens/AlumnosScreen'
import { AlumnoFormScreen } from './screens/AlumnoFormScreen'
import { CanchasScreen } from './screens/CanchasScreen'
import { CanchaFormScreen } from './screens/CanchaFormScreen'
import { FranjasScreen } from './screens/FranjasScreen'
import { FranjaFormScreen } from './screens/FranjaFormScreen'
import { BalanceScreen } from './screens/BalanceScreen'
import { AboutScreen } from './screens/AboutScreen'
import { MenuScreen } from './screens/MenuScreen'
import { AparienciaScreen } from './screens/AparienciaScreen'
import { AyudaScreen } from './screens/AyudaScreen'
import { TerminosScreen } from './screens/TerminosScreen'
import { PrivacidadScreen } from './screens/PrivacidadScreen'
import { LoginScreen } from './screens/LoginScreen'
import { DeporteScreen } from './screens/DeporteScreen'

// Guard: decide si mostrar login / selección de deporte / la app.
// Renderiza AppLayout (con su <Outlet/>) cuando el acceso está habilitado.
function RequireAuth() {
  const { session, loading } = useSession()
  if (usandoMock) return <AppLayout />
  if (loading) return <div className="login"><Cargando /></div>
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
          <Route path="semana" element={<SemanaScreen />} />
          <Route path="turno/nuevo" element={<TurnoFormScreen />} />
          <Route path="turno/:id" element={<TurnoDetalleScreen />} />
          <Route path="turno/:id/editar" element={<TurnoFormScreen />} />
          <Route path="cobranzas" element={<CobranzasScreen />} />
          <Route path="cobranza/:id" element={<CobranzaDetalleScreen />} />
          <Route path="alumnos" element={<AlumnosScreen />} />
          <Route path="alumno/nuevo" element={<AlumnoFormScreen />} />
          <Route path="alumno/:id" element={<AlumnoFormScreen />} />
          <Route path="canchas" element={<CanchasScreen />} />
          <Route path="cancha/nueva" element={<CanchaFormScreen />} />
          <Route path="cancha/:id" element={<CanchaFormScreen />} />
          <Route path="franjas" element={<FranjasScreen />} />
          <Route path="franja/nueva" element={<FranjaFormScreen />} />
          <Route path="franja/:id" element={<FranjaFormScreen />} />
          <Route path="balance" element={<BalanceScreen />} />
          <Route path="menu" element={<MenuScreen />} />
          <Route path="apariencia" element={<AparienciaScreen />} />
          <Route path="ayuda" element={<AyudaScreen />} />
          <Route path="acerca" element={<AboutScreen />} />
        </Route>
      </Routes>
      <ToastHost />
    </HashRouter>
  )
}
