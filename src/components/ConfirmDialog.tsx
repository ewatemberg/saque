import type { ReactNode } from 'react'

interface Props {
  titulo: string
  mensaje: ReactNode
  confirmLabel?: string
  peligro?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Diálogo de confirmación propio (reemplaza al window.confirm del navegador). */
export function ConfirmDialog({ titulo, mensaje, confirmLabel = 'Confirmar', peligro = false, onConfirm, onCancel }: Props) {
  return (
    <div className="demo-overlay" onClick={onCancel}>
      <div className="demo-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>{titulo}</h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, margin: '0 0 18px' }}>{mensaje}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-sm" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn btn-sm btn-accent"
            style={peligro ? { background: 'var(--danger)', borderColor: 'var(--danger)' } : undefined}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
