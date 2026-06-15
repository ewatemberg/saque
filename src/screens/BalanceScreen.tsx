import { getBalance } from '../data/repo'
import { formatPesos } from '../lib/format'
import { useData } from '../lib/useData'

export function BalanceScreen() {
  const balance = useData(getBalance)

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Balance</h1>
          <div className="sub">junio 2026</div>
        </div>
      </div>

      {balance && (
        <>
          <div className="card" style={{ textAlign: 'center', padding: '20px 14px' }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Ganancia neta del mes</div>
            <div style={{ fontSize: 34, fontWeight: 500, marginTop: 4 }}>{formatPesos(balance.gananciaNeta)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>ingreso bruto − alquiler de canchas</div>
          </div>

          <div className="metrics" style={{ marginTop: 4 }}>
            <div className="metric">
              <div className="label">Ingreso bruto</div>
              <div className="value" style={{ color: 'var(--success)' }}>{formatPesos(balance.ingresoBruto)}</div>
            </div>
            <div className="metric">
              <div className="label">Costo canchas</div>
              <div className="value" style={{ color: 'var(--danger)' }}>{formatPesos(balance.costoCanchas)}</div>
            </div>
            <div className="metric">
              <div className="label">$ real / hora</div>
              <div className="value">{formatPesos(balance.netoPorHora)}</div>
            </div>
          </div>

          <div className="section-title">Ocupación de turnos</div>
          <div className="progress">
            <span style={{ width: `${balance.ocupacionPct}%` }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 5 }}>
            {balance.ocupacionPct}% de los cupos ocupados este mes
          </div>
        </>
      )}
    </>
  )
}
