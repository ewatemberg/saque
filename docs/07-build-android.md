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

# 2. Generar los íconos y splash desde assets/ (icon-only.svg, etc.)
npm run icons

# 3. Crear el proyecto Android nativo (solo la primera vez)
npm run android:add

# 4. Sincronizar configuración y assets al proyecto nativo
npm run android:sync

# 5. Abrir en Android Studio
npm run android:open
```

En Android Studio:
- **Run ▶** con un emulador o un celular conectado (modo desarrollador + depuración USB) para probarla.
- Para generar el instalable: **Build → Build Bundle(s) / APK(s) → Build APK(s)** (para probar) o **Build → Generate Signed Bundle / APK** (AAB firmado, para subir a Google Play).

## Publicar en Google Play

1. Crear cuenta de **Google Play Console** (pago único de USD 25).
2. Subir el **AAB firmado**.
3. Completar ficha (nombre, ícono, capturas, política de privacidad → usar la URL
   `https://saque.vercel.app/#/privacidad`).

## Notas

- La carpeta `android/` se genera localmente y está en `.gitignore` (no se sube al repo).
- El `appId` es `app.saque` (definido en `capacitor.config.ts`).
- Si más adelante querés la app **offline** (web empaquetada en vez de WebView del
  sitio), quitá el bloque `server` de `capacitor.config.ts`, corré `npm run build`
  y luego `npm run android:sync`. Eso requiere configurar el login nativo con deep
  links (paso extra).
