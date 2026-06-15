/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Inyectados por Vite en build time (ver vite.config.ts y src/version.ts)
declare const __APP_VERSION__: string
declare const __BUILD_DATE__: string
