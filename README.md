# Owney Beauty Web UI

Aplicación Angular 22 + ABP Angular 10.6 para la red social y marketplace de belleza Owney Beauty.

## Desarrollo local

Requisitos: Node.js 22 y la API en `https://localhost:44389`.

```bash
npm install --legacy-peer-deps
npm start
```

La incompatibilidad de *peer dependencies* ya existía en la plantilla: ABP 10.6 declara Angular 21, mientras este proyecto usa Angular 22. El build y las pruebas verifican la combinación utilizada, pero una futura actualización de ABP debe eliminar esta excepción.

## Verificación

```bash
npm run check
```

Este comando ejecuta lint, 21 pruebas Vitest/axe (incluido contraste de los 16 esquemas) y el build de producción. `npm audit --omit=dev` debe permanecer sin vulnerabilidades conocidas.

## Arquitectura

- `core/api-temp`: contratos temporales exactos de Accounts y Platform. Sustituirlos por proxies generados cuando la herramienta de ABP esté disponible.
- `core/auth`, `core/http`, `core/theme`, `core/layout`: sesión, guards, interceptores, temas y shell.
- `shared/ui`: componentes visuales basados en tokens.
- `features/auth`, `account`, `admin`, `legal`: flujos conectados a la API real.
- `features/**/data/*.mock.ts`: contratos e `InjectionToken` para dominios todavía no implementados por la API.

No se usa multi-tenencia. El registro nativo de ABP está desactivado; la UI registra mediante `/api/accounts/registration/register`.

## Railway / Docker

El `Dockerfile` construye la app con Node 22 y la publica con Nginx. Configura estas variables en Railway:

- `APP_URL`: URL pública del frontend, sin barra final.
- `API_URL`: URL pública de la API, sin barra final.

Al iniciar el contenedor, `scripts/40-write-runtime-env.sh` genera `dynamic-env.json`; por eso la misma imagen sirve para cada ambiente. Nginx expone el puerto 80 y aplica fallback a `index.html` para las rutas Angular.

La API también debe permitir `APP_URL` como origen CORS y como redirect URI del cliente OpenIddict `OwneyBeauty_App`.

## Proxies ABP pendientes

Las reglas del repositorio prohíben ejecutar el generador mediante una terminal genérica. Cuando esté disponible la herramienta especializada de ABP, genera los módulos `accounts` y `platform`, reemplaza `core/api-temp` y conserva las interfaces consumidas por las vistas.
