// Sistema mínimo de avisos (toasts), sin dependencias. Cualquier parte de la app
// puede llamar a toast(...) y el ToastHost los muestra y los va sacando solos.

export type ToastTipo = 'error' | 'success' | 'info'

export interface ToastMsg {
  id: number
  texto: string
  tipo: ToastTipo
}

type Listener = (msgs: ToastMsg[]) => void

let msgs: ToastMsg[] = []
let seq = 0
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l(msgs))
}

export function subscribeToasts(l: Listener): () => void {
  listeners.add(l)
  l(msgs)
  return () => {
    listeners.delete(l)
  }
}

export function toast(texto: string, tipo: ToastTipo = 'info'): void {
  const id = ++seq
  msgs = [...msgs, { id, texto, tipo }]
  emit()
  setTimeout(() => {
    msgs = msgs.filter((m) => m.id !== id)
    emit()
  }, 3500)
}
