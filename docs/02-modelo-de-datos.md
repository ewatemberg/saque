# 02 · Modelo de datos

Las entidades del MVP. La definición en código está en
[`src/types.ts`](../src/types.ts).

## Entidades

| Entidad | Qué es | Campos clave |
| --- | --- | --- |
| **Cancha** | Dónde se da la clase | `costoPorHora` (el alquiler que paga el profe) |
| **Franja** | Disponibilidad recurrente | día, hora inicio/fin, cancha |
| **Turno** | Una clase concreta | fecha, hora, precio, cupos (0–4), `estado`, `costoCancha` |
| **Alumno** | Quien toma clases | categoría/nivel, teléfono, `tipo` (fijo/ocasional) |
| **Inscripción** | Liga turno ↔ alumno | a qué turno, asistió o no |
| **Plan de pago** | Compromiso de pago | **Abono mensual** (fijo) o **Paquete** de N clases (ocasional) |
| **Pago** | Plata que entró | monto, fecha, `método` (MercadoPago/transferencia/efectivo) |
| **Notificación** | Aviso por WhatsApp | tipo (suspensión / lugar libre / cambio de precio) |
| **Dashboard** | *Derivado, no se guarda* | se calcula de turnos + pagos + costo de cancha |

## Relaciones

```
Profe ──usa──> Cancha ──define──> Franja ──genera──> Turno
                                                       │
                                            Inscripción (asistencia)
                                                       │
Alumno ──tiene──> Plan de pago ──se salda con──> Pago  ┘
Profe ──envía──> Notificación (WhatsApp)
```

## Reglas de negocio

- **Estados del turno**: `activo`, `suspendido`, `recupero`.
- **Suspensión**: cuando el profe (o el alumno) suspende, **se reprograma** la
  clase (estado `recupero`). El abono del mes no se toca.
- **Pago mensual** como caso principal (a principio de mes); **pago por clase /
  paquete** para el alumno ocasional, como caso secundario.
- **Punto de equilibrio**: como la cancha cuesta lo mismo vengan 2 o 4 alumnos,
  un turno cuyo ingreso (`precio × inscriptos`) no llega al `costoCancha` está a
  pérdida. La app lo marca en rojo (ver [`HoyScreen`](../src/screens/HoyScreen.tsx)).
- **Balance**: `ganancia neta = ingreso bruto − costo de canchas`. El número que
  importa no es lo facturado, es lo que le queda al profe.
