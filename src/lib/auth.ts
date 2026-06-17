import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Deporte } from '../types'

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
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin, captchaToken },
  })
  if (error) throw error
}

/** Inicia sesion con Google (redirige y vuelve a la app). */
export async function signInGoogle(): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
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
