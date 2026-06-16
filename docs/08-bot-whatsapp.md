# 08 · Bot de WhatsApp (reactivo y gratis)

El bot es **solo reactivo**: el alumno escribe al número del bot (ej. "baja") y el
bot responde dentro de las 24h. Esas respuestas de servicio **no se cobran** en la
API de WhatsApp Cloud. El bot **nunca inicia** mensajes (eso sería una plantilla
paga) — los recordatorios siguen siendo el modo manual (`wa.me`).

Código: [`supabase/functions/whatsapp/index.ts`](../supabase/functions/whatsapp/index.ts).

> ⚠️ Para que siga siendo gratis: el bot solo debe **responder** a mensajes que
> inicia el alumno. No agregar envíos proactivos desde el bot.

## 1. Crear la app de WhatsApp en Meta

1. Entrá a [developers.facebook.com](https://developers.facebook.com) → **My Apps**
   → **Create App** → tipo **Business**.
2. Agregá el producto **WhatsApp**. Meta te da un **número de prueba** gratis y un
   **Access Token** temporal.
3. Anotá: **Phone Number ID** y el **Access Token** (para producción se genera uno
   permanente y se verifica la empresa; para probar, el temporal alcanza).
4. En "API Setup", agregá tu propio celular como **destinatario de prueba** (en
   modo prueba solo podés chatear con números agregados).

## 2. Deployar la Edge Function en Supabase

Opción simple (sin CLI), desde el panel:
1. Supabase → **Edge Functions** → **Create a new function** → nombre `whatsapp`.
2. Pegá el contenido de
   [`supabase/functions/whatsapp/index.ts`](../supabase/functions/whatsapp/index.ts).
3. **Importante:** desactivá **"Verify JWT"** para esta función (Meta no manda el
   token de Supabase). Con CLI sería `supabase functions deploy whatsapp --no-verify-jwt`.
4. En **Edge Functions → Secrets**, cargá:
   - `WHATSAPP_VERIFY_TOKEN` — una palabra que inventás vos (ej. `saque-123`).
   - `WHATSAPP_TOKEN` — el Access Token de Meta.
   - `WHATSAPP_PHONE_ID` — el Phone Number ID.
   - `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (de Project Settings → API).

La URL de la función queda:
`https://pkmvrdemnmkqhjnforob.supabase.co/functions/v1/whatsapp`

## 3. Conectar el webhook en Meta

1. En la app de Meta → **WhatsApp → Configuration → Webhook** → **Edit**.
2. **Callback URL:** la URL de la función (paso 2).
3. **Verify token:** el mismo valor que pusiste en `WHATSAPP_VERIFY_TOKEN`.
4. **Verify and save** (Meta hace un GET; la función responde el challenge).
5. **Subscribe** al campo **messages**.

## 4. Probar

Desde tu celular de prueba, escribile al número del bot la palabra **"baja"**.
El bot busca tu número entre los alumnos, te da de baja del próximo turno y te
responde la confirmación. Si no encuentra el número, te avisa.

## Costos

- **Responder a mensajes del alumno (servicio, dentro de 24h): gratis.**
- Supabase Edge Functions: plan free (500.000 invocaciones/mes).
- Meta puede pedirte cargar un método de pago en la cuenta, pero **este uso
  reactivo no se debita**. Lo que se cobra son los mensajes que inicia el negocio
  (plantillas), que acá no usamos.

## Notas

- En modo prueba solo chatea con números agregados como destinatarios. Para abrir
  a todos los alumnos hay que **verificar la empresa** en Meta (trámite gratuito).
- El bot usa el `service_role` para operar del lado servidor (salta RLS); por eso
  ese secret no debe exponerse nunca en el frontend.
