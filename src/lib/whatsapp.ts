// Saque usa WhatsApp como canal de avisos: la app arma el mensaje y el profe
// lo envia. No procesa nada por WhatsApp (eso seria un bot, fase posterior).
// Ver docs/01-vision-y-nicho.md.

/**
 * Abre WhatsApp con un texto prearmado. Si se pasa telefono, va dirigido a esa
 * persona; si no, abre el selector para elegir contacto o grupo.
 */
export function abrirWhatsApp(texto: string, telefono?: string): void {
  const numero = telefono ? telefono.replace(/[^0-9]/g, '') : ''
  const base = numero ? `https://wa.me/${numero}` : 'https://wa.me/'
  const url = `${base}?text=${encodeURIComponent(texto)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Primer nombre de pila: "Juan Díaz" -> "Juan". */
function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] || nombre
}

/**
 * Mensaje de recordatorio de cuota, personalizado con el nombre del alumno, el
 * monto adeudado y el mes. Si no hay monto (<= 0) lo omite.
 */
export function mensajeRecordatorioCuota(
  nombre: string,
  mes: string,
  montoTexto?: string,
  linkPago?: string,
): string {
  const saludo = `Hola ${primerNombre(nombre)}!`
  const detalle = montoTexto
    ? `Te recuerdo que quedó pendiente la cuota de ${mes} (${montoTexto}).`
    : `Te recuerdo que quedó pendiente la cuota de ${mes}.`
  const pago = linkPago?.trim() ? ` Podés pagarla por acá: ${linkPago.trim()}` : ''
  return `${saludo} ${detalle}${pago} Cualquier cosa me avisás. ¡Gracias!`
}

/** Mensaje para coordinar el recupero de un turno suspendido. */
export function mensajeRecupero(fechaTexto: string, hora: string, categoria: string, cancha: string): string {
  return `Hola! La clase suspendida la recuperamos el ${fechaTexto} a las ${hora} (${categoria}, ${cancha}). ¿Te queda bien? ¡Avisame!`
}
