// Modelo de datos de Saque (ver docs/02-modelo-de-datos.md)

export type Deporte = 'padel' | 'tenis'
export type Categoria = '1ra' | '2da' | '3ra' | '4ta' | '5ta' | '6ta' | '7ma'
export type TipoAlumno = 'fijo' | 'ocasional'
export type EstadoTurno = 'activo' | 'suspendido' | 'recupero'
export type EstadoCobranza = 'pagado' | 'debe' | 'parcial' | 'paquete'
export type MetodoPago = 'mercadopago' | 'transferencia' | 'efectivo'

export interface Cancha {
  id: string
  nombre: string
  direccion: string
  contacto: string
  costoPorHora: number
  deporte: Deporte
}

export interface Alumno {
  id: string
  nombre: string
  iniciales: string
  categoria: Categoria
  telefono: string
  tipo: TipoAlumno
  montoAbono: number
}

export interface Inscripto {
  alumnoId: string
  iniciales: string
  nombre: string
  asistio: boolean
}

export interface Turno {
  id: string
  fecha: string
  hora: string
  duracionMin: number
  canchaNombre: string
  categoria: Categoria
  precio: number
  cupos: number // capacidad (normalmente 4)
  inscriptos: Inscripto[]
  estado: EstadoTurno
  costoCancha: number // alquiler que paga el profe por este turno
}

export interface Franja {
  id: string
  diaSemana: number // 0=Domingo .. 6=Sábado
  hora: string
  duracionMin: number
  canchaNombre: string
  categoria: Categoria
  precio: number
  cupos: number
  costoCancha: number
  permanente: boolean
  alumnoIds: string[]
}

export interface ItemCobranza {
  id: string
  alumnoId: string
  nombre: string
  iniciales: string
  detalle: string
  estado: EstadoCobranza
  montoEsperado: number
  montoPagado: number
  metodo?: MetodoPago
  clasesRestantes?: number
  telefono?: string
}

export interface ResumenMes {
  esperado: number
  cobrado: number
  falta: number
  deudores: number
}

export interface HistoricoMes {
  periodo: string
  etiqueta: string
  cobrado: number
  costo: number
  neto: number
}

export interface TurnoPublico {
  fecha: string
  hora: string
  canchaNombre: string
  categoria: Categoria
  cupos: number
  ocupados: number
}

export interface PerfilPublico {
  nombre: string
  whatsapp: string
  deporte: Deporte | null
}

export interface ProfeMetrica {
  nombre: string
  email: string
  deporte: string | null
  alumnos: number
  turnos: number
  franjas: number
}

export interface MetricasAdmin {
  profes: number
  alumnos: number
  turnos: number
  franjas: number
  canchas: number
  porDeporte: { padel: number; tenis: number }
  altasPorMes: { periodo: string; profes: number }[]
  porProfe: ProfeMetrica[]
}

export interface ResumenBalance {
  ingresoBruto: number
  costoCanchas: number
  gananciaNeta: number
  ocupacionPct: number
  netoPorHora: number
}
