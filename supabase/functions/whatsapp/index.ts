// Bot de WhatsApp de Saque — SOLO REACTIVO (gratis).
//
// El alumno escribe al número del bot (ej. "baja") y el bot responde dentro de
// la ventana de 24h. Las respuestas de servicio (iniciadas por el usuario) no
// tienen costo en la API de WhatsApp Cloud. El bot NUNCA inicia mensajes
// (eso sería una plantilla paga); los recordatorios siguen siendo manuales.
//
// Edge Function de Supabase (Deno). Ver docs/08-bot-whatsapp.md para el setup.
//
// Secrets requeridos (Supabase → Edge Functions → Secrets):
//   WHATSAPP_VERIFY_TOKEN   (lo inventás vos; se usa al conectar el webhook)
//   WHATSAPP_TOKEN          (Access Token de la app de WhatsApp en Meta)
//   WHATSAPP_PHONE_ID       (Phone Number ID del número del bot)
//   SUPABASE_URL            (URL del proyecto)
//   SUPABASE_SERVICE_ROLE_KEY (service role: el bot opera del lado servidor)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') ?? ''
const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN') ?? ''
const PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID') ?? ''

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

const soloDigitos = (s: string) => (s ?? '').replace(/[^0-9]/g, '')

async function responder(a: string, texto: string) {
  await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: a,
      type: 'text',
      text: { body: texto },
    }),
  })
}

async function procesarBaja(waId: string): Promise<string> {
  const tel = soloDigitos(waId)

  // Buscar al alumno por teléfono (comparando solo dígitos).
  const { data: alumnos } = await supabase.from('alumnos').select('id,nombre,telefono')
  const alumno = (alumnos ?? []).find((x) => {
    const t = soloDigitos(x.telefono)
    return t && (t === tel || t.endsWith(tel) || tel.endsWith(t))
  })
  if (!alumno) {
    return 'No encontramos tu número entre los alumnos. Avisale a tu profe.'
  }

  const hoy = new Date().toISOString().slice(0, 10)

  // Próxima inscripción del alumno (turno de hoy en adelante).
  const { data: insc } = await supabase
    .from('inscripciones')
    .select('id, turnos!inner(id,fecha,hora,estado)')
    .eq('alumno_id', alumno.id)
    .gte('turnos.fecha', hoy)
    .order('turnos(fecha)', { ascending: true })
    .limit(1)

  const fila = (insc ?? [])[0] as { id: string; turnos: { fecha: string; hora: string } } | undefined
  if (!fila) {
    return `Hola ${alumno.nombre.split(' ')[0]}! No tenés turnos próximos para dar de baja.`
  }

  await supabase.from('inscripciones').delete().eq('id', fila.id)
  return `Listo ${alumno.nombre.split(' ')[0]}, te dimos de baja del turno del ${fila.turnos.fecha} ${fila.turnos.hora}. ¡Gracias por avisar!`
}

Deno.serve(async (req) => {
  const url = new URL(req.url)

  // 1) Verificación del webhook (Meta hace un GET al conectar).
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new Response(challenge ?? '', { status: 200 })
    }
    return new Response('forbidden', { status: 403 })
  }

  // 2) Mensajes entrantes.
  if (req.method === 'POST') {
    try {
      const body = await req.json()
      const msg = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
      if (msg && msg.type === 'text') {
        const from: string = msg.from
        const texto: string = (msg.text?.body ?? '').trim().toLowerCase()

        let respuesta: string
        if (texto.includes('baja')) {
          respuesta = await procesarBaja(from)
        } else {
          respuesta = 'Hola! Escribí "baja" para darte de baja de tu próximo turno.'
        }
        await responder(from, respuesta)
      }
    } catch (_e) {
      // Igual respondemos 200 para que Meta no reintente en loop.
    }
    return new Response('ok', { status: 200 })
  }

  return new Response('method not allowed', { status: 405 })
})
