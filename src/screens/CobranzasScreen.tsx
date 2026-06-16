import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { generarAbonosDelMes, getCobranzas, registrarPago } from '../data/repo'
import { SesionContext, linkCobroDeSesion } from '../lib/auth'
import { descargarCSV } from '../lib/csv'
import { formatPesos, mesActual, mesYAnioActual, nombreMetodo, normalizar } from '../lib/format'
import { toast } from '../lib/toast'
import { abrirWhatsApp, mensajeRecordatorioCuota } from '../lib/whatsapp'
import type { ItemCobranza, MetodoPago, ResumenMes } from '../types'

const METODOS: MetodoPago[] = ['efectivo', 'transferencia', 'mercadopago']

export function CobranzasScreen() {
  const session = useContext(SesionContext)
  const linkCobro = linkCobroDeSesion(session)
  const [busca, setBusca] = useState('')
  const [data, setData] = useState<{ resumen: ResumenMes; items: ItemCobranza[] } | null>(null)
  const reload = useCallback(() => {
    getCobranzas().then(setData)
  }, [])
  useEffect(() => {
    reload()
  }, [reload])

  const generar = async () => {
    const input = window.prompt('Cuota mensual por defecto, para alumnos fijos sin monto propio (en $):', '25000')
    if (input === null) return
    try {
      const creadas = await generarAbonosDelMes(Number(input) || 0)
      await reload()
      toast(
        creadas > 0 ? `Se generaron ${creadas} cuota(s) del mes.` : 'No había cuotas nuevas para generar.',
        creadas > 0 ? 'success' : 'info',
      )
    } catch {
      toast('No se pudieron generar las cuotas. Intentá de nuevo.', 'error')
    }
  }

  if (!data) {
    return (
      <>
        <Header />
        <Cargando />
      </>
    )
  }

  const { resumen, items } = data
  const pct = resumen.esperado > 0 ? Math.round((resumen.cobrado / resumen.esperado) * 100) : 0
  const q = normalizar(busca)
  const itemsFiltrados = q ? items.filter((i) => normalizar(i.nombre).includes(q)) : items
  const hayMuchos = items.length > 5

  const recordarMasivo = () => {
    const pago = linkCobro.trim() ? ` Podés pagarla por acá: ${linkCobro.trim()}` : ''
    abrirWhatsApp(
      `Hola! Te recuerdo que está pendiente la cuota de ${mesActual()}.${pago} Cualquier cosa me avisás. ¡Gracias!`,
    )
  }

  return (
    <>
      <Header />

      <div className="metrics">
        <div className="metric">
          <div className="label">Esperado</div>
          <div className="value">{formatPesos(resumen.esperado)}</div>
        </div>
        <div className="metric">
          <div className="label">Cobrado</div>
          <div className="value" style={{ color: 'var(--success)' }}>
            {formatPesos(resumen.cobrado)}
          </div>
        </div>
        <div className="metric">
          <div className="label">Falta</div>
          <div className="value" style={{ color: 'var(--danger)' }}>
            {formatPesos(resumen.falta)}
          </div>
        </div>
      </div>

      <div className="progress">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', margin: '5px 0 14px' }}>
        {pct}% cobrado · {resumen.deudores} {resumen.deudores === 1 ? 'alumno debe' : 'alumnos deben'}
      </div>

      {resumen.deudores > 0 && (
        <button className="btn btn-accent btn-block" onClick={recordarMasivo} style={{ marginBottom: 14 }}>
          <Icon name="whatsapp" size={16} /> Recordar a los que deben ({resumen.deudores})
        </button>
      )}

      <button
        className="btn btn-block"
        style={{ marginBottom: 6 }}
        onClick={generar}
        title="Crea la cuota mensual de cada alumno fijo que aún no la tenga este mes. No duplica ni cobra nada."
      >
        <Icon name="plus" size={16} /> Generar cuotas del mes
      </button>
      <p style={{ fontSize: 11.5, color: 'var(--text-2)', margin: '0 0 14px', lineHeight: 1.45 }}>
        Crea la cuota del mes de cada alumno fijo que todavía no la tenga. No duplica ni cobra nada: solo
        arma lo que esperás cobrar. El cobro lo registrás después con el botón de cobro de cada alumno.
      </p>

      {items.length > 0 && (
        <button
          className="btn btn-block"
          style={{ marginBottom: 14 }}
          onClick={() =>
            descargarCSV(
              'cobranzas-saque.csv',
              ['Alumno', 'Detalle', 'Estado', 'Esperado', 'Pagado', 'Método'],
              items.map((i) => [i.nombre, i.detalle, i.estado, i.montoEsperado, i.montoPagado, i.metodo ?? '']),
            )
          }
        >
          <Icon name="download" size={16} /> Exportar a CSV
        </button>
      )}

      {items.length === 0 && (
        <div className="empty">
          No hay cuotas este mes todavía. Tocá "Generar cuotas del mes" para crear las de tus alumnos fijos.
        </div>
      )}

      {hayMuchos && (
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-3)' }}>
            <Icon name="search" size={18} />
          </span>
          <input
            className="input"
            style={{ paddingLeft: 38 }}
            placeholder="Buscar alumno…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      )}

      {items.length > 0 && itemsFiltrados.length === 0 && (
        <div className="empty">Ningún alumno coincide con “{busca}”.</div>
      )}

      {itemsFiltrados.map((item) => (
        <CobranzaRow key={item.alumnoId} item={item} onReload={reload} linkCobro={linkCobro} />
      ))}
    </>
  )
}

function Header() {
  return (
    <div className="screen-header">
      <h1>Cobranzas</h1>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)' }}>
        <Icon name="chevron-left" size={16} /> {mesYAnioActual()} <Icon name="chevron-right" size={16} />
      </span>
    </div>
  )
}

