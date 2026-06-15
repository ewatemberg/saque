import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'

export function TerminosScreen() {
  const navigate = useNavigate()
  return (
    <div className="legal" style={{ maxWidth: 760, margin: '0 auto', padding: '16px' }}>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <h1>Términos y Condiciones</h1>
        </div>
      </div>
      <p className="updated">Última actualización: 15/06/2026</p>

      <h2>1. Qué es Saque</h2>
      <p>
        Saque es una aplicación de gestión que ayuda a profesores de pádel y tenis a organizar
        clases, turnos, alumnos y cobranzas. Es una herramienta: no es un club, no emplea a los
        profesores ni participa de la relación entre el profesor y sus alumnos. Al usar Saque
        aceptás estos Términos.
      </p>

      <h2>2. Cuenta</h2>
      <p>
        Necesitás una cuenta con un correo válido. Sos responsable de tu acceso y de la veracidad
        de los datos que cargás. Está prohibido registrarse con identidad falsa o suplantar a otra
        persona.
      </p>

      <h2>3. Profesores y alumnos</h2>
      <ul>
        <li>
          Saque <strong>no verifica la identidad ni la idoneidad</strong> de los profesores. Tener
          un perfil en Saque no implica ningún aval ni recomendación de nuestra parte.
        </li>
        <li>
          Las clases, precios y pagos se acuerdan <strong>directamente entre profesor y alumno</strong>.
          Saque no es parte de esa relación ni procesa pagos.
        </li>
        <li>Tomá recaudos razonables antes de contratar o pagar.</li>
      </ul>

      <h2>4. Uso correcto</h2>
      <p>
        No está permitido suplantar identidades, cargar datos falsos o de terceros sin su
        consentimiento, estafar o acosar a otros, ni vulnerar la seguridad de la app.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        En la medida permitida por la ley argentina, Saque no responde por acuerdos, pagos o
        conductas entre profesores y alumnos, por ser ajena a esa relación. Nada en estos Términos
        limita los derechos que la Ley 24.240 de Defensa del Consumidor reconoce a los usuarios.
      </p>

      <h2>6. Suspensión de cuentas</h2>
      <p>
        Podemos suspender o dar de baja cuentas que incumplan estos Términos o sean denunciadas por
        fraude o suplantación. Podés pedir la baja de tu cuenta escribiéndonos.
      </p>

      <h2>7. Ley aplicable</h2>
      <p>
        Estos Términos se rigen por las leyes de la República Argentina. Para relaciones de consumo
        es competente el tribunal del domicilio del consumidor.
      </p>

      <h2>8. Contacto</h2>
      <p>Consultas: emilio.watemberg@gmail.com</p>

      <p style={{ marginTop: 20 }}>
        Ver también la <Link to="/privacidad" style={{ color: 'var(--accent)' }}>Política de Privacidad</Link>.
      </p>
    </div>
  )
}
