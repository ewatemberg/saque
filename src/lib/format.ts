/** Formatea un monto en pesos argentinos: 25000 -> "$25.000" */
export function formatPesos(monto: number): string {
  return '$' + Math.round(monto).toLocaleString('es-AR')
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

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** Nombre del mes en curso, en minúsculas: "junio". */
export function mesActual(): string {
  return MESES[new Date().getMonth()]
}

/** Mes y año en curso: "junio 2026". */
export function mesYAnioActual(): string {
  const d = new Date()
  return `${MESES[d.getMonth()]} ${d.getFullYear()}`
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

/** Fecha ISO "2026-06-22" -> "lunes 22/6". Parsea por partes para evitar el corrimiento por UTC. */
export function formatFechaCorta(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${DIAS[new Date(y, m - 1, d).getDay()]} ${d}/${m}`
}

/** Iniciales a partir del nombre: "Juan Díaz" -> "JD". */
export function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return ''
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase()
  return (palabras[0][0] + palabras[1][0]).toUpperCase()
}
