import { useEffect, useState } from 'react'
import { subscribeToasts, type ToastMsg } from '../lib/toast'

export function ToastHost() {
  const [msgs, setMsgs] = useState<ToastMsg[]>([])
  useEffect(() => subscribeToasts(setMsgs), [])

  if (msgs.length === 0) return null
  return (
    <div className="toast-host">
      {msgs.map((m) => (
        <div key={m.id} className={`toast toast-${m.tipo}`}>
          {m.texto}
        </div>
      ))}
    </div>
  )
}
