import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.saque',
  appName: 'Saque',
  webDir: 'dist',
  // La app nativa es un "envoltorio" (WebView) del sitio ya deployado. Así el
  // login con Google y el link mágico funcionan igual que en la web, y la app
  // se actualiza sola al publicar. Para empaquetar la web localmente (offline),
  // borrar este bloque "server" y usar `npm run build` + `cap sync`.
  server: {
    url: 'https://saque.vercel.app',
    cleartext: false,
  },
}

export default config
