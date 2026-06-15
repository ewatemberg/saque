-- Las canchas pasan a ser un catálogo COMPARTIDO entre profes (un mismo club lo
-- usan varios). Se agregan dirección y contacto, y la seguridad cambia de
-- "privada por profe" a "compartida entre profes autenticados".
-- Ejecutar en el SQL Editor de Supabase. Ver docs/06-supabase-setup.md.

alter table public.canchas add column if not exists direccion text not null default '';
alter table public.canchas add column if not exists contacto text not null default '';

-- profe_id queda como "creado por" (referencia), ya no como dueño exclusivo
alter table public.canchas alter column profe_id drop not null;

-- Reemplazar la política privada por uno compartida
drop policy if exists "canchas_propias" on public.canchas;

drop policy if exists "canchas_lectura" on public.canchas;
create policy "canchas_lectura" on public.canchas
  for select to authenticated using (true);

drop policy if exists "canchas_alta" on public.canchas;
create policy "canchas_alta" on public.canchas
  for insert to authenticated with check (true);

drop policy if exists "canchas_edicion" on public.canchas;
create policy "canchas_edicion" on public.canchas
  for update to authenticated using (true) with check (true);
