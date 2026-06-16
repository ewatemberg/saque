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
- [x] Color por defecto según deporte (pádel=azul, tenis=naranja); editable por el profe
- [x] PWA: manifest + íconos para instalar con "Agregar a inicio" (standalone, ícono propio)
- [x] Onboarding (checklist de 4 pasos para profe nuevo) y estados vacíos
- [x] Onboarding paso 1 reformulado: "elegí del listado" (canchas compartidas), no "creá"
- [x] Landing público /conocer (marketing) accesible desde el login
- [x] Demos animados por feature en el landing (mini-maquetas en modal, "simil video")
- [x] Recordatorio de cobro por WhatsApp (mensaje prearmado al chat del alumno, mes dinámico)
- [x] Página pública compartible (/c/:id): calendario semanal con cupos libres y categoría, sin datos sensibles, con CTA "Reservar por WhatsApp"
- [x] Toasts de éxito/error en guardados y acciones (antes fallaban en silencio)
- [x] Búsqueda de alumnos y de canchas
- [x] Filtro por categoría en Alumnos
- [x] Fix: canchas filtradas por deporte de forma confiable (contexto de sesión, sin race)
- [x] Aviso de cancha duplicada al crear (sugiere usar la existente)
- [x] Exportar a CSV (alumnos y cobranzas)
- [x] Reportes: gráfico de ganancia neta de los últimos 6 meses en Balance
- [x] Balance: variación mes vs mes y atajo "por cobrar" (deudores) que lleva a Cobranzas
- [x] Cobro rápido desde la lista de Cobranzas (un toque → elegir método → registra el saldo)
- [x] Buscador de alumnos en Cobranzas (filtrar y marcar el pago rápido con muchos alumnos)
- [x] Selector de color libre en Apariencia (además de los 5 presets)
- [x] Pantalla de Ayuda (guía de uso) accesible desde el pie
- [x] Menú (5ª pestaña): mueve Franjas/Canchas/Apariencia/Ayuda/Acerca/Términos/Cerrar sesión a un lugar visible
- [x] Calendario semanal más prolijo (resalta hoy, contador por día, vacíos sutiles)
- [x] Tooltips (title) + hover en los íconos del header
- [x] Animación de carga temática (pelota que gira y rebota) en todos los "Cargando"
- [x] El profe elige su deporte (pádel/tenis) al entrar; las canchas se filtran por deporte
- [x] ABM de canchas (compartidas entre profes: dirección, contacto, costo de referencia)
- [x] ABM de turnos: crear (con selector de cancha), editar y eliminar desde la app
- [x] Términos y Política de Privacidad (pantallas públicas + aceptación en el login)
- [x] Generar los abonos del mes con un botón (cuota mensual por alumno fijo)
- [x] Franjas recurrentes (plantilla con roster + generar turnos del mes con manejo de choques)
- [x] Setup de build Android (Capacitor como WebView del sitio + íconos)
- [x] Deploy de la web en Vercel (saque.vercel.app) con auto-deploy en cada push
- [x] Página pública "Mi página": el profe carga nombre/WhatsApp y comparte el link
- [x] Avisos por WhatsApp: lugar libre, recordatorio de cobro y recupero de turno
- [ ] Importar contacto en la app nativa de iOS (en Android y web ya funciona)
- [ ] Aviso de cambio de precio por WhatsApp
- [ ] Pruebas con el primer profe (testeo real)

## Fase 2 — Mejoras

- [x] Reprogramación de turnos suspendidos (recupero): nueva fecha/hora + aviso por WhatsApp
- [x] Dashboard de balance derivado de datos reales (ingreso, costo, neto, ocupación, mes vs mes)
- [ ] Paquetes de clases para alumnos ocasionales
- [ ] Builds nativas y publicación en stores
- ~~Lista de espera inteligente para tapar huecos~~ (descartada: si un alumno no consigue lugar, suele irse a otro lado)

## Fase 3 — A futuro

- [x] Bot de WhatsApp REACTIVO (gratis): Edge Function `whatsapp` para "baja" — falta setup de Meta + deploy
- [ ] Bot proactivo / recordatorios automáticos (plantillas pagas — no se hará por ahora)
- [x] Soporte para tenis (el profe elige pádel/tenis; canchas y estética se adaptan)
- [x] Cobro con MercadoPago (versión simple): el profe carga su link de pago y se suma a los recordatorios por WhatsApp
- [ ] Cobro integrado con conciliación automática (OAuth + webhook — requiere registrar la app en MP Developers)
- [ ] Detección de alumnos en riesgo de dejar (retención)
- [ ] Streaming de partidos / clases
