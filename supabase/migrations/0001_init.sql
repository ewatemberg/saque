-- Esquema inicial de Saque
-- Ejecutar en el SQL Editor de Supabase. Ver docs/06-supabase-setup.md.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

create table if not exists public.canchas (
  id uuid primary key default gen_random_uuid(),
  profe_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null,
  costo_por_hora integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.alumnos (
  id uuid primary key default gen_random_uuid(),
  profe_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null,
  iniciales text not null default '',
  categoria text not null default '5ta',
  telefono text not null default '',
  tipo text not null default 'fijo' check (tipo in ('fijo', 'ocasional')),
  created_at timestamptz not null default now()
);

create table if not exists public.turnos (
  id uuid primary key default gen_random_uuid(),
  profe_id uuid not null references auth.users (id) on delete cascade,
  cancha_nombre text not null default '',
  fecha date not null,
  hora text not null,
  duracion_min integer not null default 60,
  categoria text not null default '5ta',
  precio integer not null default 0,
  cupos integer not null default 4,
  estado text not null default 'activo' check (estado in ('activo', 'suspendido', 'recupero')),
  costo_cancha integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  turno_id uuid not null references public.turnos (id) on delete cascade,
  alumno_id uuid not null references public.alumnos (id) on delete cascade,
  iniciales text not null default '',
  asistio boolean not null default false,
  created_at timestamptz not null default now(),
  unique (turno_id, alumno_id)
);

-- Cuota / item de cobranza del mes (abono mensual o paquete)
create table if not exists public.cuotas (
  id uuid primary key default gen_random_uuid(),
  profe_id uuid not null references auth.users (id) on delete cascade,
  alumno_id uuid not null references public.alumnos (id) on delete cascade,
  nombre text not null default '',
  iniciales text not null default '',
  detalle text not null default '',
  periodo text not null, -- formato YYYY-MM
  estado text not null default 'debe' check (estado in ('pagado', 'debe', 'parcial', 'paquete')),
  monto_esperado integer not null default 0,
  monto_pagado integer not null default 0,
  metodo text check (metodo in ('mercadopago', 'transferencia', 'efectivo')),
  clases_restantes integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_turnos_profe_fecha on public.turnos (profe_id, fecha);
create index if not exists idx_cuotas_profe_periodo on public.cuotas (profe_id, periodo);
create index if not exists idx_inscripciones_turno on public.inscripciones (turno_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: cada profe ve y maneja solo sus datos
-- ---------------------------------------------------------------------------

alter table public.canchas enable row level security;
alter table public.alumnos enable row level security;
alter table public.turnos enable row level security;
alter table public.inscripciones enable row level security;
alter table public.cuotas enable row level security;

drop policy if exists "canchas_propias" on public.canchas;
create policy "canchas_propias" on public.canchas
  for all using (auth.uid() = profe_id) with check (auth.uid() = profe_id);

drop policy if exists "alumnos_propios" on public.alumnos;
create policy "alumnos_propios" on public.alumnos
  for all using (auth.uid() = profe_id) with check (auth.uid() = profe_id);

drop policy if exists "turnos_propios" on public.turnos;
create policy "turnos_propios" on public.turnos
  for all using (auth.uid() = profe_id) with check (auth.uid() = profe_id);

drop policy if exists "cuotas_propias" on public.cuotas;
create policy "cuotas_propias" on public.cuotas
  for all using (auth.uid() = profe_id) with check (auth.uid() = profe_id);

-- Las inscripciones se controlan a traves del turno asociado
drop policy if exists "inscripciones_propias" on public.inscripciones;
create policy "inscripciones_propias" on public.inscripciones
  for all using (
    exists (select 1 from public.turnos t where t.id = turno_id and t.profe_id = auth.uid())
  ) with check (
    exists (select 1 from public.turnos t where t.id = turno_id and t.profe_id = auth.uid())
  );
