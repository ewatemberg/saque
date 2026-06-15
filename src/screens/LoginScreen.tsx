import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { signInEmail, signInGoogle } from '../lib/auth'
import { APP_VERSION } from '../version'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const enviarLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setCargando(true)
    setError(null)
    try {
      await signInEmail(email)
      setEnviado(true)
    } catch (e) {
      const detalle = e instanceof Error ? e.message : String(e)
      setError(`No se pudo enviar el link: ${detalle}`)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <Logo size={52} />
        </div>
        <div className="login-brand">Saque</div>
        <p className="login-sub">Gestión de clases para profes</p>

        {enviado ? (
          <p className="login-ok">
            Te enviamos un link de acceso a <strong>{email}</strong>. Abrilo desde este dispositivo
            para entrar.
          </p>
        ) : (
          <>
            <form onSubmit={enviarLink}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-accent btn-block" type="submit" disabled={cargando}>
                {cargando ? 'Enviando…' : 'Entrar con email'}
              </button>
            </form>

            <div className="login-divider">o</div>

            <button className="btn btn-block" onClick={signInGoogle}>
              <Icon name="user" size={16} /> Entrar con Google
            </button>

            {error && <p className="login-error">{error}</p>}
          </>
        )}
        <div className="login-version">v{APP_VERSION}</div>
      </div>
    </div>
  )
}
