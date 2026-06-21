// Detecta si la app corre dentro del contenedor nativo (Capacitor/WebView) o en
// un navegador normal. Capacitor inyecta `window.Capacitor` en el WebView.
// En la app nativa, el login por email (link mágico) no vuelve a la app —el link
// abre el navegador—, así que conviene priorizar "Entrar con Google".

interface CapacitorGlobal {
  isNativePlatform?: () => boolean
}

export function esAppNativa(): boolean {
  if (typeof window === 'undefined') return false
  const cap = (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor
  return !!cap?.isNativePlatform?.()
}
