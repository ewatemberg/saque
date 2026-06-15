// Tema de la app: modo (claro/oscuro/auto) y color de acento. Se guarda en el
// dispositivo (localStorage), no necesita backend, y se aplica al instante.

export type Tema = 'auto' | 'claro' | 'oscuro'

export interface Acento {
  nombre: string
  color: string
}

export const ACENTOS: Acento[] = [
  { nombre: 'Verde', color: '#0f6e56' },
  { nombre: 'Azul', color: '#185fa5' },
  { nombre: 'Violeta', color: '#534ab7' },
  { nombre: 'Coral', color: '#d85a30' },
  { nombre: 'Rosa', color: '#d4537e' },
]

const K_TEMA = 'saque-tema'
const K_ACENTO = 'saque-acento'

export function getTema(): Tema {
  const v = localStorage.getItem(K_TEMA)
  return v === 'claro' || v === 'oscuro' ? v : 'auto'
}

/** Acento elegido por el usuario, o '' si usa el del modo por defecto. */
export function getAcento(): string {
  return localStorage.getItem(K_ACENTO) ?? ''
}

export function aplicarTema(): void {
  const root = document.documentElement
  const tema = getTema()
  if (tema === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', tema === 'oscuro' ? 'dark' : 'light')

  const acento = getAcento()
  if (acento) root.style.setProperty('--accent', acento)
  else root.style.removeProperty('--accent')
}

export function setTema(t: Tema): void {
  localStorage.setItem(K_TEMA, t)
  aplicarTema()
}

export function setAcento(color: string): void {
  if (color) localStorage.setItem(K_ACENTO, color)
  else localStorage.removeItem(K_ACENTO)
  aplicarTema()
}
