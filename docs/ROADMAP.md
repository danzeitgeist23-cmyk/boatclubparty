# ROADMAP — boatclubparty.com

> Actualizado: 2026-07-05. Un checkpoint = un commit = una pausa de revisión.

## Fase 1 — checkpoints

| # | Entrega | Estado | Hecho cuando… |
|---|---|---|---|
| A | Tema light/dark + scaffold + admin base | ✅ 2026-07-05 | Toggle funciona, persiste, cero colores hardcoded |
| F | Migración v2/v2.1 + /docs | ✅ 2026-07-05 | Tablas creadas, RLS endurecida, SITEMAP/DATABASE reflejan realidad |
| G | Home real OceanBeat (B–D del brief v1) | 🔜 siguiente | Hero, countdown Atlantic/Canary, events, gallery, reviews, FAQ, footer en ambos temas |
| H | Auth cliente + `/account/*` | 🔜 | Registro/login cliente, ProtectedRoute admin con check de rol, rewards calcula tier real desde DB |
| I | `/music` | 🔜 | Mixcloud embeds + 2 radios; player no se corta al navegar (persiste en layout) |
| J | `/family` + descuentos visibles | 🔜 | Landing + precio tachado/descuento dorado en cards con sesión + mensaje WhatsApp con tier |
| K | `/media/:slug` + `/admin/media` | 🔜 | Upload a Storage, previews públicos, buy via WhatsApp |
| L | `/admin/connectors` + TrackingScripts | 🔜 | Cambiar GA4 ID en admin y verlo inyectado sin deploy |
| M | QA + docs final | 🔜 | 375/768/1280, Lighthouse móvil >90, ROADMAP con fase 2 detallada |

## Fase 2 — NO tocar en fase 1

- Stripe/PayPal checkout real (hasta entonces: reserva y cobro por WhatsApp)
- Tickets con QR
- N8N flujos: Gmail, Calendar, auto-post IG/FB, WhatsApp Cloud API
- Telegram bot para Andrés (operaciones)
- i18n EN/ES/DE (estructura preparada, solo EN en fase 1)
- Páginas `/events/:slug` con SEO (implicará migrar HashRouter → BrowserRouter + `_redirects` en Cloudflare Pages)
- Membresía Boat Club Family de pago
- Mover cálculo de descuentos a DB/edge function cuando exista checkout

## Deuda técnica conocida

- `/admin/events` solo lista y marca sold-out → CRUD completo pendiente (checkpoint H o G)
- ProtectedRoute solo mira sesión, no rol (la DB ya protege por RLS; el guard de UI llega en H)
- `whatsapp_number` en settings sigue en placeholder
- CLAUDE.md (brief v1) menciona rutas admin blog/partners/settings que nunca se implementaron — sustituidas por el sitemap v2
