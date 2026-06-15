import { useEffect, useState } from 'react'

/**
 * Hook minimo para cargar datos async desde la capa de repo.
 * Devuelve null mientras carga.
 */
export function useData<T>(loader: () => Promise<T>): T | null {
  const [data, setData] = useState<T | null>(null)
  useEffect(() => {
    let activo = true
    loader().then((d) => {
      if (activo) setData(d)
    })
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return data
}
