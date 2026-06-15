import { useState } from 'react'
import { Logo } from '../components/Logo'
import { setDeporte } from '../lib/auth'
import type { Deporte } from '../types'

export function DeporteScreen() {
  const [guardando, setGuardando] = useState<Deporte | null>(null)

  const elegir = async (deporte: Deporte) => {
    setGuardando(deporte)
    try {
      await setDeporte(deporte)
      // La sesión se actualiza sola (evento USER_UPDATED) y la app continúa.
    } catch {
      setGuardando(null)
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <Logo size={52} />
        </div>
        <div className="login-brand">¿Qué enseñás?</div>
        <p className="login-sub">Vas a ver solo las canchas de tu deporte.</p>

        <button
          className="btn btn-accent btn-block"
          style={{ marginBottom: 10 }}
          disabled={guardando !== null}
          onClick={() => elegir('padel')}
        >
          {guardando === 'padel' ? 'Guardando…' : 'Pádel'}
        </button>
        <button
          className="btn btn-block"
          disabled={guardando !== null}
          onClick={() => elegir('tenis')}
        >
          {guardando === 'tenis' ? 'Guardando…' : 'Tenis'}
        </button>
      </div>
    </div>
  )
}
