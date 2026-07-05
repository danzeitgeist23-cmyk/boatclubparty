# DATABASE — Supabase (proyecto `akuaoafcxbyoofmvheyf`)

> Actualizado: 2026-07-05 · tras `bcp_v2_1_harden_rls`. Regla: todo commit que cambie schema actualiza este archivo.
> Migraciones versionadas en `supabase/migrations/` — espejo exacto de `supabase_migrations.schema_migrations`.

## Migraciones aplicadas

| Versión | Nombre | Contenido |
|---|---|---|
| 20260705000608 | `bcp_initial_schema` | events, tickets, leads + RLS v1 |
| 20260705014155 | `bcp_v2_users_media` | profiles, discount_tiers, media_items, settings, tickets.user_id, triggers, is_admin(), buckets |
| 20260705021607 | `bcp_v2_1_harden_rls` | Escritura/lectura sensible pasa de "authenticated" a `is_admin()` (preparación auth clientes) |

## Diagrama (texto)

```
auth.users ──1:1── profiles (role, is_family, bookings_count)
     │                 ▲
     │                 │ trigger on_ticket_paid → sync_bookings_count()
     └──1:N── tickets ─┘
                │
events ──1:N───┤
   │            └── (name, email, whatsapp, ticket_type, quantity, total, status, user_id?)
   └──1:N── media_items (type, title, preview_url, full_url, price)

discount_tiers (standalone: min_bookings → percent → label)
settings       (standalone: key → value, leído por TrackingScripts/CTAs)
leads          (standalone: newsletter)
```

## Tablas

### events
`id uuid pk` · `slug unique` · `boat_name` · `date` · `time_start/time_end` · `location='Gran Canaria'` · `marina='Puerto Rico Marina'` · `price_general numeric(8,2)` · `price_vip?` · `capacity=80` · `sold=0` · `status: available|sold_out|cancelled` · `dj_name?` `dj_image?` `cover_image?` `description?` · `created_at`

### tickets
`id uuid pk` · `event_id fk→events (cascade)` · `name` `email` `whatsapp?` · `ticket_type: general|vip` · `quantity>0` · `total` · `status: pending|paid|cancelled` · `payment_ref?` · `user_id? fk→auth.users` (v2) · `created_at`

### leads
`id uuid pk` · `email` · `whatsapp?` · `source='newsletter'` · `created_at`

### profiles (v2 — extiende auth.users 1:1)
`id uuid pk fk→auth.users (cascade)` · `full_name?` · `whatsapp?` · `role: customer|admin (default customer)` · `is_family bool` · `bookings_count int` (mantenido por trigger, no editar a mano) · `created_at`

### discount_tiers (v2)
`(2,5,'Sailor')` · `(4,10,'Captain')` · `(8,15,'Legend')` — tier activo = mayor `min_bookings <= bookings_count`. Tope combinado con Family: **25%** (lógica en frontend, checkpoint J).

### media_items (v2)
`id uuid pk` · `event_id? fk→events (set null)` · `type: photo_pack|video|single_photo` · `title` · `preview_url?` (bucket público `previews`) · `full_url?` (bucket privado `media`) · `price numeric(8,2)` · `created_at`

### settings (v2 — clave-valor, editable en /admin/connectors)
`ga4_id` · `gads_id` · `meta_pixel_id` · `whatsapp_number` · `mixcloud_user` · `radio_pure_url` · `radio_global_url` · `family_discount_percent`

## Funciones y triggers

| Objeto | Tipo | Qué hace |
|---|---|---|
| `handle_new_user()` | security definer, sin EXECUTE público | Al insertar en `auth.users` crea su fila en `profiles` (trigger `on_auth_user_created`) |
| `sync_bookings_count()` | security definer, sin EXECUTE público | Al insert/update de `status`/`user_id` en tickets recalcula `bookings_count` = tickets `paid` del usuario (trigger `on_ticket_paid`) |
| `is_admin()` | security definer, stable | `profiles.role='admin'` para `auth.uid()`. Usada por policies — evita recursión RLS de profiles-sobre-profiles. Debe seguir ejecutable por anon/authenticated |

## RLS vigente (post v2.1)

| Tabla | anon | customer (authenticated) | admin |
|---|---|---|---|
| events | read (no cancelled) | read (no cancelled) | all |
| tickets | insert | insert · read propios (`user_id=auth.uid()`) | all (read/update global) |
| leads | insert | insert | + read |
| profiles | — | read/update el suyo (no puede auto-promoverse: `with check role='customer'`) | all |
| media_items | read | read | + write |
| settings | read | read | + write |
| discount_tiers | read | read | + write |

## Storage

| Bucket | Público | Uso | Policies |
|---|---|---|---|
| `previews` | sí | previews watermark de media_items | Acceso por URL pública; sin policy de SELECT (evita listado del bucket). Write solo admin |
| `media` | no | archivos full de media_items | Read/write solo admin (fase 1: entrega manual vía WhatsApp tras pago) |

## Operativa

- **Crear el admin**: registrar el usuario (el trigger crea su profile como `customer`) y ejecutar:
  `update public.profiles set role='admin' where id = '<uuid>';`
- Advisors security limpios de lo accionable (2026-07-05). Los `WITH CHECK (true)` de insert público en tickets/leads son deliberados (reserva y newsletter anónimas).
