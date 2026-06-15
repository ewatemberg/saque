import type {
  Alumno,
  Cancha,
  Categoria,
  Deporte,
  EstadoCobranza,
  ItemCobranza,
  MetodoPago,
  ResumenBalance,
  ResumenMes,
  TipoAlumno,
  Turno,
} from '../types'
import { iniciales } from '../lib/format'

export interface NuevoAlumno {
  nombre: string
  telefono: string
  categoria: Categoria
  tipo: TipoAlumno
}

export interface NuevaCancha {
  nombre: string
  direccion: string
  contacto: string
  costoPorHora: number
}

// Implementacion con datos de ejemplo. Se usa cuando no hay credenciales de
// Supabase configuradas (ver src/data/repo.ts). Las mutaciones modifican los
// arreglos en memoria (se pierden al recargar; es solo para desarrollo).

const COSTO_CANCHA = 12000
const PRECIO_TURNO = 6000

const turnos: Turno[] = [
  {
    id: 't1',
    hora: '18:00',
    duracionMin: 60,
    canchaNombre: 'Cancha 1',
    categoria: '4ta',
    precio: PRECIO_TURNO,
    cupos: 4,
    inscriptos: [
      { alumnoId: 'a1', iniciales: 'JD', nombre: 'Juan Díaz', asistio: true },
      { alumnoId: 'a2', iniciales: 'MR', nombre: 'María Ruiz', asistio: true },
      { alumnoId: 'a3', iniciales: 'PL', nombre: 'Pedro López', asistio: false },
      { alumnoId: 'a4', iniciales: 'SF', nombre: 'Sofía Fernández', asistio: false },
    ],
    estado: 'activo',
    costoCancha: COSTO_CANCHA,
  },
  {
    id: 't2',
    hora: '19:00',
    duracionMin: 60,
    canchaNombre: 'Cancha 1',
    categoria: '5ta',
    precio: PRECIO_TURNO,
    cupos: 4,
    inscriptos: [
      { alumnoId: 'a5', iniciales: 'AB', nombre: 'Ana Bravo', asistio: false },
      { alumnoId: 'a6', iniciales: 'CD', nombre: 'Carlos Díaz', asistio: false },
      { alumnoId: 'a7', iniciales: 'EF', nombre: 'Elena Funes', asistio: false },
    ],
    estado: 'activo',
    costoCancha: COSTO_CANCHA,
  },
  {
    id: 't3',
    hora: '20:00',
    duracionMin: 60,
    canchaNombre: 'Cancha 2',
    categoria: '6ta',
    precio: PRECIO_TURNO,
    cupos: 4,
    inscriptos: [],
    estado: 'suspendido',
    costoCancha: COSTO_CANCHA,
  },
  {
    id: 't4',
    hora: '21:00',
    duracionMin: 60,
    canchaNombre: 'Cancha 2',
    categoria: '3ra',
    precio: PRECIO_TURNO,
    cupos: 4,
    inscriptos: [
      { alumnoId: 'a8', iniciales: 'GH', nombre: 'Gastón Haedo', asistio: false },
      { alumnoId: 'a9', iniciales: 'IJ', nombre: 'Inés Juárez', asistio: false },
    ],
    estado: 'activo',
    costoCancha: 14000, // cancha 2 mas cara: con 2 alumnos no cubre el alquiler
  },
]

const cobranzas: ItemCobranza[] = [
  { id: 'c1', alumnoId: 'a1', nombre: 'Juan Díaz', iniciales: 'JD', detalle: 'Abono · mar 19h', estado: 'pagado', montoEsperado: 25000, montoPagado: 25000, metodo: 'mercadopago' },
  { id: 'c2', alumnoId: 'a2', nombre: 'María Ruiz', iniciales: 'MR', detalle: 'Abono · jue 18h', estado: 'pagado', montoEsperado: 25000, montoPagado: 25000, metodo: 'transferencia' },
  { id: 'c3', alumnoId: 'a3', nombre: 'Pedro López', iniciales: 'PL', detalle: 'Abono · mar 19h', estado: 'debe', montoEsperado: 25000, montoPagado: 0 },
  { id: 'c4', alumnoId: 'a4', nombre: 'Sofía Fernández', iniciales: 'SF', detalle: 'Abono · sáb 10h', estado: 'parcial', montoEsperado: 25000, montoPagado: 12000, metodo: 'efectivo' },
  { id: 'c5', alumnoId: 'a10', nombre: 'Lucas Pérez', iniciales: 'LP', detalle: 'Abono · vie 20h', estado: 'debe', montoEsperado: 25000, montoPagado: 0 },
  { id: 'c6', alumnoId: 'a11', nombre: 'Caro Méndez', iniciales: 'CM', detalle: 'Paquete · ocasional', estado: 'paquete', montoEsperado: 0, montoPagado: 0, clasesRestantes: 3 },
]

const canchas: Cancha[] = [
  { id: 'k1', nombre: 'Cancha 1', direccion: 'Club Norte, Av. Siempreviva 123', contacto: '+5491100000100', costoPorHora: 12000, deporte: 'padel' },
  { id: 'k2', nombre: 'Cancha 2', direccion: 'Club Norte, Av. Siempreviva 123', contacto: '+5491100000100', costoPorHora: 14000, deporte: 'padel' },
]

