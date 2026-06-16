import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'

export function AyudaScreen() {
  const navigate = useNavigate()
  return (
    <div className="legal" style={{ maxWidth: 760, margin: '0 auto', padding: '16px' }}>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Ayuda</h1>
        </div>
      </div>

      <h2>Cómo empezar</h2>
      <p>Para tener tu agenda lista, seguí estos pasos (la app te los muestra como checklist):</p>
      <ul>
        <li><strong>Cargá una cancha</strong> (pie de la app → Canchas → Nueva).</li>
        <li><strong>Cargá tus alumnos</strong> (sección Alumnos → Nuevo). En el celular podés importarlos de tu agenda.</li>
        <li><strong>Armá una franja</strong> recurrente (pie → Franjas), ej. "todos los martes 19hs".</li>
        <li><strong>Generá los turnos del mes</strong> desde Franjas, con un botón.</li>
      </ul>

      <h2>Turnos del día</h2>
      <p>
        La pantalla <strong>Hoy</strong> muestra tus turnos. El color avisa el estado: verde = completo,
        amarillo = hay lugar libre, rojo = no cubre el costo de la cancha, tachado = suspendido. Tocá un
        turno para ver el detalle.
      </p>

      <h2>Asistencia y bajas</h2>
      <p>
        En el detalle del turno marcás <strong>asistencia</strong> de cada alumno, das de <strong>baja</strong> a alguien,
        <strong> anotás</strong> a un alumno en un lugar libre, o <strong>suspendés/reprogramás</strong> el turno.
      </p>

      <h2>Cobranzas</h2>
      <p>
        A principio de mes, tocá <strong>"Generar cuotas del mes"</strong> para crear las cuotas de tus alumnos
        fijos. Después tocá cada alumno para <strong>registrar el pago</strong> (MercadoPago, transferencia o
        efectivo). Arriba ves cuánto esperás, cuánto cobraste y cuánto falta.
      </p>

      <h2>Avisos por WhatsApp</h2>
      <p>
        Saque <strong>arma el mensaje y vos lo enviás</strong> con un toque (suspensión, lugar libre, recordatorio
        de cuota). No se manda nada solo, así que no tiene costo.
      </p>

      <h2>Balance</h2>
      <p>
        Muestra tu <strong>ganancia neta</strong> (lo cobrado menos el alquiler de canchas), el dinero real por
        hora y un gráfico con la evolución de los últimos meses.
      </p>

      <h2>Apariencia</h2>
      <p>
        En <strong>Apariencia</strong> (pie de la app) elegís modo claro/oscuro y el color de la app. Se guarda
        en tu dispositivo.
      </p>

      <h2>¿Dudas?</h2>
      <p>Escribinos a emilio.watemberg@gmail.com</p>
    </div>
  )
}