function CobranzaRow({ item, onReload, linkCobro }: { item: ItemCobranza; onReload: () => void; linkCobro: string }) {
  const navigate = useNavigate()
  const [cobrando, setCobrando] = useState(false)
  const saldo = item.montoEsperado - item.montoPagado
  const puedeCobrar = (item.estado === 'debe' || item.estado === 'parcial') && saldo > 0

  const cobrar = async (metodo: MetodoPago) => {
    try {
      await registrarPago(item.id, saldo, metodo)
      setCobrando(false)
      onReload()
      toast(`Cobro registrado: ${formatPesos(saldo)} (${nombreMetodo(metodo)})`, 'success')
    } catch {
      toast('No se pudo registrar el cobro. Intentá de nuevo.', 'error')
    }
  }

  return (
    <div>
      <div className="row clickable" onClick={() => navigate(`/cobranza/${item.id}`)}>
        <span className={`avatar ${avatarVariant(item)}`}>{item.iniciales}</span>
        <div className="row-main">
          <div className="row-name">{item.nombre}</div>
          <div className="row-sub">
            {item.detalle}
            {item.metodo ? ` · ${nombreMetodo(item.metodo)}` : ''}
          </div>
        </div>
        <div className="row-right">
          {estadoNode(item, linkCobro)}
          {puedeCobrar && (
            <button
              className={cobrando ? 'btn btn-sm btn-accent' : 'btn btn-sm'}
              aria-label={`Cobrar a ${item.nombre}`}
              title="Marcar como cobrado"
              onClick={(e) => {
                e.stopPropagation()
                setCobrando((v) => !v)
              }}
            >
              <Icon name="cash" size={16} />
            </button>
          )}
        </div>
      </div>

      {cobrando && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '4px 0 12px' }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Cobrar {formatPesos(saldo)} en:</span>
          {METODOS.map((m) => (
            <button key={m} className="btn btn-sm" onClick={() => cobrar(m)}>
              {nombreMetodo(m)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function avatarVariant(item: ItemCobranza): string {
  if (item.estado === 'debe') return 'danger'
  if (item.estado === 'parcial') return 'warning'
  if (item.estado === 'paquete') return 'neutral'
  return ''
}

function RecordarBtn({ item, linkCobro }: { item: ItemCobranza; linkCobro: string }) {
  const saldo = item.montoEsperado - item.montoPagado
  return (
    <button
      className="btn btn-sm"
      aria-label={`Recordar a ${item.nombre} por WhatsApp`}
      title="Recordar por WhatsApp"
      onClick={(e) => {
        e.stopPropagation()
        abrirWhatsApp(
          mensajeRecordatorioCuota(item.nombre, mesActual(), saldo > 0 ? formatPesos(saldo) : undefined, linkCobro),
          item.telefono,
        )
      }}
    >
      <Icon name="whatsapp" size={16} />
    </button>
  )
}

function estadoNode(item: ItemCobranza, linkCobro: string) {
  switch (item.estado) {
    case 'pagado':
      return <span className="pill pill-success">pagó {formatPesos(item.montoPagado)}</span>
    case 'debe':
      return (
        <>
          <span className="pill-warning" style={{ fontSize: 11, color: 'var(--danger)' }}>
            debe {formatPesos(item.montoEsperado)}
          </span>
          <RecordarBtn item={item} linkCobro={linkCobro} />
        </>
      )
    case 'parcial':
      return (
        <>
          <span className="pill-warning" style={{ fontSize: 11 }}>
            parcial {formatPesos(item.montoPagado)}/{formatPesos(item.montoEsperado)}
          </span>
          <RecordarBtn item={item} linkCobro={linkCobro} />
        </>
      )
    case 'paquete':
      return <span className="pill pill-neutral">{item.clasesRestantes} clases rest.</span>
    default:
      return null
  }
}