const alumnos: Alumno[] = [
  { id: 'a1', nombre: 'Juan Díaz', iniciales: 'JD', categoria: '4ta', telefono: '+5491100000001', tipo: 'fijo' },
  { id: 'a2', nombre: 'María Ruiz', iniciales: 'MR', categoria: '5ta', telefono: '+5491100000002', tipo: 'fijo' },
  { id: 'a3', nombre: 'Pedro López', iniciales: 'PL', categoria: '4ta', telefono: '+5491100000003', tipo: 'fijo' },
  { id: 'a4', nombre: 'Sofía Fernández', iniciales: 'SF', categoria: '6ta', telefono: '+5491100000004', tipo: 'fijo' },
  { id: 'a10', nombre: 'Lucas Pérez', iniciales: 'LP', categoria: '3ra', telefono: '+5491100000010', tipo: 'fijo' },
  { id: 'a11', nombre: 'Caro Méndez', iniciales: 'CM', categoria: '5ta', telefono: '+5491100000011', tipo: 'ocasional' },
]

export function calcularResumenMes(items: ItemCobranza[]): ResumenMes {
  const abonos = items.filter((i) => i.estado !== 'paquete')
  const esperado = abonos.reduce((s, i) => s + i.montoEsperado, 0)
  const cobrado = abonos.reduce((s, i) => s + i.montoPagado, 0)
  const deudores = abonos.filter((i) => i.estado === 'debe').length
  return { esperado, cobrado, falta: esperado - cobrado, deudores }
}

export function calcularResumenHoy(lista: Turno[]) {
  const activos = lista.filter((t) => t.estado === 'activo')
  const alumnosHoy = activos.reduce((s, t) => s + t.inscriptos.length, 0)
  const ingreso = activos.reduce((s, t) => s + t.precio * t.inscriptos.length, 0)
  const costo = activos.reduce((s, t) => s + t.costoCancha, 0)
  return { turnos: lista.length, alumnos: alumnosHoy, netoDia: ingreso - costo }
}

const balanceMes: ResumenBalance = {
  ingresoBruto: 240000,
  costoCanchas: 96000,
  gananciaNeta: 144000,
  ocupacionPct: 78,
  netoPorHora: 9000,
}

function clonar(t: Turno): Turno {
  return { ...t, inscriptos: t.inscriptos.map((i) => ({ ...i })) }
}

export async function getTurnosHoy(): Promise<Turno[]> {
  return turnos.map(clonar)
}

export async function getResumenHoy() {
  return calcularResumenHoy(turnos)
}

export async function getTurno(id: string): Promise<Turno | null> {
  const t = turnos.find((x) => x.id === id)
  return t ? clonar(t) : null
}

export async function marcarAsistencia(turnoId: string, alumnoId: string, asistio: boolean): Promise<void> {
  const t = turnos.find((x) => x.id === turnoId)
  const i = t?.inscriptos.find((x) => x.alumnoId === alumnoId)
  if (i) i.asistio = asistio
}

export async function darDeBaja(turnoId: string, alumnoId: string): Promise<void> {
  const t = turnos.find((x) => x.id === turnoId)
  if (t) t.inscriptos = t.inscriptos.filter((x) => x.alumnoId !== alumnoId)
}

export async function anotarAlumno(turnoId: string, alumnoId: string): Promise<void> {
  const t = turnos.find((x) => x.id === turnoId)
  const a = alumnos.find((x) => x.id === alumnoId)
  if (t && a && !t.inscriptos.some((i) => i.alumnoId === alumnoId)) {
    t.inscriptos.push({ alumnoId: a.id, iniciales: a.iniciales, nombre: a.nombre, asistio: false })
  }
}

export async function cambiarEstadoTurno(turnoId: string, estado: Turno['estado']): Promise<void> {
  const t = turnos.find((x) => x.id === turnoId)
  if (t) t.estado = estado
}

export function estadoCuota(esperado: number, pagado: number): EstadoCobranza {
  if (esperado > 0 && pagado >= esperado) return 'pagado'
  if (pagado > 0) return 'parcial'
  return 'debe'
}

export async function getCobranzas(): Promise<{ resumen: ResumenMes; items: ItemCobranza[] }> {
  return { resumen: calcularResumenMes(cobranzas), items: cobranzas.map((c) => ({ ...c })) }
}

export async function getCuota(id: string): Promise<ItemCobranza | null> {
  const c = cobranzas.find((x) => x.id === id)
  return c ? { ...c } : null
}

export async function registrarPago(cuotaId: string, monto: number, metodo: MetodoPago): Promise<void> {
  const c = cobranzas.find((x) => x.id === cuotaId)
  if (!c) return
  c.montoPagado += monto
  c.metodo = metodo
  if (c.estado !== 'paquete') c.estado = estadoCuota(c.montoEsperado, c.montoPagado)
}

export async function getAlumnos(): Promise<Alumno[]> {
  return alumnos
}

export async function crearAlumno(data: NuevoAlumno): Promise<void> {
  const id = `a_${alumnos.length + 1}_${Math.random().toString(36).slice(2, 7)}`
  alumnos.push({
    id,
    nombre: data.nombre,
    iniciales: iniciales(data.nombre),
    categoria: data.categoria,
    telefono: data.telefono,
    tipo: data.tipo,
  })
}

export async function getBalance(): Promise<ResumenBalance> {
  return balanceMes
}

export async function getCanchas(deporte?: Deporte): Promise<Cancha[]> {
  const lista = deporte ? canchas.filter((c) => c.deporte === deporte) : canchas
  return lista.map((c) => ({ ...c }))
}

export async function getCancha(id: string): Promise<Cancha | null> {
  const c = canchas.find((x) => x.id === id)
  return c ? { ...c } : null
}

export async function crearCancha(data: NuevaCancha, deporte: Deporte): Promise<void> {
  const id = `k_${canchas.length + 1}_${Math.random().toString(36).slice(2, 7)}`
  canchas.push({ id, ...data, deporte })
}

export async function actualizarCancha(id: string, data: NuevaCancha): Promise<void> {
  const c = canchas.find((x) => x.id === id)
  if (c) Object.assign(c, data)
}
