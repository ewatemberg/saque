import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'

interface Props {
  conteos: { canchas: number; alumnos: number; franjas: number }
}

export function Onboarding({ conteos }: Props) {
  const navigate = useNavigate()

  const pasos = [
    { label: 'Cargá tus alumnos', sub: '', to: '/alumno/nuevo', done: conteos.alumnos > 0 },
    {
      label: 'Armá una franja recurrente',
      sub: 'Elegís la cancha, el horario y los alumnos del grupo.',
      to: '/franja/nueva',
      done: conteos.franjas > 0,
    },
    { label: 'Generá los turnos del mes', sub: '', to: '/franjas', done: false },
  ]

  return (
    <div className="card" style={{ padding: '16px 16px 8px' }}>
      <div style={{ fontSize: 16, fontWeight: 500 }}>¡Bienvenido a Saque! 🎾</div>
      <p className="card-meta" style={{ marginTop: 4 }}>
        Empezá en 3 pasos para tener tu agenda lista.
      </p>

      {pasos.map((p, i) => (
        <div
          key={p.to}
          className="row clickable"
          onClick={() => navigate(p.to)}
          style={{ padding: '12px 2px' }}
        >
          <span
            className="avatar"
            style={
              p.done
                ? { background: 'var(--success-bg)', color: 'var(--success)' }
                : { background: 'var(--accent-weak)', color: 'var(--accent)' }
            }
          >
            {p.done ? <Icon name="check" size={16} /> : i + 1}
          </span>
          <div className="row-main">
            <div className="row-name" style={p.done ? { color: 'var(--text-2)' } : undefined}>
              {p.label}
            </div>
            {p.sub && <div className="row-sub">{p.sub}</div>}
          </div>
          <div className="row-right">
            <Icon name="chevron-right" size={18} />
          </div>
        </div>
      ))}

      <p className="card-meta" style={{ padding: '8px 2px 12px', lineHeight: 1.5 }}>
        ¿No encontrás tu cancha en el listado?{' '}
        <span
          style={{ color: 'var(--accent)', cursor: 'pointer' }}
          onClick={() => navigate('/canchas')}
        >
          Agregala
        </span>
        .
      </p>
    </div>
  )
}
