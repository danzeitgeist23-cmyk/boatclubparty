# SITEMAP — boatclubparty.com

> Actualizado: 2026-07-05 · checkpoint F. Regla: todo commit que cambie rutas actualiza este archivo.
> Router: `react-router-dom` v7 con **HashRouter** (`/#/ruta`). Rutas definidas en `src/App.tsx`.

## Estados

`✅ live` implementado y funcional · `🚧 placeholder` existe pero incompleto · `🔜 F–M` pendiente, con su checkpoint

## Público

| Ruta | Página | Estado | Notas |
|---|---|---|---|
| `/` | HomePage | ✅ live (G) | OceanBeat completo: nav sticky, hero, countdown Atlantic/Canary, events (Supabase+fallback), gallery+lightbox, why us, reviews, check-in, FAQ+booking promise, newsletter→leads, footer, WhatsApp flotante. Fotos reales pendientes en `/public/assets/` (placeholders con ancla) |
| `/music` | MusicPage | ✅ live (I) | 2 radios Ibiza en vivo (URLs desde settings) + Mixcloud embeds (user + DJs). RadioContext a nivel App: el player persiste al navegar; MiniPlayer global |
| `/events/:slug` | EventPage | ✅ live | Ficha: cover, géneros/BPM, lineup (event_djs), selector invitados, precio con descuento tier+family si hay sesión, book+share WhatsApp |
| `/djs` | DjsPage | ✅ live | DJs activos con foto, tagline, Instagram/Mixcloud |
| `/blog` | BlogPage | ✅ live | Estructura espejo de blog.html actual: categorías Todos/Destino/Música/Guías + estado vacío. Posts desde tabla `posts` |
| `/blog/:slug` | PostPage | ✅ live | Artículo con markdown ligero + share WhatsApp |
| `/gallery` | GalleryPage | 🔜 K | Fotos por evento + CTA "Get your photos" (hoy sección `#gallery` en home) |
| `/media/:eventSlug` | EventMediaPage | 🔜 K | Venta fotos/vídeo: previews watermark + "Buy via WhatsApp" con mensaje prellenado |
| `/family` | FamilyPage | 🔜 J | Landing Boat Club Family: perks, descuento permanente, CTA join |

## Cliente (Supabase Auth, rol `customer`)

| Ruta | Página | Estado | Notas |
|---|---|---|---|
| `/login` | AuthPage | ✅ live (H) | Login + registro cliente (signUp con full_name → trigger crea profile). Con sesión redirige a /account |
| `/account` | AccountPage | ✅ live (H) | Mis datos + WhatsApp (update en `profiles`) |
| `/account/bookings` | BookingsPage | ✅ live (H) | Mis reservas + estado (tickets `user_id = auth.uid()` con join a events) |
| `/account/rewards` | RewardsPage | ✅ live (H) | Tier real desde DB, progreso al siguiente, % combinado (tope 25%), badge Family |

## Admin (rol `admin` — check de rol vía `profiles.role`, no solo sesión)

| Ruta | Página | Estado | Notas |
|---|---|---|---|
| `/admin/login` | LoginPage | ✅ live | Supabase Auth. Será login compartido cliente/admin (checkpoint H) |
| `/admin/dashboard` | DashboardPage | ✅ live → ampliar | Añadir revenue + nuevos usuarios |
| `/admin/events` | EventsPage | ✅ live | Listado + sold-out + delete |
| `/admin/events/new` · `/admin/events/:id/edit` | EventFormPage | ✅ live | CRUD completo: barco/fiesta, fechas, precios, capacidad, géneros/BPM, cover, descripción y lineup de DJs (headliner/support) |
| `/admin/djs` | DjsAdminPage | ✅ live | Alta/edición de DJs (foto, tagline, IG, Mixcloud) + mostrar/ocultar |
| `/admin/customers` | CustomersPage | 🔜 H/J | Lista profiles + toggle Family + tier visible |
| `/admin/media` | MediaAdminPage | 🔜 K | Upload a Storage (buckets `media`/`previews`), asignar evento, precio |
| `/admin/connectors` | ConnectorsPage | 🔜 L | Editor de `settings`: GA4, Google Ads, Meta Pixel, WhatsApp, Mixcloud, radios, % Family |
| `/admin/docs` | DocsPage | 🔜 L/M | Render de `/docs/*.md` desde el propio bundle |

`*` → redirige a `/`.

Guard de `/admin/*`: `AdminRoute` (H) exige sesión + `profiles.role === 'admin'`; un customer rebota a `/account`. La DB lo exige igualmente vía RLS (`is_admin()`).
