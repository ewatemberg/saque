// Version de la app. La fuente de verdad es el campo "version" de package.json:
// para publicar una nueva version, bumpeá ahí (ej. 0.1.0 -> 0.2.0) y se refleja
// solo. La fecha de build se calcula al compilar.

export const APP_VERSION = __APP_VERSION__
export const BUILD_DATE = __BUILD_DATE__
