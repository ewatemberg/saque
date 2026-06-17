-- Admin: gestión de profes. Suma a las métricas la fecha de alta y el último
-- acceso de cada profe, y agrega una función para eliminar un profe (y todos sus
-- datos por cascada). Ambas protegidas: solo las ejecuta el admin (email del JWT).

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
    'alumnos', (select count(*) from public.alumnos),
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
          (select count(*) from public.alumnos a where a.profe_id = u.id) as alumnos,
          (select count(*) from public.turnos t where t.profe_id = u.id) as turnos,
          (select count(*) from public.franjas f where f.profe_id = u.id) as franjas
        from auth.users u
      ) p
    )
  ) into v_result;

  return v_result;
end;
$$;

create or replace function public.admin_eliminar_profe(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
begin
  if v_email is distinct from 'emilio.watemberg@gmail.com' then
    raise exception 'No autorizado';
  end if;
  if p_id = auth.uid() then
    raise exception 'No podés eliminar tu propia cuenta';
  end if;
  -- borra el usuario; sus alumnos/turnos/franjas/cuotas/inscripciones caen por cascada
  delete from auth.users where id = p_id;
end;
$$;

grant execute on function public.admin_metricas() to authenticated;
grant execute on function public.admin_eliminar_profe(uuid) to authenticated;
