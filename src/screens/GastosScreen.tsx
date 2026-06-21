import { type CSSProperties, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icon } from '../components/Icon'
import { crearGasto, eliminarGasto, getGastos } from '../data/repo'
import { formatFechaCorta, formatPesos } from '../lib/format'
import { toast } from '../lib/toast'
import type { Gasto } from '../types'

const inputStyle: CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  margin: '6px 0 12px',
  border: '0.5px solid var(--border-strong)',
  borderRadius: 'var(--radius)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: 'inherit',
  fontSize: 16,
  boxSizing: 'border-box',
}

function hoyISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function diasDesde(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((hoy.getTime() - fecha.getTime()) / 86400000))
}

export function GastosScreen() {
  const navigate = useNavigate()
  const [gastos, setGastos] = useState<Gasto[] | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [concepto, setConcepto] = useState('Pelotas')
  const [cantidad, setCantidad] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(hoyISO())
  const [guardando, setGuardando] = useState(false)
  const [aBorrar, setABorrar] = useState<Gasto | null>(null)

  const reload = useCallback(() => {
    getGastos()
      .then(setGastos)
      .catch(() => {
        setGastos([])
        toast('No se pudieron cargar los gastos. Intentá de nuevo.', 'error')
      })
  }, [])
  useEffect(() => {
    reload()
  }, [reload])

  const guardar = async () => {
    if (!concepto.trim() || !(Number(monto) > 0)) {
      toast('Poné un concepto y un monto.', 'error')
      return
    }
    setGuardando(true)
    try {
      await crearGasto({
        concepto: concepto.trim(),
        cantidad: cantidad ? Number(cantidad) : null,
        monto: Number(monto),
        fecha,
      })
      toast('Gasto registrado', 'success')
      setConcepto('Pelotas')
      setCantidad('')
      setMonto('')
      setFecha(hoyISO())
      setMostrarForm(false)
      reload()
    } catch {
      toast('No se pudo guardar. Intentá de nuevo.', 'error')
    } finally {
      setGuardando(false)
    }
  }

  const header = (
    <div className="screen-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="icon-btn" aria-label="Volver" onClick={() => navigate(-1)}>
          <Icon name="chevron-left" size={22} />
        </button>
        <div>
          <h1>Gastos</h1>
          <div className="sub">Insumos y compras</div>
        </div>
      </div>
    </div>
  )

  if (!gastos) {
    return (
      <>
        {header}
        <Cargando />
      </>
    )
  }

  const mesActualISO = hoyISO().slice(0, 7)
  const totalMes = gastos.filter((g) => g.fecha.slice(0, 7) === mesActualISO).reduce((s, g) => s + g.monto, 0)
  const ultima = gastos[0] // vienen ordenados por fecha desc

  return (
    <>
      {header}

      <div className="metrics">
        <div className="metric">
          <div className="label">Gastos del mes</div>
          <div className="value" style={{ color: 'var(--danger)' }}>{formatPesos(totalMes)}</div>
        </div>
        <div className="metric" style={{ flex: 2 }}>
          <div className="label">Última compra</div>
          <div className="value" style={{ fontSize: 15 }}>
            {ultima ? (
              <>
                {diasDesde(ultima.fecha) === 0 ? 'hoy' : `hace ${diasDesde(ultima.fecha)} día${diasDesde(ultima.fecha) === 1 ? '' : 's'}`}
                <span className="card-meta"> · {ultima.concepto}</span>
              </>
            ) : (
              '—'
            )}
          </div>
        </div>
      </div>

      {!mostrarForm && (
        <button className="btn btn-accent btn-block" style={{ marginTop: 8, marginBottom: 14 }} onClick={() => setMostrarForm(true)}>
          <Icon name="plus" size={16} /> Registrar gasto
        </button>
      )}

      {mostrarForm && (
        <div className="card" style={{ marginTop: 8 }}>
          <label className="row-sub" htmlFor="concepto">Concepto</label>
          <input id="concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Ej. Pelotas" style={inputStyle} />

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="row-sub" htmlFor="cantidad">Cantidad (opcional)</label>
              <input id="cantidad" type="number" inputMode="numeric" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="4" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="row-sub" htmlFor="monto">Monto</label>
              <input id="monto" type="number" inputMode="numeric" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="18000" style={inputStyle} />
            </div>
          </div>

          <label className="row-sub" htmlFor="fecha">Fecha</label>
          <input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={inputStyle} />

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-block" style={{ flex: 1 }} onClick={() => setMostrarForm(false)}>Cancelar</button>
            <button className="btn btn-accent btn-block" style={{ flex: 1 }} onClick={guardar} disabled={guardando}>
              <Icon name="check" size={16} /> {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {gastos.length === 0 && !mostrarForm && (
        <div className="empty">Todavía no registraste gastos. Anotá tu primera compra de pelotas.</div>
      )}

      {gastos.map((g) => (
        <div className="row" key={g.id}>
          <div className="row-main">
            <div className="row-name">
              {g.concepto}
              {g.cantidad != null && <span className="card-meta"> · {g.cantidad} u.</span>}
            </div>
            <div className="row-sub">{formatFechaCorta(g.fecha)}</div>
          </div>
          <div className="row-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--danger)', fontSize: 14 }}>{formatPesos(g.monto)}</span>
            <button className="btn btn-sm" aria-label={`Eliminar ${g.concepto}`} style={{ color: 'var(--danger)' }} onClick={() => setABorrar(g)}>
              <Icon name="trash" size={15} />
            </button>
          </div>
        </div>
      ))}

      {aBorrar && (
        <ConfirmDialog
          titulo="Eliminar gasto"
          mensaje={<>¿Eliminar <strong>{aBorrar.concepto}</strong> de {formatPesos(aBorrar.monto)}?</>}
          confirmLabel="Eliminar"
          peligro
          onConfirm={() => {
            const id = aBorrar.id
            setABorrar(null)
            eliminarGasto(id)
              .then(() => {
                toast('Gasto eliminado', 'success')
                reload()
              })
              .catch(() => toast('No se pudo eliminar.', 'error'))
          }}
          onCancel={() => setABorrar(null)}
        />
      )}
    </>
  )
}
