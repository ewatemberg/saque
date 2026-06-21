import { supabase } from '../lib/supabase'
import type {
  Alumno,
  Cancha,
  Categoria,
  Deporte,
  Franja,
  Gasto,
  HistoricoMes,
  EstadoCobranza,
  EstadoTurno,
  ItemCobranza,
  MetodoPago,
  MetricasAdmin,
  PerfilPublico,
  ResumenBalance,
  ResumenMes,
  TipoAlumno,
  Turno,
  TurnoPublico,
} from '../types'
import { iniciales } from '../lib/format'
import {
  calcularResumenHoy,
  calcularResumenMes,
  estadoCuota,
  proximoMes,
  type NuevaCancha,
  type NuevaFranja,
  type NuevoAlumno,
  type NuevoTurno,
  type ResultadoGeneracion,
} from './mock'

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
    fecha: (row.fecha as string) ?? '',
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

export async function getTurnosRango(desde: string, hasta: string): Promise<Turno[]> {
  const { data, error } = await db()
    .from('turnos')
    .select(SELECT_TURNO)
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha')
    .order('hora')
  if (error) throw error
  return (data ?? []).map((r) => mapTurno(r as Record<string, unknown>))
}

export async function getTurno(id: string): Promise<Turno | null> {
  const { data, error } = await db().from('turnos').select(SELECT_TURNO).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapTurno(data as Record<string, unknown>) : null
}

export async function getTurnosPublicos(profeId: string, desde: string, hasta: string): Promise<TurnoPublico[]> {
  const { data, error } = await db().rpc('turnos_publicos', { p_profe: profeId, p_desde: desde, p_hasta: hasta })
  if (error) throw error
  return ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    fecha: r.fecha as string,
    hora: r.hora as string,
    canchaNombre: r.cancha_nombre as string,
    categoria: r.categoria as Categoria,
    cupos: r.cupos as number,
    ocupados: r.ocupados as number,
  }))
}

export async function getMetricasAdmin(): Promise<MetricasAdmin> {
  const { data, error } = await db().rpc('admin_metricas')
  if (error) throw error
  return data as MetricasAdmin
}

export async function eliminarProfe(id: string): Promise<void> {
  const { error } = await db().rpc('admin_eliminar_profe', { p_id: id })
  if (error) throw error
}

export async function getPerfilPublico(profeId: string): Promise<PerfilPublico | null> {
  const { data, error } = await db().rpc('perfil_publico', { p_profe: profeId })
  if (error) throw error
  const r = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined
  if (!r) return null
  const dep = r.deporte as string | null
  return {
    nombre: (r.nombre as string) ?? '',
    whatsapp: (r.whatsapp as string) ?? '',
    deporte: dep === 'padel' || dep === 'tenis' ? dep : null,
  }
}

export async function crearTurno(data: NuevoTurno): Promise<void> {
  const { data: userData } = await db().auth.getUser()
  const { error } = await db().from('turnos').insert({
    profe_id: userData.user?.id ?? null,
    fecha: data.fecha,
    hora: data.hora,
    duracion_min: data.duracionMin,
    cancha_nombre: data.canchaNombre,
    categoria: data.categoria,
    precio: data.precio,
    cupos: data.cupos,
    estado: 'activo',
    costo_cancha: data.costoCancha,
  })
  if (error) throw error
}

export async function actualizarTurno(id: string, data: NuevoTurno): Promise<void> {
  const { error } = await db()
    .from('turnos')
    .update({
      fecha: data.fecha,
      hora: data.hora,
      duracion_min: data.duracionMin,
      cancha_nombre: data.canchaNombre,
      categoria: data.categoria,
      precio: data.precio,
      cupos: data.cupos,
      costo_cancha: data.costoCancha,
    })
    .eq('id', id)
  if (error) throw error
}

export async function eliminarTurno(id: string): Promise<void> {
  const { error } = await db().from('turnos').delete().eq('id', id)
  if (error) throw error
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

export async function reprogramarTurno(turnoId: string, fecha: string, hora: string): Promise<void> {
  const { error } = await db()
    .from('turnos')
    .update({ fecha, hora, estado: 'recupero' })
    .eq('id', turnoId)
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
    montoAbono: (r.monto_abono as number) ?? 0,
    activo: (r.activo as boolean | null) ?? true,
  }))
}

