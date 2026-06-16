import { useNavigate } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { Logo } from '../components/Logo'

const FEATURES: { icon: IconName; titulo: string; texto: string }[] = [
  { icon: 'calendar', titulo: 'Tu día de un vistazo', texto: 'Todos tus turnos, con cupos y estado, apenas abrís la app.' },
  { icon: 'check', titulo: 'Turnos que se arman solos', texto: 'Cargás tu franja una vez (ej. martes 19hs) y generás los turnos de todo el mes.' },
  { icon: 'cash', titulo: 'Cobranzas sin vueltas', texto: 'Quién pagó y quién debe, generás las cuotas del mes y recordás por WhatsApp.' },
  { icon: 'chart', titulo: 'Tu ganancia real', texto: 'Balance neto descontando el alquiler de la cancha, con la evolución mes a mes.' },
  { icon: 'users', titulo: 'Tus alumnos ordenados', texto: 'Categoría, contacto y asistencia, todo junto y a un toque de WhatsApp.' },
  { icon: 'download', titulo: 'En el celu y la compu', texto: 'Instalala como app en el teléfono o usala desde el navegador. Gratis.' },
]

export function ConocerScreen() {
  const navigate = useNavigate()
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
          <div className="landing-feature fade-up" key={f.titulo} style={{ animationDelay: `${0.06 * (i + 1)}s` }}>
            <span className="ico">
              <Icon name={f.icon} size={24} />
            </span>
            <h3>{f.titulo}</h3>
            <p>{f.texto}</p>
          </div>
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
    </div>
  )
}
