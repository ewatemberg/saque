// Exportar datos a CSV y disparar la descarga, sin dependencias.

function escapar(v: string | number): string {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export function descargarCSV(
  nombreArchivo: string,
  headers: string[],
  filas: (string | number)[][],
): void {
  const lineas = [headers, ...filas].map((f) => f.map(escapar).join(','))
  // El BOM (﻿) hace que Excel abra los acentos correctamente.
  const blob = new Blob(['﻿' + lineas.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}
