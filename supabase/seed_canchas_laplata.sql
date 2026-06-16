-- Catálogo de canchas del Gran La Plata (pádel y tenis) — SANITIZADO.
--
-- Consolidado de la lista provista por el profe (tabla + CSV): se unieron
-- duplicados, se normalizaron nombres/direcciones/teléfonos y los clubes con
-- ambos deportes quedan como DOS filas (una de pádel y otra de tenis).
--
-- ⚠️ Este script REEMPLAZA todo el catálogo de canchas:
--   1) borra las existentes (incluye los placeholders "Cancha 1" / "Cancha 2"),
--   2) inserta la lista limpia.
-- No afecta turnos ni franjas ya creados (guardan el nombre de la cancha, no un
-- vínculo). Ejecutar UNA VEZ en el SQL Editor de Supabase.

delete from public.canchas;

insert into public.canchas (profe_id, nombre, direccion, contacto, costo_por_hora, deporte) values
  -- ---------------- PÁDEL ----------------
  (null, 'Complejo La Cueva Padel',        'Calle 23 N° 1574, La Plata',            '221 623-7600', 0, 'padel'),
  (null, 'My Club Padel',                  'Av. 66 N° 5, La Plata',                 '221 303-3200', 0, 'padel'),
  (null, 'El Túnel Pádel Club',            'Boulevard 82 N° 145, La Plata',         '221 696-0001', 0, 'padel'),
  (null, 'La Casona Padel',                'Calle 132 N° 679, La Plata',            '221 640-0071', 0, 'padel'),
  (null, 'La Quinta Padel',                'Calle 148 esq. 41, La Plata',           '221 627-1869', 0, 'padel'),
  (null, 'Smash Padel Club',               'Av. 520 N° 1445, Ringuelet',            '221 497-8682', 0, 'padel'),
  (null, 'Distrito Pádel',                 'Calle 26 N° 81, Tolosa',                '221 601-3080', 0, 'padel'),
  (null, 'Stadium Padel',                  'Calle 530 N° 2457, La Plata',           '221 226-4893', 0, 'padel'),
  (null, 'Plaza Pádel',                    'Calle 24 e/ 38 y 39, La Plata',         '221 470-4870', 0, 'padel'),
  (null, 'La Aventura Pádel',              'Calle 66 esq. 139, Los Hornos',         '221 450-4523', 0, 'padel'),
  (null, 'Atenas Complejo Deportivo',      'Calle 44 e/ 138 y 139, La Plata',       '221 470-2342', 0, 'padel'),
  (null, '1870 Sports Complex',            'Calle 1870, La Plata',                  '221 417-6866', 0, 'padel'),
  (null, 'Juglans Club de Pádel',          'Calle 31 N° 2087 e/ 511 y 512, Hernández', '221 507-4335', 0, 'padel'),
  (null, 'Retro Pádel y Fútbol 5',         'Av. 66, La Plata',                      '221 641-7199', 0, 'padel'),
  (null, 'Padel Point',                    'Calle 23 N° 333, La Plata',             '221 615-9998', 0, 'padel'),
  (null, 'Othello Padel & Pickleball',     'Calle 34 N° 723, La Plata',             '221 508-7206', 0, 'padel'),
  (null, 'El Palmar Paddle',               'Av. 31 N° 679, Los Hornos',             '221 522-1756', 0, 'padel'),
  (null, 'Padel Centenario',               'Camino Parque Centenario, Gonnet',      '221 602-9913', 0, 'padel'),
  (null, 'Los Ciruelos',                   'Calle 34 e/ 25 y 26, La Plata',         '',             0, 'padel'),
  -- ---------------- PÁDEL Y TENIS (una fila por deporte) ----------------
  (null, 'La Villa - Tenis & Padel',       'Calle 120 N° 1758, La Plata',           '221 319-8190', 0, 'padel'),
  (null, 'La Villa - Tenis & Padel',       'Calle 120 N° 1758, La Plata',           '221 319-8190', 0, 'tenis'),
  (null, 'Universitario Pádel/Tenis',      'Calle 501 e/ 14 y 15, Gonnet',          '',             0, 'padel'),
  (null, 'Universitario Pádel/Tenis',      'Calle 501 e/ 14 y 15, Gonnet',          '',             0, 'tenis'),
  -- ---------------- TENIS ----------------
  (null, 'Quadra Tenis',                   'Calle 10 N° 4397, Gonnet',              '221 536-4457', 0, 'tenis'),
  (null, 'Tennis Club El Ciruelo',         'Calle 135 y 505, Hernández',            '221 564-3738', 0, 'tenis'),
  (null, 'Lacroze Tenis Club',             'Calle 489 y 132, Gonnet',               '221 555-9253', 0, 'tenis'),
  (null, 'Club de Tenis (Gonnet)',         'Calle 496 N° 1277, Gonnet',             '',             0, 'tenis'),
  (null, 'Club Deportivo La Plata',        'Calle 71 N° 331, La Plata',             '221 351-2805', 0, 'tenis'),
  (null, 'Tenis Club La Plata',            'Calle 154 y 40, La Plata',              '221 699-5355', 0, 'tenis');
