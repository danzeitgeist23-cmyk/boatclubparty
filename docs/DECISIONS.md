# DECISIONS — log de decisiones técnicas

> Formato: fecha · qué · por qué. Solo se añade, nunca se reescribe historia.

- **2026-07-04 · HashRouter en vez de BrowserRouter** · Cloudflare Pages sirve SPA sin config de rewrites; `/#/ruta` evita 404 en deep links. Revisable en fase 2 (SEO de /events/:slug pedirá BrowserRouter + `_redirects`).
- **2026-07-04 · Tailwind v4 con `@theme inline` en index.css, sin tailwind.config** · Es el patrón nativo de v4; todo el theming vive en CSS variables (`:root`/`.dark`), cero colores hardcoded en JSX.
- **2026-07-04 · Tema light por defecto + toggle dark** · Nueva dirección visual estilo OceanBeat; los briefs antiguos "dark/gold" quedan anulados.
- **2026-07-05 · `is_admin()` como función security definer en vez de subquery en policies** · La policy admin de `profiles` consultando `profiles` (como venía en el brief v2) provoca recursión infinita de RLS en Postgres. La función definer corta la recursión y centraliza el check de rol para todas las tablas.
- **2026-07-05 · `bookings_count` se recalcula con `count(*)` de tickets paid, no con incremento** · Idempotente: soporta cancelaciones, re-pagos y correcciones manuales sin desincronizarse.
- **2026-07-05 · Migración v2.1: policies "authenticated" → `is_admin()`** · Hasta ahora "autenticado" == admin. Con el login de clientes (checkpoint H) cualquier turista registrado tendría sesión: sin este cambio podría leer/editar todos los tickets (PII), eventos y leads. Se endurece ANTES de abrir el registro. `own_tickets` cubre al cliente.
- **2026-07-05 · Revoke EXECUTE de funciones de trigger + sin policy de listing en bucket `previews`** · Advisors de Supabase: las funciones de trigger eran invocables por anon vía `/rest/v1/rpc/*`, y la policy de SELECT sobre `previews` permitía listar el bucket entero (la URL pública no la necesita).
- **2026-07-05 · `media_items.full_url` legible públicamente** · Aceptado: apunta al bucket privado `media`; la URL sin firma no da acceso al archivo. La entrega del archivo full es manual (WhatsApp) en fase 1.
- **2026-07-05 · Countdown: wall-clock del evento convertido a UTC vía `Intl` con `Atlantic/Canary`** · El bug histórico (00:00:00) venía de parsear `date+time` en la TZ del navegador del turista. Ahora `eventStartMs()` corrige el offset canario real (UTC+0 invierno / UTC+1 verano) sin librerías.
- **2026-07-05 · El repo vive en disco FAT32 (vfat): `npm install` no funciona ahí (sin symlinks)** · Los builds/dev se hacen en una copia en filesystem Linux (scratchpad/home) y se commitea en el repo original. Recomendado a futuro: mover el proyecto a ext4 o trabajar desde el clon de GitHub.
- **2026-07-05 · Fórmula de descuento en frontend, no en DB** · Fase 1 no cobra online: el sistema calcula y comunica (WhatsApp), el cobro es manual. `precio_final = price_general × (1 - tier%) × (1 - family%)`, tope combinado 25%. Se moverá a DB/edge function cuando haya checkout real (fase 2).