export async function getCobranzas(): Promise<{ resumen: ResumenMes; items: ItemCobranza[] }> {
  const { data, error } = await db()
    .from('cuotas')
    .select('*, alumnos(telefono)')
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
    telefono: (r.alumnos as { telefono?: string } | null)?.telefono ?? undefined,
  }))
  return { resumen: calcularResumenMes(items), items }
}

export async function getConteos(
  deporte?: Deporte,
): Promise<{ canchas: number; alumnos: number; franjas: number }> {
  let cq = db().from('canchas').select('id', { count: 'exact', head: true })
  if (deporte) cq = cq.eq('deporte', deporte)
  const [c, a, f] = await Promise.all([
    cq,
    db().from('alumnos').select('id', { count: 'exact', head: true }),
    db().from('franjas').select('id', { count: 'exact', head: true }),
  ])
  return { canchas: c.count ?? 0, alumnos: a.count ?? 0, franjas: f.count ?? 0 }
}

export async function getCanchas(deporte?: Deporte): Promise<Cancha[]> {
  let q = db().from('canchas').select('*').order('nombre')
  if (deporte) q = q.eq('deporte', deporte)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    direccion: r.direccion ?? '',
    contacto: r.contacto ?? '',
    costoPorHora: r.costo_por_hora,
    deporte: (r.deporte as Deporte) ?? 'padel',
  }))
}

export async function getCancha(id: string): Promise<Cancha | null> {
  const { data: r, error } = await db().from('canchas').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!r) return null
  return {
    id: r.id,
    nombre: r.nombre,
    direccion: r.direccion ?? '',
    contacto: r.contacto ?? '',
    costoPorHora: r.costo_por_hora,
    deporte: (r.deporte as Deporte) ?? 'padel',
  }
}

export async function crearCancha(data: NuevaCancha, deporte: Deporte): Promise<void> {
  const { data: userData } = await db().auth.getUser()
  const { error } = await db().from('canchas').insert({
    profe_id: userData.user?.id ?? null,
    nombre: data.nombre,
    direccion: data.direccion,
    contacto: data.contacto,
    costo_por_hora: data.costoPorHora,
    deporte,
  })
  if (error) throw error
}

export async function actualizarCancha(id: string, data: NuevaCancha): Promise<void> {
  const { error } = await db()
    .from('canchas')
    .update({
      nombre: data.nombre,
      direccion: data.direccion,
      contacto: data.contacto,
      costo_por_hora: data.costoPorHora,
    })
    .eq('id', id)
  if (error) throw error
}

// --- Franjas recurrentes ---

function mapFranja(r: Record<string, unknown>): Franja {
  const ids = r.alumno_ids
  return {
    id: r.id as string,
    diaSemana: r.dia_semana as number,
    hora: r.hora as string,
    duracionMin: r.duracion_min as number,
    canchaNombre: r.cancha_nombre as string,
    categoria: r.categoria as Categoria,
    precio: r.precio as number,
    cupos: r.cupos as number,
    costoCancha: r.costo_cancha as number,
    permanente: r.permanente as boolean,
    alumnoIds: Array.isArray(ids) ? (ids as string[]) : [],
  }
}

function franjaRow(data: NuevaFranja) {
  return {
    dia_semana: data.diaSemana,
    hora: data.hora,
    duracion_min: data.duracionMin,
    cancha_nombre: data.canchaNombre,
    categoria: data.categoria,
    precio: data.precio,
    cupos: data.cupos,
    costo_cancha: data.costoCancha,
    permanente: data.permanente,
    alumno_ids: data.alumnoIds,
  }
}

export async function getFranjas(): Promise<Franja[]> {
  const { data, error } = await db().from('franjas').select('*').order('dia_semana').order('hora')
  if (error) throw error
  return (data ?? []).map((r) => mapFranja(r as Record<string, unknown>))
}

