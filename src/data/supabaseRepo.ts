import { supabase } from '../lib/supabase'
import type {
  Alumno,
  Categoria,
  EstadoCobranza,
  EstadoTurno,
  ItemCobranza,
  MetodoPago,
  ResumenBalance,
  ResumenMes,
  TipoAlumno,
  Turno,
} from '../types'
import { iniciales } from '../lib/format'
import { calcularResumenHoy, calcularResumenMes, estadoCuota, type NuevoAlumno } from './mock'

// Implementacion real contra Supabase. Solo se usa cuando hay credenciales en
// .env (ver src/data/repo.ts). Conserva las mismas firmas que el mock.

function db() {
  if (!supabase) throw new Error('Supabase no esta configurado')
  return supabase
}

function fechaHoy(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function periodoActual(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${mes}`
}

function rangoMes(): { desde: string; hasta: string } {
  const d = new Date()
  const y = d.getFullYear()
  const m = d.getMonth()
  const fin = new Date(y, m + 1, 0).getDate()
  const mes = String(m + 1).padStart(2, '0')
  return { desde: `${y}-${mes}-01`, hasta: `${y}-${mes}-${String(fin).padStart(2, '0')}` }
}

interface InscripcionRow {
  alumno_id: string
  iniciales: string
  asistio: boolean | null
  alumnos: { nombre: string } | null
}

function mapTurno(row: Record<string, unknown>): Turno {
  const inscripciones = (row.inscripciones as InscripcionRow[] | null) ?? []
  return {
    id: row.id as string,
    hora: row.hora as string,
    duracionMin: row.duracion_min as number,
    canchaNombre: row.cancha_nombre as string,
    categoria: row.categoria as Categoria,
    precio: row.precio as number,
    cupos: row.cupos as number,
    estado: row.estado as EstadoTurno,
    costoCancha: row.costo_cancha as number,
    inscriptos: inscripciones.map((i) => ({
      alumnoId: i.alumno_id,
      iniciales: i.iniciales,
      nombre: i.alumnos?.nombre ?? '',
      asistio: i.asistio ?? false,
    })),
  }
}

const SELECT_TURNO =
  'id,hora,duracion_min,cancha_nombre,categoria,precio,cupos,estado,costo_cancha,fecha,inscripciones(alumno_id,iniciales,asistio,alumnos(nombre))'

export async function getTurnosHoy(): Promise<Turno[]> {
  const { data, error } = await db()
    .from('turnos')
    .select(SELECT_TURNO)
    .eq('fecha', fechaHoy())
    .order('hora')
  if (error) throw error
  return (data ?? []).map((r) => mapTurno(r as Record<string, unknown>))
}

export async function getResumenHoy() {
  const turnos = await getTurnosHoy()
  return calcularResumenHoy(turnos)
}

export async function getTurno(id: string): Promise<Turno | null> {
  const { data, error } = await db().from('turnos').select(SELECT_TURNO).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapTurno(data as Record<string, unknown>) : null
}

export async function marcarAsistencia(turnoId: string, alumnoId: string, asistio: boolean): Promise<void> {
  const { error } = await db()
    .from('inscripciones')
    .update({ asistio })
    .eq('turno_id', turnoId)
    .eq('alumno_id', alumnoId)
  if (error) throw error
}

export async function darDeBaja(turnoId: string, alumnoId: string): Promise<void> {
  const { error } = await db()
    .from('inscripciones')
    .delete()
    .eq('turno_id', turnoId)
    .eq('alumno_id', alumnoId)
  if (error) throw error
}

export async function anotarAlumno(turnoId: string, alumnoId: string): Promise<void> {
  const { data: alumno } = await db().from('alumnos').select('iniciales').eq('id', alumnoId).maybeSingle()
  const { error } = await db()
    .from('inscripciones')
    .insert({ turno_id: turnoId, alumno_id: alumnoId, iniciales: alumno?.iniciales ?? '' })
  if (error) throw error
}

export async function cambiarEstadoTurno(turnoId: string, estado: EstadoTurno): Promise<void> {
  const { error } = await db().from('turnos').update({ estado }).eq('id', turnoId)
  if (error) throw error
}

export async function getAlumnos(): Promise<Alumno[]> {
  const { data, error } = await db().from('alumnos').select('*').order('nombre')
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    iniciales: r.iniciales,
    categoria: r.categoria as Categoria,
    telefono: r.telefono,
    tipo: r.tipo as TipoAlumno,
  }))
}

export async function getCobranzas(): Promise<{ resumen: ResumenMes; items: ItemCobranza[] }> {
  const { data, error } = await db()
    .from('cuotas')
    .select('*')
    .eq('periodo', periodoActual())
    .order('nombre')
  if (error) throw error
  const items: ItemCobranza[] = (data ?? []).map((r) => ({
    id: r.id,
    alumnoId: r.alumno_id,
    nombre: r.nombre,
    iniciales: r.iniciales,
    detalle: r.detalle,
    estado: r.estado as EstadoCobranza,
    montoEsperado: r.monto_esperado,
    montoPagado: r.monto_pagado,
    metodo: (r.metodo as MetodoPago | null) ?? undefined,
    clasesRestantes: (r.clases_restantes as number | null) ?? undefined,
  }))
  return { resumen: calcularResumenMes(items), items }
}

export async function crearAlumno(data: NuevoAlumno): Promise<void> {
  const { data: userData } = await db().auth.getUser()
  const profeId = userData.user?.id
  if (!profeId) throw new Error('No hay sesión activa')
  const { error } = await db().from('alumnos').insert({
    profe_id: profeId,
    nombre: data.nombre,
    iniciales: iniciales(data.nombre),
    categoria: data.categoria,
    telefono: data.telefono,
    tipo: data.tipo,
  })
  if (error) throw error
}

export async function getCuota(id: string): Promise<ItemCobranza | null> {
  const { data: r, error } = await db().from('cuotas').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!r) return null
  return {
    id: r.id,
    alumnoId: r.alumno_id,
    nombre: r.nombre,
    iniciales: r.iniciales,
    detalle: r.detalle,
    estado: r.estado as EstadoCobranza,
    montoEsperado: r.monto_esperado,
    montoPagado: r.monto_pagado,
    metodo: (r.metodo as MetodoPago | null) ?? undefined,
    clasesRestantes: (r.clases_restantes as number | null) ?? undefined,
  }
}

export async function registrarPago(cuotaId: string, monto: number, metodo: MetodoPago): Promise<void> {
  const { data: r, error } = await db()
    .from('cuotas')
    .select('monto_esperado,monto_pagado,estado')
    .eq('id', cuotaId)
    .maybeSingle()
  if (error) throw error
  if (!r) return
  const nuevoPagado = (r.monto_pagado as number) + monto
  const estado =
    r.estado === 'paquete' ? 'paquete' : estadoCuota(r.monto_esperado as number, nuevoPagado)
  const { error: e2 } = await db()
    .from('cuotas')
    .update({ monto_pagado: nuevoPagado, metodo, estado })
    .eq('id', cuotaId)
  if (e2) throw e2
}

export async function getBalance(): Promise<ResumenBalance> {
  const { desde, hasta } = rangoMes()

  const [{ data: turnos, error: e1 }, { data: cuotas, error: e2 }] = await Promise.all([
    db()
      .from('turnos')
      .select('precio,cupos,duracion_min,estado,costo_cancha,inscripciones(id)')
      .gte('fecha', desde)
      .lte('fecha', hasta),
    db().from('cuotas').select('monto_pagado').eq('periodo', periodoActual()),
  ])
  if (e1) throw e1
  if (e2) throw e2

  const activos = (turnos ?? []).filter((t) => t.estado === 'activo')
  const ingresoBruto = (cuotas ?? []).reduce((s, c) => s + (c.monto_pagado as number), 0)
  const costoCanchas = activos.reduce((s, t) => s + (t.costo_cancha as number), 0)
  const horas = activos.reduce((s, t) => s + (t.duracion_min as number), 0) / 60

  let ocupacionAcum = 0
  for (const t of activos) {
    const inscriptos = ((t.inscripciones as unknown[] | null) ?? []).length
    const cupos = (t.cupos as number) || 1
    ocupacionAcum += inscriptos / cupos
  }
  const ocupacionPct = activos.length ? Math.round((ocupacionAcum / activos.length) * 100) : 0
  const gananciaNeta = ingresoBruto - costoCanchas

  return {
    ingresoBruto,
    costoCanchas,
    gananciaNeta,
    ocupacionPct,
    netoPorHora: horas ? Math.round(gananciaNeta / horas) : 0,
  }
}
