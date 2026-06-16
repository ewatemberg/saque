import { Logo } from '../components/Logo'
import { APP_VERSION, BUILD_DATE } from '../version'

export function AboutScreen() {
  return (
    <>
      <div className="screen-header">
        <h1>Acerca de</h1>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <Logo size={56} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 500 }}>Saque</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>
          Gestión de clases para profes de pádel y tenis
        </div>
      </div>

      <div className="card" style={{ padding: '4px 14px' }}>
        <Dato label="Versión" valor={`v${APP_VERSION}`} />
        <Dato label="Actualizado" valor={BUILD_DATE} />
        <Dato label="Contacto" valor="emilio.watemberg@gmail.com" ultimo />
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 16 }}>
        Saque v{APP_VERSION} · {BUILD_DATE}
      </p>
    </>
  )
}

function Dato({ label, valor, ultimo }: { label: string; valor: string; ultimo?: boolean }) {
  return (
    <div
      className="row"
      style={ultimo ? { borderBottom: 'none' } : undefined}
    >
      <div className="row-main">
        <div className="row-sub">{label}</div>
        <div className="row-name" style={{ fontWeight: 400 }}>
          {valor}
        </div>
      </div>
    </div>
  )
}
