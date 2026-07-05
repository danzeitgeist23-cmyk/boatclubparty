# CONNECTORS — integraciones externas

> Actualizado: 2026-07-05. Todo gratis en fase 1. **Regla de oro: ningún ID/key hardcoded en JSX — todo se lee de la tabla `settings`** y se edita en `/admin/connectors` (checkpoint L) sin deploy.

| Conector | Cómo | Clave en `settings` | Dónde se configura | Coste |
|---|---|---|---|---|
| Google Analytics 4 | Componente `<TrackingScripts>` en App: inyecta gtag solo si el ID no está vacío | `ga4_id` | /admin/connectors | 0 € |
| Google Ads tag | Mismo componente | `gads_id` | /admin/connectors | 0 € |
| Meta Pixel | Mismo componente | `meta_pixel_id` | /admin/connectors | 0 € |
| WhatsApp | Todos los CTAs construyen `wa.me/<num>?text=...` leyendo el número de settings | `whatsapp_number` | /admin/connectors | 0 € |
| Mixcloud | Widget embed oficial `https://www.mixcloud.com/widget/iframe/?feed=...` — sin API key | `mixcloud_user` | /admin/connectors → /music | 0 € |
| Radio Pure Ibiza | `<audio>` HTML5 nativo + play/pause custom dorado | `radio_pure_url` | /admin/connectors → /music | 0 € |
| Radio Ibiza Global | Ídem | `radio_global_url` | /admin/connectors → /music | 0 € |
| Descuento Family | % permanente para `profiles.is_family` | `family_discount_percent` | /admin/connectors | 0 € |
| Supabase | DB + Auth + Storage. URL/anon key en `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — únicas env vars del proyecto, nunca commiteadas | — | .env local + Cloudflare Pages | 0 € (free tier) |
| Gmail / Drive / Calendar / Sheets | ❌ NO en la web — van por N8N en fase 2 (ver ROADMAP.md) | — | — | — |

## Estado

- Tabla `settings` creada y sembrada (migración v2) ✅
- `<TrackingScripts>`, `/admin/connectors`, lectura de settings en CTAs → 🔜 checkpoint L (WhatsApp CTAs desde G)
- `whatsapp_number` sigue en placeholder `+34XXXXXXXXX` — **Dani debe poner el real en /admin/connectors** (o vía SQL mientras tanto)
