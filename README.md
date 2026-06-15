# Saque

App de gestión de clases para **profes de pádel** (y a futuro tenis). Resuelve el
día a día del profe independiente: organizar los turnos, controlar asistencia,
cobrar los abonos del mes y saber cuánto gana de verdad — usando **WhatsApp**
como canal de avisos y contemplando la realidad de pagos argentina
(MercadoPago, transferencia, efectivo).

Funciona en **web, Android e iOS** con un solo código (React + Capacitor) y un
backend de bajo costo (Supabase).

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abre la app en `http://localhost:5173`. Por defecto usa **datos de ejemplo**
(modo mock), así que funciona sin configurar nada. Para conectar el backend real,
copiá `.env.example` a `.env` y completá las credenciales de Supabase.

Scripts disponibles:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (carpeta `dist/`) |
| `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Verifica los tipos de TypeScript |

## Documentación

La carpeta [`docs/`](docs/) contiene las decisiones de producto y técnicas:

| Documento | Contenido |
| --- | --- |
| [01 · Visión y nicho](docs/01-vision-y-nicho.md) | Para quién es, qué problema resuelve y por qué |
| [02 · Modelo de datos](docs/02-modelo-de-datos.md) | Entidades, relaciones y reglas de negocio |
| [03 · Pantallas](docs/03-pantallas.md) | Las pantallas del MVP y qué hace cada una |
| [04 · Stack y costos](docs/04-stack-y-costos.md) | Tecnologías elegidas y costo de mantenimiento |
| [05 · Roadmap](docs/05-roadmap.md) | Fases del proyecto, qué entra en cada una |
| [06 · Configuración de Supabase](docs/06-supabase-setup.md) | Cómo conectar el backend real |
| [07 · Build Android](docs/07-build-android.md) | Empaquetar la app nativa con Capacitor |
| [Términos y Condiciones](docs/legal/terminos-y-condiciones.md) | Borrador legal (revisar con abogado) |
| [Política de Privacidad](docs/legal/politica-de-privacidad.md) | Borrador legal (revisar con abogado) |

## Estructura

```
src/
  components/   Componentes compartidos (layout, navegación, íconos)
  data/         Capa de datos (hoy mock; mañana Supabase)
  lib/          Utilidades (formato, WhatsApp, cliente Supabase)
  screens/      Una pantalla por sección (Hoy, Cobranzas, Alumnos, Balance)
  styles/       Tokens de diseño y estilos globales
docs/           Documentación del proyecto
```
