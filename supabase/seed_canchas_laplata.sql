-- Relevamiento de canchas de PÁDEL y TENIS del Gran La Plata (Buenos Aires, AR).
--
-- Fuente: investigación multi-fuente con verificación adversarial (deep-research,
-- 2026-06). Ubicación confirmada con código de área 0221/+54 221 y CP B19xx para
-- descartar homónimos (Ensenada de México, Villa Elisa de Entre Ríos).
--
--  * costo_por_hora = 0 (referencia): cada profe ajusta el costo real en el turno.
--  * Los clubes con pádel Y tenis aparecen como dos filas (una por deporte).
--  * Ejecutar UNA SOLA VEZ. Las canchas son compartidas entre profes del deporte.
--  * BLOQUE 1 = verificado (alta confianza). BLOQUE 2 = a verificar (comentado).

-- ===========================================================================
-- BLOQUE 1 — VERIFICADO (alta confianza, verificación 3-0)
-- ===========================================================================
insert into public.canchas (profe_id, nombre, direccion, contacto, costo_por_hora, deporte) values
  -- ---- PÁDEL ----
  (null, 'Club Universitario de La Plata — Pádel', 'Calle 14 y 501, Gonnet (5 canchas vidriadas)', '221 680-9751',   0, 'padel'),
  (null, 'Tenis Club La Plata — Pádel',            'Calle 154 e/40 y 41 nº420, La Plata (2 canchas)', '221 470-6367', 0, 'padel'),
  (null, 'Pádel El Solar',                         'Calle La Plata 1701-1799, Berisso',          '221 508-7934',   0, 'padel'),
  (null, 'Stadium Club de Pádel',                  'Calle 530 e/19 y 20, La Plata (Tolosa)',     '221 226-4893',   0, 'padel'),
  (null, 'Juglans Club de Pádel',                  'Calle 31 nº2087 e/511 y 512, Gonnet',        '221 507-4335',   0, 'padel'),
  (null, 'La Casona Pádel',                        'Calle 132 nº679 e/45 y 46, La Plata',        '221 640-0071',   0, 'padel'),
  (null, 'Atenas Complejo Deportivo',              'Calle 44 e/138 y 139, La Plata',             '221 655-6290',   0, 'padel'),
  (null, 'Los Ciruelos',                           'Calle 34 e/25 y 26, La Plata',               '221 671-2286',   0, 'padel'),
  (null, 'Plaza Pádel',                            'Calle 24 e/38 y 39, La Plata (5 canchas)',   '221 470-4870',   0, 'padel'),
  (null, 'La Cueva Pádel',                         'Calle 23 nº1574 e/64 y 65, La Plata (2 canchas cubiertas)', '221 452-4011', 0, 'padel'),
  -- ---- TENIS ----
  (null, 'Club Universitario de La Plata — Tenis', 'Calle 14 y 501, Gonnet (6 canchas de polvo)', '221 546-2656',  0, 'tenis'),
  (null, 'Tenis Club La Plata — Tenis',            'Calle 154 e/40 y 41 nº420, La Plata (7 canchas de polvo)', '221 470-6367', 0, 'tenis'),
  (null, 'Club de Gimnasia y Esgrima La Plata — Tenis', 'Calle 60 y 118, Estadio J.C. Zerillo, La Plata', '+54 9 221 304-4751', 0, 'tenis'),
  (null, 'La Ensenada Tenis',                      'La Merced 25 N°699, Ensenada (también alquila pádel)', '221 469-0222', 0, 'tenis'),
  (null, 'Club Hípico y de Golf de City Bell',     'Labougle y 10, City Bell (6 canchas de polvo)', '221 480-0169', 0, 'tenis'),
  (null, 'Tenis Time',                             'Calle 29 e/38 y 39, La Plata (y sede Ringuelet, Calle 10 1443)', '221 621-5618', 0, 'tenis'),
  (null, 'Ceet Tenis',                             'Calle 10 e/517 y 518, Ringuelet (5 canchas de polvo)', '221 471-5708', 0, 'tenis'),
  (null, 'Hipódromo Club de Tenis',                'Av. 44 y 115, La Plata',                     '221 489-4096',   0, 'tenis');

-- ===========================================================================
-- BLOQUE 2 — A VERIFICAR (descomentar cada fila cuando confirmes los datos).
-- Provienen de directorios sin corroboración independiente, o de un relevamiento
-- previo no re-verificado. NO se cargan por defecto para no ensuciar la base.
-- ===========================================================================
-- insert into public.canchas (profe_id, nombre, direccion, contacto, costo_por_hora, deporte) values
--   -- PÁDEL (directorio padelen.com, sin corroborar)
--   (null, 'Complejo 10',                       'Calle 10 1215, La Plata',                '', 0, 'padel'),
--   (null, 'Estación Norte',                    'Calle 510 e/6 y 7, La Plata',            '', 0, 'padel'),
--   (null, 'My Club',                           'Av. 66 y Boulevard 120, La Plata',       '', 0, 'padel'),
--   (null, 'Gonnet Tennis Squash',             'Gonnet',                                  '', 0, 'padel'),
--   (null, 'La Aventura',                       'La Plata',                                '', 0, 'padel'),
--   (null, 'La Fraternal',                      'La Plata',                                '', 0, 'padel'),
--   (null, 'Complejo La Villa Tenis & Padel',   'La Plata',                                '', 0, 'padel'),
--   -- TENIS / otros (relevamiento previo, no re-verificado)
--   (null, 'Tenis Hípico City Bell',           'Calle 13 y 470, City Bell',              '', 0, 'tenis'),
--   (null, 'Club Banco Provincia (City Bell)', 'Calle 476 e/20 y 21, City Bell',         '', 0, 'tenis'),
--   (null, 'Termas Tenis Club (Villa Elisa)',  'Complejo Termas de Villa Elisa',         '', 0, 'tenis'),
--   (null, 'Play Tennis (Gonnet)',             'Camino Parque Centenario e/495 y 496, Gonnet', '', 0, 'tenis'),
--   (null, 'Tenis Tiro Federal (Berisso)',     'Av. del Petróleo Argentino 1455, Berisso', '', 0, 'tenis');
