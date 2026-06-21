import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Captcha, captchaActivo } from '../components/Captcha'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { signInEmail, signInGoogle } from '../lib/auth'
import { esAppNativa } from '../lib/plataforma'
import { APP_VERSION } from '../version'

const esApp = esAppNativa()

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [acepto, setAcepto] = useState(false)
  const [intento, setIntento] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')

  const faltaAceptar = intento && !acepto

  const requiereAceptar = (): boolean => {
    if (!acepto) {
      setIntento(true)
      return true
    }
    return false
  }

  const entrarGoogle = () => {
    if (requiereAceptar()) return
    signInGoogle()
  }

  const enviarLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (requiereAceptar()) return
    if (!email) return
    if (captchaActivo && !captchaToken) {
      setError('Completá la verificación de seguridad para continuar.')
      return
    }
    setCargando(true)
    setError(null)
    try {
      await signInEmail(email, captchaToken || undefined)
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
        <p className="login-sub" style={{ marginBottom: 8 }}>Gestión de clases para profes de pádel y tenis</p>
        <Link to="/conocer" style={{ display: 'inline-block', marginBottom: 18, fontSize: 13, color: 'var(--accent)' }}>
          ¿Qué es Saque? Conocé más →
        </Link>

        {enviado ? (
          <p className="login-ok">
            Te enviamos un link de acceso a <strong>{email}</strong>. Abrilo desde este dispositivo
            para entrar.
          </p>
        ) : (
          <>
            <label className={`login-acepto${faltaAceptar ? ' alerta' : ''}`}>
              <input
                type="checkbox"
                checked={acepto}
                onChange={(e) => {
                  setAcepto(e.target.checked)
                  if (e.target.checked) setIntento(false)
                }}
              />
              <span>
                Acepto los <Link to="/terminos">Términos y Condiciones</Link> y la{' '}
                <Link to="/privacidad">Política de Privacidad</Link>.
              </span>
            </label>

            {faltaAceptar && (
              <p className="login-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 0, marginBottom: 12 }}>
                <Icon name="alert" size={15} /> Tenés que aceptar los términos para entrar.
              </p>
            )}

            {esApp && (
              <p className="login-sub" style={{ marginTop: 0, marginBottom: 12, fontSize: 12.5 }}>
                En la app entrá con <strong>Google</strong>. El acceso por email funciona desde el navegador.
              </p>
            )}

            {(() => {
              const formEmail = (
                <form onSubmit={enviarLink}>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Captcha onToken={setCaptchaToken} />
                  <button className={`btn btn-block${esApp ? '' : ' btn-accent'}`} type="submit" disabled={cargando}>
                    {cargando ? 'Enviando…' : 'Entrar con email'}
                  </button>
                </form>
              )
              const botonGoogle = (
                <button className={`btn btn-block${esApp ? ' btn-accent' : ''}`} onClick={entrarGoogle}>
                  <Icon name="user" size={16} /> Entrar con Google
                </button>
              )
              return esApp ? (
                <>
                  {botonGoogle}
                  <div className="login-divider">o</div>
                  {formEmail}
                </>
              ) : (
                <>
                  {formEmail}
                  <div className="login-divider">o</div>
                  {botonGoogle}
                </>
              )
            })()}

            {error && <p className="login-error">{error}</p>}
          </>
        )}
        <div className="login-version">v{APP_VERSION}</div>
      </div>
    </div>
  )
}