export async function getFranja(id: string): Promise<Franja | null> {
  const { data, error } = await db().from('franjas').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapFranja(data as Record<string, unknown>) : null
}

export async function crearFranja(data: NuevaFranja): Promise<void> {
  const { data: u } = await db().auth.getUser()
  const { error } = await db()
    .from('franjas')
    .insert({ ...franjaRow(data), profe_id: u.user?.id ?? null })
  if (error) throw error
}

export async function actualizarFranja(id: string, data: NuevaFranja): Promise<void> {
  const { error } = await db().from('franjas').update(franjaRow(data)).eq('id', id)
  if (error) throw error
}

export async function eliminarFranja(id: string): Promise<void> {
  const { error } = await db().from('franjas').delete().eq('id', id)
  if (error) throw error
}

function fechasDelMes(anio: number, mes: number, diaSemana: number): string[] {
  const res: string[] = []
  const d = new Date(anio, mes, 1)
  while (d.getMonth() === mes) {
    if (d.getDay() === diaSemana) {
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dia = String(d.getDate()).padStart(2, '0')
      res.push(`${d.getFullYear()}-${m}-${dia}`)
    }
    d.setDate(d.getDate() + 1)
  }
  return res
}

export async function generarTurnosDelMes(sobrescribir: boolean): Promise<ResultadoGeneracion> {
  const { anio, mes } = proximoMes()
  const fin = new Date(anio, mes + 1, 0).getDate()
  const mm = String(mes + 1).padStart(2, '0')
  const desde = `${anio}-${mm}-01`
  const hasta = `${anio}-${mm}-${String(fin).padStart(2, '0')}`

  const { data: u } = await db().auth.getUser()
  const profeId = u.user?.id ?? null

  const [{ data: franjas, error: e1 }, { data: alumnos, error: e2 }, { data: existentes, error: e3 }] =
    await Promise.all([
      db().from('franjas').select('*'),
      db().from('alumnos').select('id,iniciales'),
      db().from('turnos').select('id,fecha,hora,cancha_nombre').gte('fecha', desde).lte('fecha', hasta),
    ])
  if (e1) throw e1
  if (e2) throw e2
  if (e3) throw e3

  const inicialesPorId = new Map((alumnos ?? []).map((a) => [a.id as string, a.iniciales as string]))
  const idPorClave = new Map<string, string>()
  for (const t of existentes ?? []) {
    idPorClave.set(`${t.fecha}|${t.hora}|${t.cancha_nombre}`, t.id as string)
  }

  let conflictos = 0
  const aBorrar: string[] = []
  const aInsertar: { row: Record<string, unknown>; clave: string; alumnoIds: string[] }[] = []

  for (const fr of (franjas ?? []).map((r) => mapFranja(r as Record<string, unknown>))) {
    for (const fecha of fechasDelMes(anio, mes, fr.diaSemana)) {
      const clave = `${fecha}|${fr.hora}|${fr.canchaNombre}`
      if (idPorClave.has(clave)) {
        if (!sobrescribir) {
          conflictos++
          continue
        }
        aBorrar.push(idPorClave.get(clave) as string)
      }
      aInsertar.push({
        clave,
        alumnoIds: fr.alumnoIds,
        row: {
          profe_id: profeId,
          fecha,
          hora: fr.hora,
          duracion_min: fr.duracionMin,
          cancha_nombre: fr.canchaNombre,
          categoria: fr.categoria,
          precio: fr.precio,
          cupos: fr.cupos,
          estado: 'activo',
          costo_cancha: fr.costoCancha,
        },
      })
    }
  }

  if (aBorrar.length > 0) {
    const { error } = await db().from('turnos').delete().in('id', aBorrar)
    if (error) throw error
  }
  if (aInsertar.length === 0) return { creados: 0, conflictos }

  const { data: insertados, error: eIns } = await db()
    .from('turnos')
    .insert(aInsertar.map((x) => x.row))
    .select('id,fecha,hora,cancha_nombre')
  if (eIns) throw eIns

  const rosterPorClave = new Map(aInsertar.map((x) => [x.clave, x.alumnoIds]))
  const inscripciones: Record<string, unknown>[] = []
  for (const t of insertados ?? []) {
    const clave = `${t.fecha}|${t.hora}|${t.cancha_nombre}`
    for (const aid of rosterPorClave.get(clave) ?? []) {
      inscripciones.push({ turno_id: t.id, alumno_id: aid, iniciales: inicialesPorId.get(aid) ?? '' })
    }
  }
  if (inscripciones.length > 0) {
    const { error } = await db().from('inscripciones').insert(inscripciones)
    if (error) throw error
  }

  return { creados: aInsertar.length, conflictos }
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
    monto_abono: data.montoAbono,
  })
  if (error) throw error
}

