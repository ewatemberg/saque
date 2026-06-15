# 06 · Configuración de Supabase

Pasos para conectar el backend real. Mientras no completes esto, la app sigue
funcionando con datos de ejemplo (modo mock).

## 1. Crear el proyecto

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta (gratis).
2. "New project". Elegí un nombre (ej. `saque`), una contraseña para la base y la
   región más cercana (ej. `South America (São Paulo)`).
3. Esperá ~2 minutos a que se aprovisione.

## 2. Crear las tablas

1. En el menú lateral: **SQL Editor** → **New query**.
2. Pegá el contenido de [`supabase/migrations/t.sql`](../supabase/migrations/0001_init.sql)
   y dale **Run**.
3. Esto crea las tablas y activa la seguridad por usuario (cada profe ve solo lo
   suyo).

## 3. Configurar el acceso (auth)

1. **Authentication** → **Providers**.
2. **Email**: ya viene activado. Sirve el "link mágico" (acceso sin contraseña).
3. **Google** (opcional pero recomendado): activalo y seguí el asistente para
   pegar el Client ID y Secret de Google Cloud. Se puede hacer más adelante.
4. **Authentication** → **URL Configuration**: agregá `http://localhost:5173` en
   "Redirect URLs" para desarrollo (y luego la URL de producción).

## 4. Copiar las credenciales a la app

1. **Project Settings** → **API**.
2. Copiá **Project URL** y la **anon public key**.
3. En la raíz del proyecto, copiá `.env.example` a `.env` y completá:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. Reiniciá `npm run dev`. La app ahora pide login y usa el backend real.

> La `anon key` es pública por diseño (va en el navegador); lo que protege los
> datos es la seguridad a nivel de fila (RLS) que crea la migración. Aun así, el
> archivo `.env` no se sube al repo.

## 5. (Opcional) Cargar datos de ejemplo

Para no arrancar con la app vacía:

1. Entrá a la app una vez (para crear tu usuario).
2. Abrí [`supabase/seed.sql`](../supabase/seed.sql), reemplazá el email por el
   tuyo y ejecutalo en el SQL Editor.

## Cómo funciona en el código

- [`src/lib/supabase.ts`](../src/lib/supabase.ts) crea el cliente solo si hay
  credenciales; si no, `usandoMock` queda en `true`.
- [`src/data/repo.ts`](../src/data/repo.ts) elige entre los datos de ejemplo
  ([`mock.ts`](../src/data/mock.ts)) y las consultas reales
  ([`supabaseRepo.ts`](../src/data/supabaseRepo.ts)).
- [`src/lib/auth.ts`](../src/lib/auth.ts) maneja login con email/Google y la
  sesión.
