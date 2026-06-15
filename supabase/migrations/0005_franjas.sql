-- Franjas: plantillas de turnos recurrentes (ej: "todos los martes 19hs en
-- Cancha 1"). De cada franja se generan los turnos del mes. La franja guarda su
-- roster de alumnos fijos para pre-cargarlos en los turnos generados.
-- Ejecutar en el SQL Editor de Supabase.

create table if not exists public.franjas (
  id uuid primary key default gen_random_uuid(),
  profe_id uuid not null references auth.users (id) on delete cascade,
  dia_semana integer not null,                 -- 0=Domingo .. 6=Sábado
  hora text not null,
  duracion_min integer not null default 60,
  cancha_nombre text not null default '',
  categoria text not null default '5ta',
  precio integer not null default 0,
  cupos integer not null default 4,
  costo_cancha integer not null default 0,
  permanente boolean not null default true,
  alumno_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_franjas_profe on public.franjas (profe_id);

alter table public.franjas enable row level security;

drop policy if exists "franjas_propias" on public.franjas;
create policy "franjas_propias" on public.franjas
  for all using (auth.uid() = profe_id) with check (auth.uid() = profe_id);
