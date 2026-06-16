import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cargando } from '../components/Cargando'
import { Icon } from '../components/Icon'
import { generarAbonosDelMes, getCobranzas } from '../data/repo'
import { descargarCSV } from '../lib/csv'
import { formatPesos, mesActual, mesYAnioActual, nombreMetodo } from '../lib/format'
import { toast } from '../lib/toast'
import { abrirWhatsApp, mensajeRecordatorioCuota } from '../lib/whatsapp'
import type { ItemCobranza, ResumenMes } from '../types'

export function CobranzasScreen() {
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

  const recordarMasivo = () => {
    abrirWhatsApp(
      `Hola! Te recuerdo que está pendiente la cuota de ${mesActual()}. Cualquier cosa me avisás. ¡Gracias!`,
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

      <button className="btn btn-block" style={{ marginBottom: 10 }} onClick={generar}>
        <Icon name="plus" size={16} /> Generar cuotas del mes
      </button>

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

      {items.map((item) => (
        <CobranzaRow key={item.alumnoId} item={item} />
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

function CobranzaRow({ item }: { item: ItemCobranza }) {
  const navigate = useNavigate()
  return (
    <div className="row clickable" onClick={() => navigate(`/cobranza/${item.id}`)}>
      <span className={`avatar ${avatarVariant(item)}`}>{item.iniciales}</span>
      <div className="row-main">
        <div className="row-name">{item.nombre}</div>
        <div className="row-sub">
          {item.detalle}
          {item.metodo ? ` · ${nombreMetodo(item.metodo)}` : ''}
        </div>
      </div>
      <div className="row-right">{estadoNode(item)}</div>
    </div>
  )
}

function avatarVariant(item: ItemCobranza): string {
  if (item.estado === 'debe') return 'danger'
  if (item.estado === 'parcial') return 'warning'
  if (item.estado === 'paquete') return 'neutral'
  return ''
}

function RecordarBtn({ item }: { item: ItemCobranza }) {
  const saldo = item.montoEsperado - item.montoPagado
  return (
    <button
      className="btn btn-sm"
      aria-label={`Recordar a ${item.nombre} por WhatsApp`}
      title="Recordar por WhatsApp"
      onClick={(e) => {
        e.stopPropagation()
        abrirWhatsApp(
          mensajeRecordatorioCuota(item.nombre, mesActual(), saldo > 0 ? formatPesos(saldo) : undefined),
          item.telefono,
        )
      }}
    >
      <Icon name="whatsapp" size={16} />
    </button>
  )
}

function estadoNode(item: ItemCobranza) {
  switch (item.estado) {
    case 'pagado':
      return <span className="pill pill-success">pagó {formatPesos(item.montoPagado)}</span>
    case 'debe':
      return (
        <>
          <span className="pill-warning" style={{ fontSize: 11, color: 'var(--danger)' }}>
            debe {formatPesos(item.montoEsperado)}
          </span>
          <RecordarBtn item={item} />
        </>
      )
    case 'parcial':
      return (
        <>
          <span className="pill-warning" style={{ fontSize: 11 }}>
            parcial {formatPesos(item.montoPagado)}/{formatPesos(item.montoEsperado)}
          </span>
          <RecordarBtn item={item} />
        </>
      )
    case 'paquete':
      return <span className="pill pill-neutral">{item.clasesRestantes} clases rest.</span>
    default:
      return null
  }
}
