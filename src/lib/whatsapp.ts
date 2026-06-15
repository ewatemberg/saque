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
