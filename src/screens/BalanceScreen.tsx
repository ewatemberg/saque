import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { getBalance, getCobranzas, getHistorico } from '../data/repo'
import { formatPesos, mesYAnioActual } from '../lib/format'
import { useData } from '../lib/useData'

export function BalanceScreen() {
  const navigate = useNavigate()
  const balance = useData(getBalance)
  const historico = useData(() => getHistorico(6))
  const cobranzas = useData(getCobranzas)

  const maxNeto = historico ? Math.max(1, ...historico.map((h) => h.neto)) : 1

  const actual = historico?.[historico.length - 1]
  const previo = historico && historico.length > 1 ? historico[historico.length - 2] : null
  const variacion =
    actual && previo
      ? { diff: actual.neto - previo.neto, pct: Math.round(((actual.neto - previo.neto) / (Math.abs(previo.neto) || 1)) * 100), etiqueta: previo.etiqueta }
      : null

  return (
    <>
      <div className="screen-header">
        <div>
          <h1>Balance</h1>
          <div className="sub">{mesYAnioActual()}</div>
        </div>
      </div>

      {balance && (
        <>
          <div className="card" style={{ textAlign: 'center', padding: '20px 14px' }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Ganancia neta del mes</div>
            <div style={{ fontSize: 34, fontWeight: 500, marginTop: 4 }}>{formatPesos(balance.gananciaNeta)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>ingreso bruto − alquiler de canchas − gastos</div>
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

          <div className="card clickable" style={{ marginTop: 4 }} onClick={() => navigate('/gastos')}>
            <div className="card-top">
              <div>
                <div className="row-name" style={{ color: 'var(--danger)' }}>{formatPesos(balance.gastos)} en gastos</div>
                <div className="card-meta">Insumos del mes (pelotas, grips…)</div>
              </div>
              <Icon name="chevron-right" size={18} />
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

      {cobranzas && cobranzas.resumen.falta > 0 && (
        <div
          className="card warning clickable"
          style={{ marginTop: 14 }}
          onClick={() => navigate('/cobranzas')}
        >
          <div className="card-top">
            <div>
              <div className="row-name" style={{ color: 'var(--danger)' }}>
                {formatPesos(cobranzas.resumen.falta)} por cobrar
              </div>
              <div className="card-meta">
                {cobranzas.resumen.deudores} {cobranzas.resumen.deudores === 1 ? 'alumno debe' : 'alumnos deben'} este mes
              </div>
            </div>
            <Icon name="chevron-right" size={18} />
          </div>
        </div>
      )}

      {historico && historico.length > 0 && (
        <>
          <div className="section-title">Ganancia neta · últimos 6 meses</div>
          {variacion && (
            <div style={{ fontSize: 12, color: 'var(--text-2)', margin: '-4px 0 10px' }}>
              {variacion.diff === 0 ? (
                <>Igual que {variacion.etiqueta}</>
              ) : (
                <span style={{ color: variacion.diff > 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {variacion.diff > 0 ? '▲' : '▼'} {Math.abs(variacion.pct)}% vs {variacion.etiqueta}
                </span>
              )}
            </div>
          )}
          <div className="chart">
            {historico.map((h) => (
              <div className="chart-col" key={h.periodo}>
                <div className="chart-val">{formatPesos(h.neto)}</div>
                <div className="chart-track">
                  <div className="chart-bar" style={{ height: `${Math.round((h.neto / maxNeto) * 100)}%` }} />
                </div>
                <div className="chart-label">{h.etiqueta}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