export async function getAlumno(id: string): Promise<Alumno | null> {
  const { data: r, error } = await db().from('alumnos').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!r) return null
  return {
    id: r.id,
    nombre: r.nombre,
    iniciales: r.iniciales,
    categoria: r.categoria as Categoria,
    telefono: r.telefono,
    tipo: r.tipo as TipoAlumno,
    montoAbono: (r.monto_abono as number) ?? 0,
    activo: (r.activo as boolean | null) ?? true,
  }
}

export async function setActivoAlumno(id: string, activo: boolean): Promise<void> {
  const { error } = await db().from('alumnos').update({ activo }).eq('id', id)
  if (error) throw error
}

export async function actualizarAlumno(id: string, data: NuevoAlumno): Promise<void> {
  const { error } = await db()
    .from('alumnos')
    .update({
      nombre: data.nombre,
      iniciales: iniciales(data.nombre),
      categoria: data.categoria,
      telefono: data.telefono,
      tipo: data.tipo,
      monto_abono: data.montoAbono,
    })
    .eq('id', id)
  if (error) throw error
}

export async function eliminarAlumno(id: string): Promise<void> {
  const { error } = await db().from('alumnos').delete().eq('id', id)
  if (error) throw error
}

export async function generarAbonosDelMes(montoDefault: number): Promise<number> {
  const periodo = periodoActual()
  const { data: userData } = await db().auth.getUser()
  const profeId = userData.user?.id ?? null

  const [{ data: fijos, error: e1 }, { data: cuotas, error: e2 }] = await Promise.all([
    db().from('alumnos').select('id,nombre,iniciales,monto_abono').eq('tipo', 'fijo').eq('activo', true),
    db().from('cuotas').select('alumno_id').eq('periodo', periodo),
  ])
  if (e1) throw e1
  if (e2) throw e2

  const conCuota = new Set((cuotas ?? []).map((c) => c.alumno_id))
  const nuevas = (fijos ?? [])
    .filter((a) => !conCuota.has(a.id))
    .map((a) => ({
      profe_id: profeId,
      alumno_id: a.id,
      nombre: a.nombre,
      iniciales: a.iniciales,
      detalle: 'Abono mensual',
      periodo,
      estado: 'debe',
      monto_esperado: (a.monto_abono as number) > 0 ? a.monto_abono : montoDefault,
      monto_pagado: 0,
    }))
  if (nuevas.length === 0) return 0
  const { error } = await db().from('cuotas').insert(nuevas)
  if (error) throw error
  return nuevas.length
}

