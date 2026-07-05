# ROADMAP — boatclubparty.com

> Actualizado: 2026-07-05. Un checkpoint = un commit = una pausa de revisión.

## Fase 1 — checkpoints

| # | Entrega | Estado | Hecho cuando… |
|---|---|---|---|
| A | Tema light/dark + scaffold + admin base | ✅ 2026-07-05 | Toggle funciona, persiste, cero colores hardcoded |
| F | Migración v2/v2.1 + /docs | ✅ 2026-07-05 | Tablas creadas, RLS endurecida, SITEMAP/DATABASE reflejan realidad |
| G | Home real OceanBeat (B–D del brief v1) | ✅ 2026-07-05 | Hero, countdown Atlantic/Canary, events, gallery, reviews, FAQ, footer en ambos temas |
| H | Auth cliente + `/account/*` | ✅ 2026-07-05 | Registro/login cliente, AdminRoute con check de rol, rewards calcula tier real desde DB (verificado E2E con triggers) |
| I | `/music` | ✅ 2026-07-05 | Mixcloud embeds + 2 radios en vivo verificadas; player persiste al navegar (RadioContext + MiniPlayer) |
| — | Extra (petición 2026-07-05) | ✅ 2026-07-05 | Ficha /events/:slug con lineup y share, /djs, /blog (espejo del actual), CrowdSlider, admin CRUD eventos+DJs, sociales/YouTube desde settings |
| J | `/family` + descuentos visibles | 🔜 | Landing + precio tachado/descuento dorado en cards con sesión + mensaje WhatsApp con tier |
| K | `/media/:slug` + `/admin/media` | 🔜 | Upload a Storage, previews públicos, buy via WhatsApp |
| L | `/admin/connectors` + TrackingScripts | 🔜 | Cambiar GA4 ID en admin y verlo inyectado sin deploy |
| M | QA + docs final | 🔜 | 375/768/1280, Lighthouse móvil >90, ROADMAP con fase 2 detallada |

## Fase 2 — NO tocar en fase 1

- Feed de Instagram embebido con login interno (Meta Graph API vía N8N; slider en main y por fiesta)
- Stripe/PayPal checkout real (hasta entonces: reserva y cobro por WhatsApp)
- Tickets con QR
- N8N flujos: Gmail, Calendar, auto-post IG/FB, WhatsApp Cloud API
- Telegram bot para Andrés (operaciones)
- i18n EN/ES/DE (estructura preparada, solo EN en fase 1)
- Páginas `/events/:slug` con SEO (implicará migrar HashRouter → BrowserRouter + `_redirects` en Cloudflare Pages)
- Membresía Boat Club Family de pago
- Mover cálculo de descuentos a DB/edge function cuando exista checkout

## Deuda técnica conocida

- Falta admin de posts del blog (tabla y RLS listas; hoy se insertan por SQL) → juntar con checkpoint L o K
- Dani debe registrarse en /login y promoverse a admin (`update profiles set role='admin'`) — no hay ningún usuario aún
- `youtube_url` en settings vacío (icono no se muestra hasta rellenarlo)
- DJ Ardy SS sin foto de perfil (solo carteles); placeholder ancla mientras
- CLAUDE.md (brief v1) menciona rutas admin blog/partners/settings que nunca se implementaron — sustituidas por el sitemap v2
