import { useEffect, useRef } from 'react'

// Cloudflare Turnstile (CAPTCHA gratis) para frenar registros automatizados.
// Se activa SOLO si hay un site key configurado (VITE_TURNSTILE_SITE_KEY).
// Sin key, el componente no renderiza nada y el login funciona igual que antes.

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

/** true si el CAPTCHA está configurado (hay site key en el build). */
export const captchaActivo = Boolean(SITE_KEY)

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<void> | null = null
function cargarScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('No se pudo cargar el CAPTCHA'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

/** Renderiza el widget de Turnstile y devuelve el token por callback ('' al expirar/error). */
export function Captcha({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let widgetId: string | undefined
    let cancelado = false
    cargarScript()
      .then(() => {
        if (cancelado || !ref.current || !window.turnstile) return
        widgetId = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onToken(token),
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        })
      })
      .catch(() => {})
    return () => {
      cancelado = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!SITE_KEY) return null
  return <div ref={ref} style={{ marginBottom: 12, minHeight: 65 }} />
}
