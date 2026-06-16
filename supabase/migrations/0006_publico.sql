-- Calendario público de turnos disponibles (link abierto, sin login).
-- Dos funciones SECURITY DEFINER que exponen SOLO datos no sensibles de un
-- profe: horarios con cupos libres y categoría (nunca nombres/teléfonos de
-- alumnos ni precios/costos). Se otorga ejecución al rol anónimo.

create or replace function public.turnos_publicos(p_profe uuid, p_desde date, p_hasta date)
returns table (
  fecha date,
  hora text,
  cancha_nombre text,
  categoria text,
  cupos integer,
  ocupados integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.fecha,
    t.hora,
    t.cancha_nombre,
    t.categoria,
    t.cupos,
    (select count(*)::integer from public.inscripciones i where i.turno_id = t.id) as ocupados
  from public.turnos t
  where t.profe_id = p_profe
    and t.estado <> 'suspendido'
    and t.fecha between p_desde and p_hasta
  order by t.fecha, t.hora;
$$;

create or replace function public.perfil_publico(p_profe uuid)
returns table (
  nombre text,
  whatsapp text,
  deporte text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(u.raw_user_meta_data ->> 'nombre_publico', '') as nombre,
    coalesce(u.raw_user_meta_data ->> 'whatsapp', '') as whatsapp,
    u.raw_user_meta_data ->> 'deporte' as deporte
  from auth.users u
  where u.id = p_profe;
$$;

grant execute on function public.turnos_publicos(uuid, date, date) to anon, authenticated;
grant execute on function public.perfil_publico(uuid) to anon, authenticated;
