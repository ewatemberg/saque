import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'

export function TerminosScreen() {
  const navigate = useNavigate()
  return (
    <div className="legal" style={{ maxWidth: 760, margin: '0 auto', padding: 'calc(16px + env(safe-area-inset-top)) 16px 16px' }}>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Términos y Condiciones</h1>
        </div>
      </div>
      <p className="updated">Última actualización: 17/06/2026</p>

      <h2>1. Introducción</h2>
      <p>Bienvenido a Saque.</p>
      <p>
        Saque es una aplicación informática destinada a facilitar la gestión de clases, alumnos,
        turnos, asistencias, cobranzas y actividades relacionadas con la enseñanza de pádel y tenis.
      </p>
      <p>
        Al registrarse, acceder o utilizar la aplicación, el usuario acepta los presentes Términos y
        Condiciones y la Política de Privacidad asociada. Si no está de acuerdo con estos términos,
        deberá abstenerse de utilizar la aplicación.
      </p>

      <h2>2. Titularidad de la aplicación</h2>
      <p>
        La aplicación Saque es operada y administrada por Emilio Watemberg (en adelante, "Saque",
        "nosotros" o "la Plataforma"). Saque proporciona exclusivamente una herramienta tecnológica de
        gestión.
      </p>

      <h2>3. Usuarios</h2>
      <p>Podrán utilizar la aplicación:</p>
      <ul>
        <li>Profesores de pádel y tenis.</li>
        <li>Escuelas deportivas.</li>
        <li>Alumnos o personas invitadas por profesores para interactuar con la plataforma.</li>
      </ul>
      <p>
        Cada usuario declara poseer capacidad legal suficiente para aceptar estos Términos. En caso de
        menores de edad, el uso deberá realizarse bajo la autorización y supervisión de sus
        representantes legales.
      </p>

      <h2>4. Registro y cuenta</h2>
      <p>Para utilizar determinadas funcionalidades será necesario crear una cuenta. El usuario se compromete a:</p>
      <ul>
        <li>Proporcionar información verdadera, exacta y actualizada.</li>
        <li>Mantener la confidencialidad de sus credenciales.</li>
        <li>Notificar cualquier acceso no autorizado a su cuenta.</li>
      </ul>
      <p>El usuario será responsable de toda actividad realizada desde su cuenta.</p>

      <h2>5. Servicios ofrecidos</h2>
      <p>Saque permite, entre otras funcionalidades:</p>
      <ul>
        <li>Gestión de alumnos.</li>
        <li>Gestión de clases y turnos.</li>
        <li>Registro de asistencia.</li>
        <li>Organización de grupos.</li>
        <li>Gestión administrativa de cobranzas.</li>
        <li>Comunicación entre profesores y alumnos.</li>
      </ul>
      <p>Las funcionalidades podrán modificarse, ampliarse o discontinuarse en cualquier momento.</p>

      <h2>6. Relación entre profesores y alumnos</h2>
      <p>
        Saque no es una academia, club deportivo ni institución educativa. Saque no contrata
        profesores ni organiza actividades deportivas. La plataforma únicamente facilita herramientas
        de gestión. Por lo tanto:
      </p>
      <ul>
        <li>No garantiza la identidad, experiencia, formación o idoneidad de los profesores.</li>
        <li>No garantiza la conducta de profesores o alumnos.</li>
        <li>No participa en la contratación de servicios deportivos.</li>
        <li>No interviene en la fijación de precios.</li>
        <li>No interviene en la ejecución de las clases.</li>
        <li>No actúa como representante de ninguna de las partes.</li>
      </ul>
      <p>
        Toda relación contractual, económica o personal entre profesores y alumnos es exclusiva
        responsabilidad de dichas partes.
      </p>

      <h2>7. Pagos y cobranzas</h2>
      <p>
        Saque no procesa pagos ni actúa como intermediario financiero, salvo que expresamente se
        informe lo contrario en futuras versiones. Los importes, condiciones de pago, descuentos,
        reembolsos y cualquier cuestión económica son acordados directamente entre profesores y
        alumnos. Saque no será responsable por:
      </p>
      <ul>
        <li>Incumplimientos de pago.</li>
        <li>Reclamos económicos.</li>
        <li>Cancelaciones de clases.</li>
        <li>Reembolsos.</li>
        <li>Deudas entre usuarios.</li>
      </ul>

      <h2>8. Uso permitido</h2>
      <p>El usuario se compromete a utilizar la plataforma de manera lícita y de buena fe. Queda prohibido:</p>
      <ul>
        <li>Suplantar identidades.</li>
        <li>Utilizar información falsa.</li>
        <li>Publicar contenido ilícito.</li>
        <li>Realizar actividades fraudulentas.</li>
        <li>Vulnerar medidas de seguridad.</li>
        <li>Intentar acceder a información de terceros.</li>
        <li>Utilizar la plataforma para enviar spam o comunicaciones no solicitadas.</li>
      </ul>

      <h2>9. Datos personales</h2>
      <p>
        El tratamiento de datos personales se realiza conforme a la legislación argentina vigente y a
        la Política de Privacidad de Saque. Los usuarios declaran contar con las autorizaciones
        necesarias para incorporar a la plataforma los datos de terceros que registren, incluyendo
        alumnos y contactos.
      </p>

      <h2>10. Propiedad intelectual</h2>
      <p>
        La aplicación, su diseño, código fuente, funcionalidades, marcas, logotipos y contenidos son
        propiedad de Saque o de sus respectivos titulares. El uso de la plataforma no concede derechos
        de propiedad intelectual al usuario. Queda prohibida la reproducción, distribución o
        explotación no autorizada de cualquier componente de la aplicación.
      </p>

      <h2>11. Disponibilidad del servicio</h2>
      <p>Saque realizará esfuerzos razonables para mantener la disponibilidad del servicio. Sin embargo, no garantiza:</p>
      <ul>
        <li>Disponibilidad permanente.</li>
        <li>Funcionamiento ininterrumpido.</li>
        <li>Ausencia de errores.</li>
        <li>Compatibilidad con todos los dispositivos.</li>
      </ul>
      <p>Podrán producirse interrupciones por mantenimiento, actualizaciones o causas ajenas a nuestro control.</p>

      <h2>12. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la legislación aplicable, Saque no será responsable por
        daños directos o indirectos derivados de:
      </p>
      <ul>
        <li>La utilización de la aplicación.</li>
        <li>La imposibilidad de utilizarla.</li>
        <li>Errores en la información cargada por usuarios.</li>
        <li>Conductas de profesores o alumnos.</li>
        <li>Acuerdos celebrados entre usuarios.</li>
        <li>Pérdida de información ocasionada por causas ajenas al control razonable de la plataforma.</li>
      </ul>
      <p>
        Nada de lo dispuesto en estos Términos limita o excluye derechos reconocidos por normas de
        orden público, incluida la Ley N.º 24.240 de Defensa del Consumidor.
      </p>

      <h2>13. Suspensión y cancelación de cuentas</h2>
      <p>Saque podrá suspender, restringir o cancelar cuentas cuando detecte:</p>
      <ul>
        <li>Incumplimientos de estos Términos.</li>
        <li>Actividades fraudulentas.</li>
        <li>Riesgos de seguridad.</li>
        <li>Uso abusivo de la plataforma.</li>
      </ul>
      <p>
        Asimismo, cualquier usuario podrá solicitar la eliminación de su cuenta mediante los canales de
        contacto habilitados.
      </p>

      <h2>14. Modificaciones</h2>
      <p>
        Saque podrá modificar estos Términos y Condiciones en cualquier momento. Las modificaciones
        entrarán en vigencia desde su publicación dentro de la aplicación o desde su notificación al
        usuario. La continuidad en el uso de la plataforma implicará la aceptación de los nuevos
        términos.
      </p>

      <h2>15. Legislación aplicable y jurisdicción</h2>
      <p>
        Estos Términos se regirán por las leyes de la República Argentina. Cuando resulte aplicable una
        relación de consumo, serán competentes los tribunales correspondientes al domicilio del
        consumidor, conforme la normativa vigente.
      </p>

      <h2>16. Contacto</h2>
      <p>Para consultas relacionadas con estos Términos y Condiciones: emilio.watemberg@gmail.com</p>

      <h2>17. Política de Privacidad</h2>
      <p>
        El uso de la aplicación se encuentra sujeto también a la{' '}
        <Link to="/privacidad" style={{ color: 'var(--accent)' }}>Política de Privacidad</Link> de Saque,
        la cual forma parte integrante de estos Términos y Condiciones.
      </p>
    </div>
  )
}
