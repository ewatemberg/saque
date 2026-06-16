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
export const getTurnosRango = impl.getTurnosRango
export const crearTurno = impl.crearTurno
export const actualizarTurno = impl.actualizarTurno
export const eliminarTurno = impl.eliminarTurno
export const marcarAsistencia = impl.marcarAsistencia
export const darDeBaja = impl.darDeBaja
export const anotarAlumno = impl.anotarAlumno
export const cambiarEstadoTurno = impl.cambiarEstadoTurno
export const getCobranzas = impl.getCobranzas
export const getCuota = impl.getCuota
export const registrarPago = impl.registrarPago
export const getAlumnos = impl.getAlumnos
export const getAlumno = impl.getAlumno
export const crearAlumno = impl.crearAlumno
export const actualizarAlumno = impl.actualizarAlumno
export const eliminarAlumno = impl.eliminarAlumno
export const generarAbonosDelMes = impl.generarAbonosDelMes
export const getBalance = impl.getBalance
export const getHistorico = impl.getHistorico
export const getConteos = impl.getConteos
export const getCanchas = impl.getCanchas
export const getCancha = impl.getCancha
export const crearCancha = impl.crearCancha
export const actualizarCancha = impl.actualizarCancha
export const getFranjas = impl.getFranjas
export const getFranja = impl.getFranja
export const crearFranja = impl.crearFranja
export const actualizarFranja = impl.actualizarFranja
export const eliminarFranja = impl.eliminarFranja
export const generarTurnosDelMes = impl.generarTurnosDelMes
export { proximoMes } from './mock'
