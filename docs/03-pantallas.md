# 03 · Pantallas

El MVP tiene 4 secciones, accesibles desde la barra inferior (en celular) o el
menú lateral (en web). Diseño **mobile-first**: el profe la usa al borde de la
cancha, pero el mismo layout se estira en la compu.

## Hoy ([`HoyScreen`](../src/screens/HoyScreen.tsx))

La pantalla principal. Lo primero que ve al abrir la app.

- Tres métricas rápidas: turnos del día, alumnos, neto del día.
- Lista de turnos con su estado por color:
  - **Verde**: completo (4/4).
  - **Amarillo**: hay lugar libre → botón "Avisar lugar libre" por WhatsApp.
  - **Tachado**: suspendido, con recupero pendiente → botón "Reprogramar".
  - **Rojo**: por debajo del punto de equilibrio (no cubre el costo de cancha).

## Cobranzas ([`CobranzasScreen`](../src/screens/CobranzasScreen.tsx))

El control del mes. Pensada para abrir el día 1 y salir a cobrar.

- Esperado / cobrado / falta, con barra de progreso.
- Botón "Recordar a los que deben" → arma el WhatsApp para los morosos.
- Lista de alumnos con estado: pagó / debe / parcial / paquete.

## Alumnos ([`AlumnosScreen`](../src/screens/AlumnosScreen.tsx))

Listado de alumnos con categoría y tipo (fijo/ocasional), con acceso directo a
escribirles por WhatsApp. (Alta y ficha completa: a desarrollar.)

## Balance ([`BalanceScreen`](../src/screens/BalanceScreen.tsx))

El número que justifica la app: **ganancia neta** del mes (descontando el
alquiler), $ real por hora y ocupación de los turnos.

## Acciones de WhatsApp

Todas las acciones de WhatsApp pasan por
[`src/lib/whatsapp.ts`](../src/lib/whatsapp.ts): la app arma el texto y abre
WhatsApp para que el profe lo envíe. No se envía nada automáticamente.
