import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { getCuota, registrarPago } from '../data/repo'
import { formatPesos, nombreMetodo } from '../lib/format'
import { toast } from '../lib/toast'
import type { ItemCobranza, MetodoPago } from '../types'

const METODOS: MetodoPago[] = ['mercadopago', 'transferencia', 'efectivo']

export function CobranzaDetalleScreen() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [cuota, setCuota] = useState<ItemCobranza | null>(null)
  const [cargando, setCargando] = useState(true)
  const [monto, setMonto] = useState('')
  const [metodo, setMetodo] = useState<MetodoPago>('mercadopago')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getCuota(id).then((c) => {
      setCuota(c)
      if (c) setMonto(String(Math.max(c.montoEsperado - c.montoPagado, 0)))
      setCargando(false)
    })
  }, [id])

  if (cargando) return <Cargando />
  if (!cuota) return <div className="empty">No se encontró la cuota.</div>

  const saldo = cuota.montoEsperado - cuota.montoPagado
  const esPaquete = cuota.estado === 'paquete'

  const guardar = async () => {
    const valor = Number(monto)
    if (!valor || valor <= 0) return
    setGuardando(true)
    try {
      await registrarPago(cuota.id, valor, metodo)
      toast('Pago registrado', 'success')
      navigate(-1)
    } catch {
      setGuardando(false)
      toast('No se pudo registrar el pago. Intentá de nuevo.', 'error')
    }
  }

  return (
    <>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
            <Icon name="chevron-left" size={22} />
          </button>
          <div>
            <h1>{cuota.nombre}</h1>
            <div className="sub">{cuota.detalle}</div>
          </div>
        </div>
      </div>

      {esPaquete ? (
        <div className="card">
          <div className="row" style={{ borderBottom: 'none' }}>
            <div className="row-main">
              <div className="row-sub">Paquete de clases</div>
              <div className="row-name">{cuota.clasesRestantes} clases restantes</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="metrics">
            <div className="metric">
              <div className="label">Cuota</div>
              <div className="value">{formatPesos(cuota.montoEsperado)}</div>
            </div>
            <div className="metric">
              <div className="label">Pagado</div>
              <div className="value" style={{ color: 'var(--success)' }}>{formatPesos(cuota.montoPagado)}</div>
            </div>
            <div className="metric">
              <div className="label">Saldo</div>
              <div className="value" style={{ color: saldo > 0 ? 'var(--danger)' : 'var(--text-2)' }}>
                {formatPesos(saldo)}
              </div>
            </div>
          </div>

          <div className="section-title">Registrar un pago</div>

          <div className="card">
            <label className="row-sub" htmlFor="monto">Monto</label>
            <input
              id="monto"
              type="number"
              inputMode="numeric"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              style={{
                width: '100%',
                height: 40,
                padding: '0 12px',
                margin: '6px 0 14px',
                border: '0.5px solid var(--border-strong)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: 16,
              }}
            />

            <div className="row-sub" style={{ marginBottom: 6 }}>Método</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {METODOS.map((m) => (
                <button
                  key={m}
                  className={metodo === m ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
                  style={{ flex: 1 }}
                  onClick={() => setMetodo(m)}
                >
                  {nombreMetodo(m)}
                </button>
              ))}
            </div>

            <button className="btn btn-accent btn-block" onClick={guardar} disabled={guardando}>
              <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Registrar pago'}
            </button>
          </div>
        </>
      )}
    </>
  )
}
