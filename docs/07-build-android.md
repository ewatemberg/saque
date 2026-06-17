# 07 · Build de la app Android (Capacitor)

La app nativa es un **WebView** que envuelve el sitio deployado
(`https://saque.vercel.app`, configurado en `capacitor.config.ts`). Así el login
y todo funcionan igual que en la web, y la app se actualiza sola al publicar.

> iOS necesita **Xcode (solo Mac)**. Esta guía cubre **Android** (sirve en Windows).

## Requisitos (una vez)

1. **Android Studio** (incluye el SDK de Android): https://developer.android.com/studio
2. **JDK 17** (suele venir con Android Studio).
3. Tener corrido `npm install` en el proyecto.

## Pasos

```bash
# 1. Instalar dependencias (incluye Capacitor y el generador de íconos)
npm install

# 2. Build de la web (Capacitor necesita la carpeta dist)
npm run build

# 3. Crear el proyecto Android nativo (solo la primera vez) → crea la carpeta android/
npm run android:add

# 4. Generar los íconos y splash desde assets/ (requiere que android/ ya exista)
npm run icons

# 5. Sincronizar configuración y assets al proyecto nativo
npm run android:sync

# 6. Abrir en Android Studio
npm run android:open
```

> El orden importa: `android:add` debe correr **antes** que `icons`, porque el
> generador de íconos escribe dentro de la carpeta `android/`.

En Android Studio:
- **Run ▶** con un emulador o un celular conectado (modo desarrollador + depuración USB) para probarla.
- Para generar el instalable: **Build → Build Bundle(s) / APK(s) → Build APK(s)** (para probar) o **Build → Generate Signed Bundle / APK** (AAB firmado, para subir a Google Play).

## Publicar en Google Play (paso a paso)

> **Costo:** pago **único** de USD 25 para crear la cuenta de desarrollador (no es
> anual). Después, **todas las actualizaciones son gratis**. Y como la app es un
> WebView del sitio, los cambios de funcionalidad llegan solos al publicar en Vercel:
> solo hace falta resubir el AAB cuando cambia algo **nativo** (ícono, plugins,
> permisos) o cuando Google exige subir el `targetSdk`.

### 1. Crear el AAB firmado

Google Play recibe un **AAB** (Android App Bundle) **firmado**. La firma usa un
*keystore* que tenés que **guardar para siempre**: si lo perdés, no podés volver a
actualizar la app nunca más.

1. Generá el keystore (una sola vez). En la carpeta del proyecto:
   ```bash
   keytool -genkey -v -keystore saque-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias saque
   ```
   Te pide una contraseña y unos datos. **Guardá el archivo `saque-release.jks` y la
   contraseña en un lugar seguro** (no en el repo: ya está en `.gitignore` por las dudas).
2. En Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**,
   elegí el keystore, y generá el `.aab` (queda en `android/app/release/`).
3. **Recomendado:** activá **Play App Signing** en la consola (Google custodia la
   clave final; vos solo subís con tu *upload key*). Así, si perdés el keystore,
   Google te ayuda a recuperar el acceso.

> **Versionado nativo:** cada AAB que subas necesita un **`versionCode` mayor** al
> anterior. Está en `android/app/build.gradle` (`versionCode` y `versionName`).
> Subí el número en cada release. (El `versionName` conviene que coincida con la
> versión del `package.json`.)

### 2. Crear la cuenta y la app

1. Entrá a **Google Play Console** (https://play.google.com/console), pagá los USD 25
   y completá tus datos (puede pedir verificación de identidad).
2. **Crear app** → nombre **Saque**, idioma español, tipo **App**, **Gratis**.

### 3. Ficha de Play Store (store listing)

- **Nombre:** Saque
- **Descripción corta** (máx. 80 caracteres):
  `Agenda de clases para profes de pádel y tenis: turnos, alumnos y cobros.`
- **Descripción completa** (texto sugerido):
  > Saque es la app para profes independientes de pádel y tenis. Organizá tus turnos,
  > controlá quién pagó y quién debe, y mirá tu ganancia real (descontando el alquiler
  > de la cancha). Sin planillas ni mensajes perdidos.
  >
  > • Tu día de un vistazo: todos tus turnos, con cupos y estado.
  > • Turnos que se arman solos: cargás tu franja una vez y generás todo el mes.
  > • Cobranzas sin vueltas: marcás el pago con un toque y recordás por WhatsApp.
  > • Tu ganancia real: balance neto y evolución mes a mes.
  > • Tus alumnos ordenados, con categoría y contacto.
  > • Compartí un link público con tus turnos disponibles.
- **Ícono:** 512×512 PNG → podés usar `public/icon-512.png`.
- **Gráfico destacado (feature graphic):** 1024×500 PNG (obligatorio).
- **Capturas:** mínimo **2** de teléfono (recomendado 4-6: Hoy, Cobranzas, Balance,
  detalle de turno). Sacalas del celular o del navegador en tamaño móvil.
- **Categoría:** Deportes (o Productividad). **Email de contacto:** emilio.watemberg@gmail.com.
- **Política de privacidad (obligatoria):** `https://saque.vercel.app/#/privacidad`

### 4. Formularios obligatorios

- **Acceso a la app (App access):** ⚠️ **Importante.** Como Saque **requiere login**,
  el revisor de Google necesita poder entrar. En "App access" cargá **credenciales de
  prueba** (un email + cómo recibir el link mágico, o mejor, una cuenta de Google de
  prueba). Si no, **rechazan la app** por no poder revisarla.
- **Seguridad de los datos (Data safety):** declarás qué datos recopilás. Saque guarda
  email (login), y los datos que el profe carga de sus alumnos (nombre, teléfono,
  categoría). No se comparten con terceros ni se usan para publicidad.
- **Clasificación de contenido:** cuestionario → da apta para todo público.
- **Público objetivo:** adultos (no dirigida a menores).

### 5. Subir y publicar

1. Empezá por el track de **Pruebas internas** (Internal testing): subís el AAB y lo
   probás vos/tu profe sin esperar revisión completa.
2. Cuando esté ok, promovés a **Producción**. La primera publicación pasa por
   **revisión de Google** (suele tardar de unas horas a unos días).

## Cosas a tener en cuenta

- **Política "webview/spam":** Google a veces rechaza apps que son *solo* un sitio
  envuelto sin valor propio. Saque es una app funcional completa, así que en general
  no hay problema; describila como la herramienta que es (gestión de clases), no como
  "un acceso a una web".
- **`targetSdk`:** Google sube el mínimo cada ~1-2 años. Cuando lo pida, recompilás y
  resubís (gratis). El `targetSdk` se ajusta en `android/app/build.gradle`.
- La carpeta `android/` y el keystore se generan localmente y están en `.gitignore`
  (no se suben al repo).
- El `appId` es `app.saque` (en `capacitor.config.ts`) — es el identificador único en
  la store y **no se puede cambiar** una vez publicado.
- Si más adelante querés la app **offline** (web empaquetada en vez de WebView del
  sitio), quitá el bloque `server` de `capacitor.config.ts`, corré `npm run build` y
  luego `npm run android:sync`. Eso requiere configurar el login nativo con deep links
  (paso extra).
