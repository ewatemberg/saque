const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** Formatea un monto en pesos: 25000 -> "$ 25.000" */
export function formatPesos(monto: number): string {
  return pesos.format(Math.round(monto))
}

/** Version compacta para metricas: 28000 -> "$28k" */
export function formatCompacto(monto: number): string {
  const m = Math.round(monto)
  if (Math.abs(m) >= 1000) {
    return `$${Math.round(m / 1000)}k`
  }
  return `$${m}`
}

const metodos: Record<string, string> = {
  mercadopago: 'MercadoPago',
  transferencia: 'transferencia',
  efectivo: 'efectivo',
}

export function nombreMetodo(metodo?: string): string {
  if (!metodo) return ''
  return metodos[metodo] ?? metodo
}

/** Normaliza texto para buscar/comparar: minúsculas, sin acentos ni símbolos. */
export function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '')
}

/** Iniciales a partir del nombre: "Juan Díaz" -> "JD". */
export function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return ''
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase()
  return (palabras[0][0] + palabras[1][0]).toUpperCase()
}
