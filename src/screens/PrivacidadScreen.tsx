import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'

export function PrivacidadScreen() {
  const navigate = useNavigate()
  return (
    <div className="legal" style={{ maxWidth: 760, margin: '0 auto', padding: '16px' }}>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Política de Privacidad</h1>
        </div>
      </div>
      <p className="updated">Última actualización: 15/06/2026</p>

      <h2>1. Responsable</h2>
      <p>
        Los datos tratados en Saque están a cargo de Saque (contacto:
        emilio.watemberg@gmail.com). La autoridad de control en Argentina es la Agencia de Acceso a
        la Información Pública (AAIP).
      </p>

      <h2>2. Qué datos tratamos</h2>
      <ul>
        <li>Del profesor: correo, nombre, deporte y datos de uso.</li>
        <li>Cargados por el profesor sobre sus alumnos: nombre, teléfono, categoría, asistencia y pagos.</li>
      </ul>
      <p>No solicitamos datos sensibles (como salud). No los cargues en campos libres.</p>

      <h2>3. Para qué los usamos</h2>
      <p>
        Solo para prestar el servicio: autenticarte, mostrar tu agenda, gestionar turnos, alumnos y
        cobranzas, y armar avisos que vos enviás por WhatsApp. No vendemos tus datos.
      </p>

      <h2>4. Datos de los alumnos</h2>
      <p>
        Cuando un profesor carga datos de sus alumnos, es responsable de contar con el
        consentimiento de esas personas. Saque actúa como proveedor de la herramienta que los
        almacena por cuenta del profesor.
      </p>

      <h2>5. Con quién se comparten</h2>
      <p>
        Usamos Supabase como proveedor de infraestructura (base de datos y autenticación); los datos
        se alojan en sus servidores (San Pablo, Brasil). No compartimos datos con terceros con fines
        comerciales.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Podés acceder, rectificar, actualizar y suprimir tus datos de forma gratuita escribiéndonos
        a emilio.watemberg@gmail.com.
      </p>

      <h2>7. Conservación y seguridad</h2>
      <p>
        Conservamos los datos mientras tu cuenta esté activa. Aplicamos medidas razonables de
        seguridad (acceso autenticado y aislamiento de los datos de cada profesor). Cuidá tu acceso.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        Si un alumno es menor, el profesor debe contar con el consentimiento de su madre, padre o
        tutor para cargar sus datos.
      </p>

      <h2>9. Contacto</h2>
      <p>Para ejercer tus derechos o consultas: emilio.watemberg@gmail.com</p>

      <p style={{ marginTop: 20 }}>
        Ver también los <Link to="/terminos" style={{ color: 'var(--accent)' }}>Términos y Condiciones</Link>.
      </p>
    </div>
  )
}
