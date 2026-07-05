# SITEMAP — boatclubparty.com

> Actualizado: 2026-07-05 · checkpoint F. Regla: todo commit que cambie rutas actualiza este archivo.
> Router: `react-router-dom` v7 con **HashRouter** (`/#/ruta`). Rutas definidas en `src/App.tsx`.

## Estados

`✅ live` implementado y funcional · `🚧 placeholder` existe pero incompleto · `🔜 F–M` pendiente, con su checkpoint

## Público

| Ruta | Página | Estado | Notas |
|---|---|---|---|
| `/` | HomePage | ✅ live (G) | OceanBeat completo: nav sticky, hero, countdown Atlantic/Canary, events (Supabase+fallback), gallery+lightbox, why us, reviews, check-in, FAQ+booking promise, newsletter→leads, footer, WhatsApp flotante. Fotos reales pendientes en `/public/assets/` (placeholders con ancla) |
| `/music` | MusicPage | 🔜 I | Mixcloud embeds (user desde `settings.mixcloud_user`) + 2 radios en vivo (`radio_pure_url`, `radio_global_url`). Player persiste al navegar (vive en layout) |
| `/gallery` | GalleryPage | 🔜 K | Fotos por evento + CTA "Get your photos" |
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
| `/admin/events` | EventsPage | ✅ live → ampliar | Hoy solo listado/sold-out; falta CRUD completo con form |
| `/admin/customers` | CustomersPage | 🔜 H/J | Lista profiles + toggle Family + tier visible |
| `/admin/media` | MediaAdminPage | 🔜 K | Upload a Storage (buckets `media`/`previews`), asignar evento, precio |
| `/admin/connectors` | ConnectorsPage | 🔜 L | Editor de `settings`: GA4, Google Ads, Meta Pixel, WhatsApp, Mixcloud, radios, % Family |
| `/admin/docs` | DocsPage | 🔜 L/M | Render de `/docs/*.md` desde el propio bundle |

`*` → redirige a `/`.

Guard de `/admin/*`: `AdminRoute` (H) exige sesión + `profiles.role === 'admin'`; un customer rebota a `/account`. La DB lo exige igualmente vía RLS (`is_admin()`).
