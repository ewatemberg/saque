import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DemoFeature, type DemoKey } from '../components/DemoFeature'
import { Icon, type IconName } from '../components/Icon'
import { Logo } from '../components/Logo'

const FEATURES: { key: DemoKey; icon: IconName; titulo: string; texto: string }[] = [
  { key: 'agenda', icon: 'calendar', titulo: 'Tu día de un vistazo', texto: 'Todos tus turnos, con cupos y estado, apenas abrís la app.' },
  { key: 'franjas', icon: 'check', titulo: 'Turnos que se arman solos', texto: 'Cargás tu franja una vez (ej. martes 19hs) y generás los turnos de todo el mes.' },
  { key: 'cobranzas', icon: 'cash', titulo: 'Cobranzas sin vueltas', texto: 'Generás las cuotas del mes y marcás el pago con un solo toque. A los que deben, les recordás por WhatsApp.' },
  { key: 'balance', icon: 'chart', titulo: 'Tu ganancia real', texto: 'Balance neto descontando el alquiler de la cancha, con la evolución mes a mes.' },
  { key: 'alumnos', icon: 'users', titulo: 'Tus alumnos ordenados', texto: 'Categoría, contacto y asistencia, todo junto y a un toque de WhatsApp.' },
  { key: 'multi', icon: 'download', titulo: 'En el celu y la compu', texto: 'Instalala como app en el teléfono o usala desde el navegador. Gratis.' },
]

export function ConocerScreen() {
  const navigate = useNavigate()
  const [demo, setDemo] = useState<(typeof FEATURES)[number] | null>(null)

  return (
    <div className="landing">
      <div className="landing-hero fade-up">
        <span className="float">
          <Logo size={64} />
        </span>
        <h1>Saque</h1>
        <div className="tagline">La app para profes de pádel y tenis 🎾</div>
        <p className="pitch">
          Organizá tus clases, controlá quién pagó y mirá cuánto ganás de verdad. Sin planillas ni
          mensajes perdidos: tu agenda y tu plata, en un solo lugar.
        </p>
        <button className="btn btn-accent" style={{ marginTop: 18 }} onClick={() => navigate('/')}>
          Entrar
        </button>
      </div>

      <div className="landing-features">
        {FEATURES.map((f, i) => (
          <button
            type="button"
            className="landing-feature fade-up"
            key={f.key}
            style={{ animationDelay: `${0.06 * (i + 1)}s`, cursor: 'pointer', textAlign: 'left' }}
            onClick={() => setDemo(f)}
          >
            <span className="ico">
              <Icon name={f.icon} size={24} />
            </span>
            <h3>{f.titulo}</h3>
            <p>{f.texto}</p>
            <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12.5, color: 'var(--accent)' }}>
              Ver ejemplo →
            </span>
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <button className="btn btn-accent" onClick={() => navigate('/')}>
          Empezar ahora
        </button>
        <p className="card-meta" style={{ marginTop: 10 }}>
          Es gratis. Entrás con tu email o con Google.
        </p>
      </div>

      {demo && (
        <DemoFeature featureKey={demo.key} titulo={demo.titulo} texto={demo.texto} onClose={() => setDemo(null)} />
      )}
    </div>
  )
}
