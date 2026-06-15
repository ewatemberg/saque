-- Cada cancha pertenece a un deporte (padel o tenis), para que un profe no vea
-- canchas que no son de su interés. El deporte del profe se guarda en su perfil
-- (user_metadata de Supabase Auth), no en una tabla.
-- Ejecutar en el SQL Editor de Supabase. Ver docs/06-supabase-setup.md.

alter table public.canchas
  add column if not exists deporte text not null default 'padel'
  check (deporte in ('padel', 'tenis'));

create index if not exists idx_canchas_deporte on public.canchas (deporte);
