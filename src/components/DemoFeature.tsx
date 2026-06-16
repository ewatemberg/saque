import { Icon } from './Icon'

export type DemoKey = 'agenda' | 'franjas' | 'cobranzas' | 'balance' | 'alumnos' | 'multi'

interface Props {
  featureKey: DemoKey
  titulo: string
  texto: string
  onClose: () => void
}

function Pantalla({ k }: { k: DemoKey }) {
  if (k === 'agenda') {
    return (
      <div className="demo-screen">
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Hoy · jueves</div>
        <div className="card" style={{ marginBottom: 8 }}>
          <div className="card-top">
            <span className="card-time">18:00</span>
            <span className="pill pill-success">completo 4/4</span>
          </div>
        </div>
        <div className="card warning" style={{ marginBottom: 0 }}>
          <div className="card-top">
            <span className="card-time">19:00</span>
            <span className="pill pill-warning" style={{ animation: 'demo-pulse 1.4s ease-in-out infinite' }}>
              1 lugar libre
            </span>
          </div>
        </div>
      </div>
    )
  }
  if (k === 'franjas') {
    return (
      <div className="demo-screen">
        <div className="card" style={{ marginBottom: 8 }}>
          <div className="card-top">
            <span className="card-time">Martes 19:00</span>
            <span className="pill pill-neutral">permanente</span>
          </div>
        </div>
        <div className="btn btn-accent btn-block" style={{ marginBottom: 8 }}>
          Generar turnos del mes
        </div>
        {['mar 4', 'mar 11', 'mar 18', 'mar 25'].map((d, i) => (
          <div
            key={d}
            className="row"
            style={{ padding: '8px 2px', animation: 'demo-appear .4s ease both', animationDelay: `${0.25 + 0.15 * i}s` }}
          >
            <div className="row-main">
              <div className="row-name" style={{ fontSize: 13 }}>{d} · 19:00 · Cancha 1</div>
            </div>
            <Icon name="check" size={15} />
          </div>
        ))}
      </div>
    )
  }
  if (k === 'cobranzas') {
    return (
      <div className="demo-screen">
        <div className="metrics" style={{ marginBottom: 10 }}>
          <div className="metric"><div className="label">Esperado</div><div className="value" style={{ fontSize: 15 }}>$125.000</div></div>
          <div className="metric"><div className="label">Cobrado</div><div className="value" style={{ fontSize: 15, color: 'var(--success)' }}>$87.000</div></div>
          <div className="metric"><div className="label">Falta</div><div className="value" style={{ fontSize: 15, color: 'var(--danger)' }}>$38.000</div></div>
        </div>
        <div className="progress">
          <span style={{ width: '70%', animation: 'demo-fill 1.1s ease both' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6 }}>70% cobrado · 2 alumnos deben</div>
      </div>
    )
  }
  if (k === 'balance') {
    return (
      <div className="demo-screen">
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>Ganancia neta · últimos meses</div>
        <div className="chart" style={{ height: 120 }}>
          {[50, 62, 58, 75, 70, 92].map((h, i) => (
            <div className="chart-col" key={i}>
              <div className="chart-track">
                <div className="chart-bar" style={{ height: `${h}%`, animation: 'demo-grow .7s ease both', animationDelay: `${0.08 * i}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (k === 'alumnos') {
    return (
      <div className="demo-screen">
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <span className="btn btn-sm btn-accent">Todas</span>
          <span className="btn btn-sm">4ta</span>
          <span className="btn btn-sm">5ta</span>
        </div>
        {[['JD', 'Juan Díaz', '4ta'], ['MR', 'María Ruiz', '5ta']].map(([ini, nom, cat]) => (
          <div className="row" key={ini}>
            <span className="avatar">{ini}</span>
            <div className="row-main">
              <div className="row-name" style={{ fontSize: 14 }}>{nom}</div>
              <div className="row-sub">{cat} · fijo</div>
            </div>
            <Icon name="whatsapp" size={16} />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="demo-screen" style={{ textAlign: 'center', padding: '22px 12px' }}>
      <div style={{ color: 'var(--accent)', marginBottom: 10 }}>
        <Icon name="download" size={30} />
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
        Instalala en el celular (Agregar a inicio) o usala desde el navegador en la compu. Es la misma app.
      </div>
    </div>
  )
}

export function DemoFeature({ featureKey, titulo, texto, onClose }: Props) {
  return (
    <div className="demo-overlay" onClick={onClose}>
      <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="demo-head">
          <div>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </div>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <Pantalla k={featureKey} />
      </div>
    </div>
  )
}
