import { useNavigate } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'

interface Paso {
  icon: IconName
  titulo: string
  cuerpo: React.ReactNode
  accion?: { label: string; to: string }
}

const PASOS: Paso[] = [
  {
    icon: 'calendar',
    titulo: 'Preparás tu agenda',
    cuerpo: (
      <>
        Elegí tu cancha del listado (ya están casi todas; si falta la tuya, la agregás), cargá tus
        alumnos y armá tus <strong>franjas</strong> (tus horarios fijos, ej. "martes 19hs"). Después,
        desde Franjas, <strong>generás todos los turnos del mes</strong> con un botón.
      </>
    ),
    accion: { label: 'Ir a Franjas', to: '/franjas' },
  },
  {
    icon: 'check',
    titulo: 'Tu día a día',
    cuerpo: (
      <>
        La pantalla <strong>Hoy</strong> muestra tus turnos. El color avisa el estado: verde = completo,
        amarillo = hay lugar libre, rojo = no cubre el costo de cancha. Tocá un turno para{' '}
        <strong>marcar asistencia</strong>, anotar a alguien en un lugar libre o avisar por WhatsApp.
      </>
    ),
    accion: { label: 'Ir a Hoy', to: '/' },
  },
  {
    icon: 'rain',
    titulo: 'Si se suspende una clase',
    cuerpo: (
      <>
        En el turno tocá <strong>Suspender</strong>. Después podés <strong>Coordinar recupero</strong>:
        elegís nueva fecha y hora, y le avisás a los alumnos por WhatsApp con un toque.
      </>
    ),
  },
  {
    icon: 'cash',
    titulo: 'Cobrás las cuotas',
    cuerpo: (
      <>
        A principio de mes tocá <strong>"Generar cuotas del mes"</strong> (crea la cuota de cada alumno
        fijo). Cuando alguien te paga, tocá el botón <strong>Cobrar</strong> 💵 de ese alumno y elegí el
        método — queda registrado al toque, sin entrar a ningún lado. Al que debe, le mandás el
        recordatorio con el botón de <strong>WhatsApp</strong> (si cargaste tu link de MercadoPago, va
        incluido para que pague de una).
      </>
    ),
    accion: { label: 'Ir a Cobranzas', to: '/cobranzas' },
  },
  {
    icon: 'chart',
    titulo: 'Mirás tu ganancia real',
    cuerpo: (
      <>
        En <strong>Balance</strong> ves tu <strong>ganancia neta</strong> (lo cobrado menos el alquiler
        de canchas), el dinero real por hora, cuánto te falta cobrar y cómo venís mes a mes.
      </>
    ),
    accion: { label: 'Ir a Balance', to: '/balance' },
  },
  {
    icon: 'users',
    titulo: 'Compartís tus turnos libres',
    cuerpo: (
      <>
        En <strong>Mi página pública</strong> cargás tu nombre y WhatsApp, y obtenés un{' '}
        <strong>link abierto</strong> para compartir. Cualquiera ve tus horarios con lugar y te escribe
        para reservar. No se muestran datos de tus alumnos ni precios.
      </>
    ),
    accion: { label: 'Configurar mi página', to: '/mi-pagina' },
  },
  {
    icon: 'download',
    titulo: 'Ajustes',
    cuerpo: (
      <>
        En <strong>Cobro con MercadoPago</strong> pegás tu link de pago. En <strong>Apariencia</strong>{' '}
        elegís modo claro/oscuro y el color de la app. Y podés <strong>instalarla</strong> en el celular
        desde el navegador ("Agregar a inicio").
      </>
    ),
    accion: { label: 'Configurar cobro', to: '/cobro' },
  },
]

export function AyudaScreen() {
  const navigate = useNavigate()

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Cómo usar Saque</h1>
        </div>
      </div>

      <p className="card-meta" style={{ marginBottom: 16, lineHeight: 1.5 }}>
        Un recorrido por la app, del mismo orden en que la vas a usar. Tocá cada paso para ir directo.
      </p>

      {PASOS.map((p, i) => (
        <div className="card" key={p.titulo} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span
            className="avatar"
            style={{ background: 'var(--accent-weak)', color: 'var(--accent)', flexShrink: 0 }}
          >
            {i + 1}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <span style={{ color: 'var(--accent)', display: 'inline-flex' }}>
                <Icon name={p.icon} size={18} />
              </span>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{p.titulo}</h3>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55 }}>{p.cuerpo}</p>
            {p.accion && (
              <button
                className="btn btn-sm"
                style={{ marginTop: 10 }}
                onClick={() => navigate(p.accion!.to)}
              >
                {p.accion.label} <Icon name="chevron-right" size={15} />
              </button>
            )}
          </div>
        </div>
      ))}

      <p className="card-meta" style={{ textAlign: 'center', marginTop: 18, lineHeight: 1.5 }}>
        ¿Dudas o algo que te gustaría que haga? Escribime a emilio.watemberg@gmail.com
      </p>
    </>
  )
}
