import type {
  Alumno,
  Cancha,
  Categoria,
  Deporte,
  EstadoCobranza,
  Franja,
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
  montoAbono: number
}

export interface NuevaCancha {
  nombre: string
  direccion: string
  contacto: string
  costoPorHora: number
}

export interface NuevoTurno {
  fecha: string
  hora: string
  duracionMin: number
  canchaNombre: string
  categoria: Categoria
  precio: number
  cupos: number
  costoCancha: number
}

export type NuevaFranja = Omit<Franja, 'id'>

export interface ResultadoGeneracion {
  creados: number
  conflictos: number
}

// Implementacion con datos de ejemplo. Se usa cuando no hay credenciales de
// Supabase configuradas (ver src/data/repo.ts). Las mutaciones modifican los
// arreglos en memoria (se pierden al recargar; es solo para desarrollo).

const COSTO_CANCHA = 12000
const PRECIO_TURNO = 6000
const HOY = new Date().toISOString().slice(0, 10)

const turnos: Turno[] = [
  {
    id: 't1',
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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

const franjas: Franja[] = [
  {
    id: 'f1',
    diaSemana: 2, // martes
    hora: '19:00',
    duracionMin: 60,
    canchaNombre: 'Cancha 1',
    categoria: '5ta',
    precio: 6000,
    cupos: 4,
    costoCancha: 12000,
    permanente: true,
    alumnoIds: ['a1', 'a2', 'a3'],
  },
]

const alumnos: Alumno[] = [
  { id: 'a1', nombre: 'Juan Díaz', iniciales: 'JD', categoria: '4ta', telefono: '+5491100000001', tipo: 'fijo', montoAbono: 25000 },
  { id: 'a2', nombre: 'María Ruiz', iniciales: 'MR', categoria: '5ta', telefono: '+5491100000002', tipo: 'fijo', montoAbono: 25000 },
  { id: 'a3', nombre: 'Pedro López', iniciales: 'PL', categoria: '4ta', telefono: '+5491100000003', tipo: 'fijo', montoAbono: 25000 },
  { id: 'a4', nombre: 'Sofía Fernández', iniciales: 'SF', categoria: '6ta', telefono: '+5491100000004', tipo: 'fijo', montoAbono: 25000 },
  { id: 'a10', nombre: 'Lucas Pérez', iniciales: 'LP', categoria: '3ra', telefono: '+5491100000010', tipo: 'fijo', montoAbono: 25000 },
  { id: 'a11', nombre: 'Caro Méndez', iniciales: 'CM', categoria: '5ta', telefono: '+5491100000011', tipo: 'ocasional', montoAbono: 0 },
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

export async function crearTurno(data: NuevoTurno): Promise<void> {
  const id = `t_${turnos.length + 1}_${Math.random().toString(36).slice(2, 7)}`
  turnos.push({ id, ...data, inscriptos: [], estado: 'activo' })
}

export async function actualizarTurno(id: string, data: NuevoTurno): Promise<void> {
  const t = turnos.find((x) => x.id === id)
  if (t) Object.assign(t, data)
}

export async function eliminarTurno(id: string): Promise<void> {
  const i = turnos.findIndex((x) => x.id === id)
  if (i >= 0) turnos.splice(i, 1)
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
    montoAbono: data.montoAbono,
  })
}

export async function getAlumno(id: string): Promise<Alumno | null> {
  const a = alumnos.find((x) => x.id === id)
  return a ? { ...a } : null
}

export async function actualizarAlumno(id: string, data: NuevoAlumno): Promise<void> {
  const a = alumnos.find((x) => x.id === id)
  if (a) {
    Object.assign(a, {
      nombre: data.nombre,
      iniciales: iniciales(data.nombre),
      categoria: data.categoria,
      telefono: data.telefono,
      tipo: data.tipo,
      montoAbono: data.montoAbono,
    })
  }
}

export async function eliminarAlumno(id: string): Promise<void> {
  const i = alumnos.findIndex((x) => x.id === id)
  if (i >= 0) alumnos.splice(i, 1)
}

export async function generarAbonosDelMes(montoDefault: number): Promise<number> {
  let creadas = 0
  for (const a of alumnos.filter((x) => x.tipo === 'fijo')) {
    if (cobranzas.some((c) => c.alumnoId === a.id)) continue
    const monto = a.montoAbono > 0 ? a.montoAbono : montoDefault
    cobranzas.push({
      id: `c_${cobranzas.length + 1}_${Math.random().toString(36).slice(2, 7)}`,
      alumnoId: a.id,
      nombre: a.nombre,
      iniciales: a.iniciales,
      detalle: 'Abono mensual',
      estado: 'debe',
      montoEsperado: monto,
      montoPagado: 0,
    })
    creadas++
  }
  return creadas
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

// --- Franjas recurrentes ---

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function fechaISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

export function proximoMes(): { anio: number; mes: number; etiqueta: string } {
  const n = new Date()
  let mes = n.getMonth() + 1
  let anio = n.getFullYear()
  if (mes > 11) {
    mes = 0
    anio += 1
  }
  return { anio, mes, etiqueta: `${MESES[mes]} ${anio}` }
}

function fechasDelMes(anio: number, mes: number, diaSemana: number): string[] {
  const res: string[] = []
  const d = new Date(anio, mes, 1)
  while (d.getMonth() === mes) {
    if (d.getDay() === diaSemana) res.push(fechaISO(d))
    d.setDate(d.getDate() + 1)
  }
  return res
}

export async function getFranjas(): Promise<Franja[]> {
  return franjas.map((f) => ({ ...f, alumnoIds: [...f.alumnoIds] }))
}

export async function getFranja(id: string): Promise<Franja | null> {
  const f = franjas.find((x) => x.id === id)
  return f ? { ...f, alumnoIds: [...f.alumnoIds] } : null
}

export async function crearFranja(data: NuevaFranja): Promise<void> {
  const id = `f_${franjas.length + 1}_${Math.random().toString(36).slice(2, 7)}`
  franjas.push({ id, ...data })
}

export async function actualizarFranja(id: string, data: NuevaFranja): Promise<void> {
  const f = franjas.find((x) => x.id === id)
  if (f) Object.assign(f, data)
}

export async function eliminarFranja(id: string): Promise<void> {
  const i = franjas.findIndex((x) => x.id === id)
  if (i >= 0) franjas.splice(i, 1)
}

export async function generarTurnosDelMes(sobrescribir: boolean): Promise<ResultadoGeneracion> {
  const { anio, mes } = proximoMes()
  let creados = 0
  let conflictos = 0
  for (const f of franjas) {
    for (const fecha of fechasDelMes(anio, mes, f.diaSemana)) {
      const idx = turnos.findIndex(
        (t) => t.fecha === fecha && t.hora === f.hora && t.canchaNombre === f.canchaNombre,
      )
      if (idx >= 0) {
        if (!sobrescribir) {
          conflictos++
          continue
        }
        turnos.splice(idx, 1)
      }
      turnos.push({
        id: `t_${turnos.length + 1}_${Math.random().toString(36).slice(2, 7)}`,
        fecha,
        hora: f.hora,
        duracionMin: f.duracionMin,
        canchaNombre: f.canchaNombre,
        categoria: f.categoria,
        precio: f.precio,
        cupos: f.cupos,
        costoCancha: f.costoCancha,
        estado: 'activo',
        inscriptos: f.alumnoIds.map((aid) => {
          const a = alumnos.find((x) => x.id === aid)
          return { alumnoId: aid, iniciales: a?.iniciales ?? '', nombre: a?.nombre ?? '', asistio: false }
        }),
      })
      creados++
    }
  }
  return { creados, conflictos }
}
