-- Datos de ejemplo para Saque (opcional).
--
-- Como hacerlo:
-- 1. Entra a la app al menos una vez para crear tu usuario.
-- 2. Reemplaza el email de abajo por el que usaste para entrar.
-- 3. Ejecuta este script en el SQL Editor de Supabase.
--
-- Carga 2 canchas, 6 alumnos, los turnos de HOY y las cuotas del mes actual.

do $$
declare
  pid uuid;
  a_juan uuid; a_maria uuid; a_pedro uuid; a_sofia uuid; a_lucas uuid; a_caro uuid;
  t1 uuid; t2 uuid; t3 uuid; t4 uuid;
  periodo text := to_char(current_date, 'YYYY-MM');
begin
  select id into pid from auth.users where email = 'emilio.watemberg@gmail.com' limit 1;
  if pid is null then
    raise exception 'No se encontro el usuario. Reemplaza el email en el script.';
  end if;

  insert into public.canchas (profe_id, nombre, costo_por_hora)
    values (pid, 'Cancha 1', 12000), (pid, 'Cancha 2', 14000);

  insert into public.alumnos (profe_id, nombre, iniciales, categoria, telefono, tipo)
    values (pid, 'Juan Díaz', 'JD', '4ta', '+5491100000001', 'fijo') returning id into a_juan;
  insert into public.alumnos (profe_id, nombre, iniciales, categoria, telefono, tipo)
    values (pid, 'María Ruiz', 'MR', '5ta', '+5491100000002', 'fijo') returning id into a_maria;
  insert into public.alumnos (profe_id, nombre, iniciales, categoria, telefono, tipo)
    values (pid, 'Pedro López', 'PL', '4ta', '+5491100000003', 'fijo') returning id into a_pedro;
  insert into public.alumnos (profe_id, nombre, iniciales, categoria, telefono, tipo)
    values (pid, 'Sofía Fernández', 'SF', '6ta', '+5491100000004', 'fijo') returning id into a_sofia;
  insert into public.alumnos (profe_id, nombre, iniciales, categoria, telefono, tipo)
    values (pid, 'Lucas Pérez', 'LP', '3ra', '+5491100000010', 'fijo') returning id into a_lucas;
  insert into public.alumnos (profe_id, nombre, iniciales, categoria, telefono, tipo)
    values (pid, 'Caro Méndez', 'CM', '5ta', '+5491100000011', 'ocasional') returning id into a_caro;

  insert into public.turnos (profe_id, cancha_nombre, fecha, hora, categoria, precio, cupos, estado, costo_cancha)
    values (pid, 'Cancha 1', current_date, '18:00', '4ta', 6000, 4, 'activo', 12000) returning id into t1;
  insert into public.turnos (profe_id, cancha_nombre, fecha, hora, categoria, precio, cupos, estado, costo_cancha)
    values (pid, 'Cancha 1', current_date, '19:00', '5ta', 6000, 4, 'activo', 12000) returning id into t2;
  insert into public.turnos (profe_id, cancha_nombre, fecha, hora, categoria, precio, cupos, estado, costo_cancha)
    values (pid, 'Cancha 2', current_date, '20:00', '6ta', 6000, 4, 'suspendido', 12000) returning id into t3;
  insert into public.turnos (profe_id, cancha_nombre, fecha, hora, categoria, precio, cupos, estado, costo_cancha)
    values (pid, 'Cancha 2', current_date, '21:00', '3ra', 6000, 4, 'activo', 14000) returning id into t4;

  insert into public.inscripciones (turno_id, alumno_id, iniciales) values
    (t1, a_juan, 'JD'), (t1, a_maria, 'MR'), (t1, a_pedro, 'PL'), (t1, a_sofia, 'SF'),
    (t2, a_lucas, 'LP'), (t2, a_caro, 'CM'), (t2, a_juan, 'JD'),
    (t4, a_maria, 'MR'), (t4, a_pedro, 'PL');

  insert into public.cuotas (profe_id, alumno_id, nombre, iniciales, detalle, periodo, estado, monto_esperado, monto_pagado, metodo, clases_restantes) values
    (pid, a_juan, 'Juan Díaz', 'JD', 'Abono · mar 19h', periodo, 'pagado', 25000, 25000, 'mercadopago', null),
    (pid, a_maria, 'María Ruiz', 'MR', 'Abono · jue 18h', periodo, 'pagado', 25000, 25000, 'transferencia', null),
    (pid, a_pedro, 'Pedro López', 'PL', 'Abono · mar 19h', periodo, 'debe', 25000, 0, null, null),
    (pid, a_sofia, 'Sofía Fernández', 'SF', 'Abono · sáb 10h', periodo, 'parcial', 25000, 12000, 'efectivo', null),
    (pid, a_lucas, 'Lucas Pérez', 'LP', 'Abono · vie 20h', periodo, 'debe', 25000, 0, null, null),
    (pid, a_caro, 'Caro Méndez', 'CM', 'Paquete · ocasional', periodo, 'paquete', 0, 0, null, 3);
end $$;
