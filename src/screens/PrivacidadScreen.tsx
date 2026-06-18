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
      <p className="updated">Última actualización: 17/06/2026</p>

      <h2>1. Introducción</h2>
      <p>
        La presente Política de Privacidad describe cómo Saque recopila, utiliza, almacena y protege la
        información personal de los usuarios de la aplicación. Al utilizar Saque, aceptás las prácticas
        descritas en esta Política.
      </p>

      <h2>2. Responsable del tratamiento</h2>
      <p>El responsable del tratamiento de los datos personales es:</p>
      <p>
        <strong>Saque</strong> — Correo electrónico: emilio.watemberg@gmail.com
      </p>
      <p>
        La autoridad de control de la Ley N.º 25.326 es la Agencia de Acceso a la Información Pública
        (AAIP).
      </p>

      <h2>3. Datos que recopilamos</h2>
      <p><strong>Datos del profesor.</strong> Podemos recopilar:</p>
      <ul>
        <li>Nombre y apellido.</li>
        <li>Correo electrónico.</li>
        <li>Deporte que enseña.</li>
        <li>Información de configuración de la cuenta.</li>
        <li>Información relacionada con el uso de la aplicación.</li>
        <li>Registros técnicos necesarios para la operación y seguridad del servicio.</li>
      </ul>
      <p><strong>Datos de alumnos cargados por los profesores.</strong> Los profesores pueden almacenar:</p>
      <ul>
        <li>Nombre y apellido.</li>
        <li>Número de teléfono.</li>
        <li>Categoría o nivel deportivo.</li>
        <li>Historial de asistencia.</li>
        <li>Información administrativa relacionada con pagos o deudas.</li>
      </ul>
      <p><strong>Datos técnicos.</strong> La aplicación puede registrar:</p>
      <ul>
        <li>Dirección IP.</li>
        <li>Información del dispositivo.</li>
        <li>Sistema operativo.</li>
        <li>Fecha y hora de acceso.</li>
        <li>Registros de errores y eventos de seguridad.</li>
      </ul>

      <h2>4. Datos sensibles</h2>
      <p>
        Saque no solicita ni requiere datos sensibles en los términos de la Ley N.º 25.326. Los
        usuarios no deberán ingresar información relacionada con: estado de salud, datos biométricos,
        creencias religiosas, afiliación política, orientación sexual o información sindical. En caso de
        que dichos datos sean ingresados por error, el usuario será responsable de su carga y podrá
        solicitar su eliminación.
      </p>

      <h2>5. Finalidad del tratamiento</h2>
      <p>Los datos personales son utilizados exclusivamente para:</p>
      <ul>
        <li>Crear y administrar cuentas.</li>
        <li>Permitir la gestión de alumnos.</li>
        <li>Organizar clases y turnos.</li>
        <li>Registrar asistencias.</li>
        <li>Gestionar información administrativa de cobranzas.</li>
        <li>Generar mensajes y recordatorios para los usuarios.</li>
        <li>Mantener la seguridad de la plataforma.</li>
        <li>Resolver incidencias técnicas.</li>
        <li>Cumplir obligaciones legales aplicables.</li>
      </ul>
      <p>No comercializamos ni vendemos datos personales.</p>

      <h2>6. Datos de terceros cargados por los profesores</h2>
      <p>
        Los profesores que cargan información de alumnos o terceros declaran contar con las
        autorizaciones, consentimientos o bases legales necesarias para hacerlo. Respecto de esos
        datos, el profesor actúa como responsable de la información incorporada y Saque actúa como
        proveedor de la herramienta tecnológica que permite su almacenamiento y gestión. Saque no
        verifica la obtención de dichos consentimientos.
      </p>

      <h2>7. Compartición de información</h2>
      <p>
        Saque no comparte datos personales con terceros con fines comerciales. Podremos compartir
        información únicamente con proveedores tecnológicos necesarios para la prestación del servicio.
        Asimismo, podremos revelar información cuando exista una obligación legal, requerimiento
        judicial o solicitud válida de autoridad competente.
      </p>

      <h2>8. Servicios de terceros</h2>
      <p>
        Para prestar el servicio, Saque puede utilizar proveedores tecnológicos externos que procesan
        información por cuenta de la plataforma. Entre ellos:
      </p>
      <p><strong>Supabase.</strong> Utilizamos Supabase para:</p>
      <ul>
        <li>Autenticación de usuarios.</li>
        <li>Almacenamiento de información.</li>
        <li>Bases de datos.</li>
        <li>Servicios relacionados con la operación de la aplicación.</li>
      </ul>
      <p>
        Supabase puede procesar datos personales en infraestructura ubicada fuera de la República
        Argentina. Más información: https://supabase.com/privacy
      </p>
      <p>
        <strong>Servicios de autenticación externos.</strong> Cuando el usuario utilice mecanismos de
        inicio de sesión provistos por terceros (por ejemplo Google o Apple), podremos recibir
        determinada información básica asociada a la cuenta autorizada por el usuario, como nombre,
        dirección de correo electrónico e identificador único. La información recibida será utilizada
        exclusivamente para autenticar al usuario y prestar el servicio.
      </p>
      <p>
        <strong>Servicios de mensajería.</strong> La aplicación puede generar mensajes o recordatorios
        para ser enviados mediante aplicaciones externas como WhatsApp. Saque no controla ni es
        responsable del tratamiento de datos realizado por dichos servicios externos. El usuario es
        responsable de verificar las políticas de privacidad aplicables a las plataformas utilizadas
        para enviar comunicaciones.
      </p>

      <h2>9. Transferencias internacionales</h2>
      <p>
        Al utilizar la aplicación, el usuario acepta que determinada información pueda ser almacenada o
        procesada en servidores ubicados fuera de Argentina. Saque adopta medidas razonables para
        contratar proveedores que implementen estándares adecuados de seguridad y protección de datos.
      </p>

      <h2>10. Conservación de la información</h2>
      <p>Los datos personales serán conservados:</p>
      <ul>
        <li>Mientras la cuenta permanezca activa.</li>
        <li>Mientras resulten necesarios para la prestación del servicio.</li>
        <li>Durante los plazos exigidos por obligaciones legales aplicables.</li>
      </ul>
      <p>
        Una vez solicitada la eliminación de la cuenta, los datos podrán permanecer bloqueados o
        resguardados durante el tiempo necesario para cumplir obligaciones legales, resolver conflictos
        o ejercer defensas legales.
      </p>

      <h2>11. Seguridad</h2>
      <p>
        Implementamos medidas técnicas y organizativas razonables para proteger la información contra
        acceso no autorizado, alteración, divulgación indebida y destrucción accidental. Sin embargo,
        ningún sistema informático puede garantizar seguridad absoluta. Los usuarios son responsables
        de mantener la confidencialidad de sus credenciales de acceso.
      </p>

      <h2>12. Derechos de los titulares de datos</h2>
      <p>Los titulares de datos personales podrán ejercer gratuitamente los siguientes derechos:</p>
      <ul>
        <li>Acceso.</li>
        <li>Rectificación.</li>
        <li>Actualización.</li>
        <li>Supresión.</li>
      </ul>
      <p>
        Las solicitudes podrán realizarse mediante correo electrónico a emilio.watemberg@gmail.com.
        Responderemos dentro de los plazos establecidos por la normativa aplicable.
      </p>

      <h2>13. Notificaciones</h2>
      <p>La aplicación podrá enviar notificaciones relacionadas con:</p>
      <ul>
        <li>Clases programadas.</li>
        <li>Recordatorios de turnos.</li>
        <li>Cambios de agenda.</li>
        <li>Información relevante para el funcionamiento del servicio.</li>
      </ul>
      <p>
        El usuario podrá gestionar los permisos de notificación desde la configuración de su
        dispositivo cuando ello sea técnicamente posible.
      </p>

      <h2>14. Permisos de la aplicación</h2>
      <p>
        Dependiendo de las funcionalidades utilizadas, la aplicación podrá solicitar permisos del
        dispositivo para:
      </p>
      <ul>
        <li>Acceso a Internet.</li>
        <li>Envío de notificaciones.</li>
        <li>Acceso a calendario (si se implementa).</li>
        <li>Acceso a cámara o galería para fotografías de perfil (si se implementa).</li>
      </ul>
      <p>
        Los permisos serán utilizados exclusivamente para las finalidades informadas y podrán ser
        revocados por el usuario desde la configuración de su dispositivo.
      </p>

      <h2>15. Menores de edad</h2>
      <p>
        Cuando se incorporen datos de menores de edad, el profesor declara contar con la autorización
        de sus padres, madres o representantes legales cuando ello resulte exigible conforme a la
        legislación vigente.
      </p>

      <h2>16. Eliminación de cuenta</h2>
      <p>
        Los usuarios podrán solicitar la eliminación de su cuenta en cualquier momento. La eliminación
        de la cuenta podrá implicar la eliminación o anonimización de los datos asociados, salvo
        aquellos que deban conservarse por obligaciones legales o de seguridad. Podés ver los pasos en{' '}
        <Link to="/eliminar-cuenta" style={{ color: 'var(--accent)' }}>Eliminar tu cuenta</Link>.
      </p>

      <h2>17. Cambios en esta Política</h2>
      <p>
        Saque podrá modificar esta Política de Privacidad en cualquier momento. Las modificaciones
        serán publicadas dentro de la aplicación y entrarán en vigencia desde su publicación. La
        continuidad en el uso de la aplicación implicará la aceptación de la versión vigente.
      </p>

      <h2>18. Autoridad de control</h2>
      <p>
        La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley
        N.º 25.326, tiene la atribución de atender denuncias y reclamos relacionados con el
        incumplimiento de las normas sobre protección de datos personales.
      </p>

      <h2>19. Contacto</h2>
      <p>
        Para consultas relacionadas con privacidad o protección de datos personales:
        emilio.watemberg@gmail.com
      </p>

      <h2>20. Relación con los Términos y Condiciones</h2>
      <p>
        Esta Política de Privacidad complementa los{' '}
        <Link to="/terminos" style={{ color: 'var(--accent)' }}>Términos y Condiciones</Link> de Uso de
        Saque, los cuales forman parte integral del marco contractual aplicable a la utilización de la
        plataforma.
      </p>
    </div>
  )
}
