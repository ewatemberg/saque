import { usandoMock } from '../lib/supabase'
import * as mock from './mock'
import * as remoto from './supabaseRepo'

// Despachador: si hay credenciales de Supabase usa el backend real;
// si no, usa datos de ejemplo. Las pantallas siempre importan desde aca,
// asi no les importa de donde vienen los datos.
const impl = usandoMock ? mock : remoto

export const getTurnosHoy = impl.getTurnosHoy
export const getResumenHoy = impl.getResumenHoy
export const getTurno = impl.getTurno
export const marcarAsistencia = impl.marcarAsistencia
export const darDeBaja = impl.darDeBaja
export const anotarAlumno = impl.anotarAlumno
export const cambiarEstadoTurno = impl.cambiarEstadoTurno
export const getCobranzas = impl.getCobranzas
export const getCuota = impl.getCuota
export const registrarPago = impl.registrarPago
export const getAlumnos = impl.getAlumnos
export const crearAlumno = impl.crearAlumno
export const getBalance = impl.getBalance
export const getCanchas = impl.getCanchas
export const getCancha = impl.getCancha
export const crearCancha = impl.crearCancha
export const actualizarCancha = impl.actualizarCancha
