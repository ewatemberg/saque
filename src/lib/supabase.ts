import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// El cliente solo se crea si hay credenciales configuradas en .env.
// Mientras tanto la app usa datos de ejemplo (ver src/data/repo.ts).
// flowType 'pkce' es necesario para el login por deep link en la app nativa
// (el código vuelve por app.saque://login y se canjea con el verifier guardado).
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      })
    : null

/** true cuando todavia no hay backend configurado y se usan datos mock. */
export const usandoMock = supabase === null
