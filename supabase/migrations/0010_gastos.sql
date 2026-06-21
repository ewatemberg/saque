-- Gastos / insumos del profe (pelotas, grips, etc.). Se descuentan del balance.

create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  profe_id uuid not null references auth.users (id) on delete cascade,
  concepto text not null default 'Pelotas',
  cantidad integer,
  monto integer not null default 0,
  fecha date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_gastos_profe_fecha on public.gastos (profe_id, fecha desc);

alter table public.gastos enable row level security;

drop policy if exists "gastos_propios" on public.gastos;
create policy "gastos_propios" on public.gastos
  for all using (auth.uid() = profe_id) with check (auth.uid() = profe_id);
