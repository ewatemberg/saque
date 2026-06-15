# 04 · Stack y costos

## Tecnologías

| Capa | Elección | Por qué |
| --- | --- | --- |
| Frontend | **React + TypeScript + Vite** | Estándar, rápido, gran ecosistema |
| Multiplataforma | **Capacitor** | Un solo código → web + Android + iOS (WebView nativa) |
| Ruteo | **React Router** (HashRouter) | Funciona igual en web y en empaquetado nativo |
| Backend | **Supabase** | Postgres + Auth + Storage + Realtime, casi sin costo al inicio |

> Se descartó un backend propio en Java/Spring: requiere un servidor encendido
> 24/7 (costo fijo desde el día 1, aunque nadie use la app). Supabase escala el
> costo con el uso.

## Capa de datos

Las pantallas no hablan con el backend directamente: pasan por
[`src/data/repo.ts`](../src/data/repo.ts). Hoy ese archivo devuelve **datos de
ejemplo (mock)**, así se puede desarrollar la UI sin backend. Cuando se configure
Supabase, se reemplaza el contenido de cada función conservando su firma — las
pantallas no cambian.

El cliente de Supabase ([`src/lib/supabase.ts`](../src/lib/supabase.ts)) solo se
crea si hay credenciales en `.env`. Mientras no las haya, la app usa el mock.

## Costos

Para una base chica (decenas o pocos cientos de usuarios):

| Concepto | Costo |
| --- | --- |
| Supabase (plan Free: 50.000 usuarios/mes, 500 MB base) | **$0** |
| Hosting web (Vercel/Netlify plan free) | **$0** |
| Supabase Pro (cuando se quiera backups y no-pausa) | ~USD 25/mes |
| Apple Developer (solo si se publica en App Store) | USD 99/año |
| Google Play (pago único) | USD 25 |

**Con ~100 usuarios el costo de backend es $0.** Solo aparece gasto si se publica
en las stores nativas; la versión web no cuesta nada.

## Seguridad

- Las credenciales van en `.env` (en `.gitignore`), **nunca** en el repo.
- `.env.example` documenta qué variables hacen falta, sin valores reales.
- El repo es público durante las pruebas iniciales: no debe contener secretos.
