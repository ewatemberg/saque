import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'

export function EliminarCuentaScreen() {
  const navigate = useNavigate()
  return (
    <div className="legal" style={{ maxWidth: 760, margin: '0 auto', padding: '16px' }}>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Eliminar tu cuenta</h1>
        </div>
      </div>
      <p className="updated">Última actualización: 17/06/2026</p>

      <p>
        Esta página explica cómo solicitar la eliminación de tu cuenta de <strong>Saque</strong> (app de
        gestión de clases para profes de pádel y tenis, operada por Emilio Watemberg) y de los datos
        asociados.
      </p>

      <h2>Cómo solicitar la eliminación</h2>
      <p>Para pedir que borremos tu cuenta y tus datos, seguí estos pasos:</p>
      <ol>
        <li>
          Escribí un correo a <strong>emilio.watemberg@gmail.com</strong> desde la misma dirección de
          email con la que usás Saque.
        </li>
        <li>
          Poné como asunto <strong>"Eliminar mi cuenta"</strong> e indicá tu nombre o el email de tu
          cuenta para poder identificarla.
        </li>
        <li>
          Procesamos la solicitud y confirmamos la eliminación dentro de los <strong>30 días</strong>.
        </li>
      </ol>

      <h2>Qué datos se eliminan</h2>
      <p>Al eliminar tu cuenta se borran de forma permanente los datos asociados a ella, incluyendo:</p>
      <ul>
        <li>Tu cuenta y tu perfil (email, nombre, configuración).</li>
        <li>Tus alumnos cargados (nombre, teléfono, categoría).</li>
        <li>Tus turnos, franjas, asistencias y cuotas/cobranzas.</li>
      </ul>

      <h2>Qué datos se conservan y por cuánto tiempo</h2>
      <p>
        Solo conservamos información cuando una obligación legal lo exige (por ejemplo, registros
        contables o de seguridad). En ese caso, los datos se mantienen <strong>bloqueados</strong>
        durante el plazo exigido por la legislación aplicable y luego se eliminan. No se utilizan para
        ningún otro fin.
      </p>

      <p style={{ marginTop: 20 }}>
        Más detalles en nuestra{' '}
        <Link to="/privacidad" style={{ color: 'var(--accent)' }}>Política de Privacidad</Link>.
      </p>
    </div>
  )
}