export async function getCuota(id: string): Promise<ItemCobranza | null> {
  const { data: r, error } = await db()
    .from('cuotas')
    .select('*, alumnos(telefono)')
    .eq('id', id)
    .maybeSingle()
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
    telefono: (r.alumnos as { telefono?: string } | null)?.telefono ?? undefined,
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

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export async function getHistorico(meses = 6): Promise<HistoricoMes[]> {
  const now = new Date()
  const inicio = new Date(now.getFullYear(), now.getMonth() - (meses - 1), 1)
  const desde = `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, '0')}-01`
  const periodoDesde = desde.slice(0, 7)

  const [{ data: cuotas, error: e1 }, { data: turnos, error: e2 }, { data: gastosRows, error: e3 }] =
    await Promise.all([
      db().from('cuotas').select('periodo,monto_pagado').gte('periodo', periodoDesde),
      db().from('turnos').select('fecha,costo_cancha,estado').gte('fecha', desde),
      db().from('gastos').select('fecha,monto').gte('fecha', desde),
    ])
  if (e1) throw e1
  if (e2) throw e2
  if (e3) throw e3

  const cobradoPorMes = new Map<string, number>()
  for (const c of cuotas ?? []) {
    cobradoPorMes.set(c.periodo, (cobradoPorMes.get(c.periodo) ?? 0) + (c.monto_pagado as number))
  }
  const costoPorMes = new Map<string, number>()
  for (const t of turnos ?? []) {
    if (t.estado === 'suspendido') continue
    const per = (t.fecha as string).slice(0, 7)
    costoPorMes.set(per, (costoPorMes.get(per) ?? 0) + (t.costo_cancha as number))
  }
  const gastosPorMes = new Map<string, number>()
  for (const g of gastosRows ?? []) {
    const per = (g.fecha as string).slice(0, 7)
    gastosPorMes.set(per, (gastosPorMes.get(per) ?? 0) + (g.monto as number))
  }

  const res: HistoricoMes[] = []
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const periodo = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const cobrado = cobradoPorMes.get(periodo) ?? 0
    const costo = (costoPorMes.get(periodo) ?? 0) + (gastosPorMes.get(periodo) ?? 0)
    res.push({ periodo, etiqueta: MESES_CORTOS[d.getMonth()], cobrado, costo, neto: cobrado - costo })
  }
  return res
}

export async function getBalance(): Promise<ResumenBalance> {
  const { desde, hasta } = rangoMes()

  const [{ data: turnos, error: e1 }, { data: cuotas, error: e2 }, { data: gastosMes, error: e3 }] =
    await Promise.all([
      db()
        .from('turnos')
        .select('precio,cupos,duracion_min,estado,costo_cancha,inscripciones(id)')
        .gte('fecha', desde)
        .lte('fecha', hasta),
      db().from('cuotas').select('monto_pagado').eq('periodo', periodoActual()),
      db().from('gastos').select('monto').gte('fecha', desde).lte('fecha', hasta),
    ])
  if (e1) throw e1
  if (e2) throw e2
  if (e3) throw e3

  const activos = (turnos ?? []).filter((t) => t.estado !== 'suspendido')
  const ingresoBruto = (cuotas ?? []).reduce((s, c) => s + (c.monto_pagado as number), 0)
  const costoCanchas = activos.reduce((s, t) => s + (t.costo_cancha as number), 0)
  const gastos = (gastosMes ?? []).reduce((s, g) => s + (g.monto as number), 0)
  const horas = activos.reduce((s, t) => s + (t.duracion_min as number), 0) / 60

  let ocupacionAcum = 0
  for (const t of activos) {
    const inscriptos = ((t.inscripciones as unknown[] | null) ?? []).length
    const cupos = (t.cupos as number) || 1
    ocupacionAcum += inscriptos / cupos
  }
  const ocupacionPct = activos.length ? Math.round((ocupacionAcum / activos.length) * 100) : 0
  const gananciaNeta = ingresoBruto - costoCanchas - gastos

  return {
    ingresoBruto,
    costoCanchas,
    gastos,
    gananciaNeta,
    ocupacionPct,
    netoPorHora: horas ? Math.round(gananciaNeta / horas) : 0,
  }
}

export async function getGastos(): Promise<Gasto[]> {
  const { data, error } = await db().from('gastos').select('*').order('fecha', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    concepto: r.concepto,
    cantidad: (r.cantidad as number | null) ?? null,
    monto: r.monto,
    fecha: r.fecha,
  }))
}

export async function crearGasto(data: Omit<Gasto, 'id'>): Promise<void> {
  const { data: userData } = await db().auth.getUser()
  const { error } = await db().from('gastos').insert({
    profe_id: userData.user?.id ?? null,
    concepto: data.concepto,
    cantidad: data.cantidad,
    monto: data.monto,
    fecha: data.fecha,
  })
  if (error) throw error
}

export async function eliminarGasto(id: string): Promise<void> {
  const { error } = await db().from('gastos').delete().eq('id', id)
  if (error) throw error
}
