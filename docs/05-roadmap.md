# 05 · Roadmap

## Fase 0 — Esqueleto (actual)

- [x] Proyecto React + TypeScript + Vite
- [x] Navegación y las 4 secciones (Hoy, Cobranzas, Alumnos, Balance)
- [x] Pantallas Hoy y Cobranzas funcionando con datos de ejemplo
- [x] Capa de datos mock con la misma firma que tendrá Supabase
- [x] Capacitor configurado para empaquetar a móvil
- [x] Esquema de base de datos (SQL + RLS) y capa de acceso a Supabase
- [x] Login con email (link mágico) y Google
- [x] Despachador mock / Supabase transparente para las pantallas

## Fase 1 — MVP usable con un profe real

- [x] Auth con email/Google (Supabase)
- [x] Tablas reales en Supabase y lectura desde la app
- [x] Detalle de turno: marcar asistencia, dar de baja, anotar alumno, suspender/reactivar
- [x] Registrar pagos (monto + método) con recálculo de estado y totales
- [x] Alta de alumno (con importar contacto del teléfono en móvil)
- [x] Editar y eliminar alumno
- [x] Vista de calendario semanal (con navegación entre semanas)
- [x] Apariencia: modo claro/oscuro/auto y color de acento (guardado en el dispositivo)
- [x] PWA: manifest + íconos para instalar con "Agregar a inicio" (standalone, ícono propio)
- [x] Onboarding (checklist de 4 pasos para profe nuevo) y estados vacíos
- [x] Toasts de éxito/error en guardados y acciones (antes fallaban en silencio)
- [x] El profe elige su deporte (pádel/tenis) al entrar; las canchas se filtran por deporte
- [x] ABM de canchas (compartidas entre profes: dirección, contacto, costo de referencia)
- [x] ABM de turnos: crear (con selector de cancha), editar y eliminar desde la app
- [x] Términos y Política de Privacidad (pantallas públicas + aceptación en el login)
- [x] Generar los abonos del mes con un botón (cuota mensual por alumno fijo)
- [x] Franjas recurrentes (plantilla con roster + generar turnos del mes con manejo de choques)
- [x] Setup de build Android (Capacitor como WebView del sitio + íconos)
- [ ] Login con Google (código listo; falta activar el provider en Supabase)
- [ ] Importar contacto en iOS y en la app nativa (plugin de Capacitor)
- [ ] Deploy de la web (Vercel/Netlify) para probar desde el celular
- [ ] ABM de canchas, franjas, turnos y alumnos
- [ ] Cargar asistencia y dar de baja en el detalle del turno
- [ ] Generación de abonos a principio de mes
- [ ] Registrar pagos (método + fecha)
- [ ] Avisos por WhatsApp (lugar libre, suspensión, cambio de precio)
- [ ] Pruebas con el primer profe (testeo real)

## Fase 2 — Mejoras

- [ ] Lista de espera inteligente para tapar huecos
- [ ] Reprogramación de turnos suspendidos (recupero) completa
- [ ] Paquetes de clases para alumnos ocasionales
- [ ] Dashboard de balance derivado de datos reales
- [ ] Builds nativas y publicación en stores

## Fase 3 — A futuro

- [ ] Bot de WhatsApp para altas/bajas (API oficial)
- [ ] Soporte para tenis y otros deportes de raqueta
- [ ] Cobro integrado (API de MercadoPago)
- [ ] Detección de alumnos en riesgo de dejar (retención)
- [ ] Streaming de partidos / clases
