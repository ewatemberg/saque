-- Cada alumno tiene una cuota mensual (monto del abono). Se usa al generar los
-- abonos del mes. Ejecutar en el SQL Editor de Supabase.

alter table public.alumnos
  add column if not exists monto_abono integer not null default 0;
