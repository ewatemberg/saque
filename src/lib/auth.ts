import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { supabase } from './supabase'
import { esAppNativa } from './plataforma'
import type { Deporte } from '../types'

// Deep link al que Google (y el link mágico) redirigen para volver a la app
// nativa. El intent-filter del scheme `app.saque` está en AndroidManifest.xml.
const DEEP_LINK = 'app.saque://login'

// Contexto de sesión: lo provee App una vez resuelta la sesión, así cualquier
// pantalla lee el deporte de forma SÍNCRONA (sin la condición de carrera de
// cargar la sesión por separado en cada pantalla).
export const SesionContext = createContext<Session | null>(null)

/** Deporte del profe leído del contexto (disponible en el primer render). */
export function useDeporte(): Deporte | undefined {
  return deporteDeSesion(useContext(SesionContext)) ?? undefined
}

/** Estado de sesion. En modo mock (sin Supabase) devuelve sesion nula sin cargar. */
export function useSession(): { session: Session | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return { session, loading }
}

/** Envia un link magico al email (sin contrasena). captchaToken si el CAPTCHA está activo. */
export async function signInEmail(email: string, captchaToken?: string): Promise<void> {
  if (!supabase) return
  const emailRedirectTo = esAppNativa() ? DEEP_LINK : window.location.origin
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo, captchaToken },
  })
  if (error) throw error
}

/**
 * Inicia sesion con Google.
 * - Web: redirige en la misma pestaña y vuelve al origen.
 * - App nativa: abre el selector de cuenta en un Custom Tab y vuelve por el
 *   deep link `app.saque://login`, que captura registrarDeepLinks() para canjear
 *   el código. Así la sesión queda en la WebView (persiste, no pide login cada vez).
 */
export async function signInGoogle(): Promise<void> {
  if (!supabase) return
  if (esAppNativa()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: DEEP_LINK, skipBrowserRedirect: true },
    })
    if (error) throw error
    if (data?.url) await Browser.open({ url: data.url })
    return
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
}

/**
 * Registra el listener de deep links de la app nativa. Cuando Google (o el link
 * mágico) vuelve por `app.saque://login?code=...`, canjea el código por sesión y
 * cierra el Custom Tab. Devuelve una función para desuscribir. No hace nada en web.
 */
export function registrarDeepLinks(): () => void {
  if (!supabase || !esAppNativa()) return () => {}
  const handle = CapApp.addListener('appUrlOpen', async ({ url }) => {
    if (!url || !url.startsWith('app.saque://')) return
    try {
      const query = url.split('?')[1] ?? ''
      const code = new URLSearchParams(query).get('code')
      if (code) await supabase!.auth.exchangeCodeForSession(code)
    } catch {
      // Si falla el canje, el usuario sigue en el login y puede reintentar.
    } finally {
      try {
        await Browser.close()
      } catch {
        // En algunos navegadores no hay nada que cerrar; se ignora.
      }
    }
  })
  return () => {
    void handle.then((h) => h.remove())
  }
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

/** Deporte que eligió el profe (guardado en user_metadata). null si no eligió. */
export function deporteDeSesion(session: Session | null): Deporte | null {
  const d = session?.user?.user_metadata?.deporte
  return d === 'padel' || d === 'tenis' ? d : null
}

/** Guarda el deporte elegido en el perfil del usuario. */
export async function setDeporte(deporte: Deporte): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.auth.updateUser({ data: { deporte } })
  if (error) throw error
}

/** Id del profe (para armar el link de su página pública). null en modo mock. */
export function idDeSesion(session: Session | null): string | null {
  return session?.user?.id ?? null
}

/** Email del administrador de la app (acceso al dashboard de métricas). */
export const ADMIN_EMAIL = 'emilio.watemberg@gmail.com'

/** true si la sesión es la del administrador (gating de UI; el backend lo revalida). */
export function esAdmin(session: Session | null): boolean {
  return (session?.user?.email ?? '').toLowerCase() === ADMIN_EMAIL
}

export interface PerfilPublicoEditable {
  nombre: string
  whatsapp: string
}

/** Datos públicos del profe (nombre y WhatsApp), guardados en user_metadata. */
export function perfilPublicoDeSesion(session: Session | null): PerfilPublicoEditable {
  const m = session?.user?.user_metadata
  return { nombre: m?.nombre_publico ?? '', whatsapp: m?.whatsapp ?? '' }
}

/** Guarda nombre público y WhatsApp del profe en user_metadata. */
export async function setPerfilPublico(nombre: string, whatsapp: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.auth.updateUser({ data: { nombre_publico: nombre, whatsapp } })
  if (error) throw error
}

/** Link de cobro de MercadoPago del profe (guardado en user_metadata). '' si no cargó. */
export function linkCobroDeSesion(session: Session | null): string {
  return session?.user?.user_metadata?.mp_link ?? ''
}

/** Guarda el link de cobro de MercadoPago del profe en user_metadata. */
export async function setLinkCobro(link: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.auth.updateUser({ data: { mp_link: link } })
  if (error) throw error
}
