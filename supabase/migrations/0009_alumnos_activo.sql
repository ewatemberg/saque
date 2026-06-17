-- Alumnos: estado activo/inactivo (soft-delete). Desactivar conserva el alumno y
-- todo su historial (cuotas, asistencias) pero lo saca de las listas y de la
-- generación de cuotas. Reemplaza al borrado como acción principal.

alter table public.alumnos add column if not exists activo boolean not null default true;

-- Métricas de admin: el total de alumnos cuenta SOLO activos, y se reporta aparte
-- la cantidad de inactivos, para no confundir la población real.
create or replace function public.admin_metricas()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_result json;
begin
  if v_email is distinct from 'emilio.watemberg@gmail.com' then
    raise exception 'No autorizado';
  end if;

  select json_build_object(
    'profes', (select count(*) from auth.users),
    'alumnos', (select count(*) from public.alumnos where activo),
    'alumnosInactivos', (select count(*) from public.alumnos where not activo),
    'turnos', (select count(*) from public.turnos),
    'franjas', (select count(*) from public.franjas),
    'canchas', (select count(*) from public.canchas),
    'porDeporte', json_build_object(
      'padel', (select count(*) from auth.users where raw_user_meta_data ->> 'deporte' = 'padel'),
      'tenis', (select count(*) from auth.users where raw_user_meta_data ->> 'deporte' = 'tenis')
    ),
    'altasPorMes', (
      select coalesce(json_agg(json_build_object('periodo', periodo, 'profes', n) order by periodo), '[]'::json)
      from (
        select to_char(created_at, 'YYYY-MM') as periodo, count(*) as n
        from auth.users
        group by 1
      ) m
    ),
    'porProfe', (
      select coalesce(json_agg(p order by p.alumnos desc, p.turnos desc), '[]'::json)
      from (
        select
          u.id,
          coalesce(nullif(u.raw_user_meta_data ->> 'nombre_publico', ''), split_part(u.email, '@', 1)) as nombre,
          u.email,
          u.raw_user_meta_data ->> 'deporte' as deporte,
          to_char(u.created_at, 'YYYY-MM-DD') as creado,
          to_char(u.last_sign_in_at, 'YYYY-MM-DD') as ultimo_acceso,
          (select count(*) from public.alumnos a where a.profe_id = u.id and a.activo) as alumnos,
          (select count(*) from public.turnos t where t.profe_id = u.id) as turnos,
          (select count(*) from public.franjas f where f.profe_id = u.id) as franjas
        from auth.users u
      ) p
    )
  ) into v_result;

  return v_result;
end;
$$;

grant execute on function public.admin_metricas() to authenticated;
