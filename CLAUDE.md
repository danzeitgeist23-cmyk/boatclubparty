# MEGAPROMPT — BOATCLUBPARTY.COM · Claude Code
> Pegar completo como primer mensaje en Claude Code. Última actualización: julio 2026.

---

## ROL

Eres el arquitecto técnico y desarrollador principal de **boatclubparty.com**. Trabajas con protocolo Git-First estricto. Decides tú la implementación técnica; el dueño (Dani) decide dirección de producto. Respuestas concisas, cambios atómicos, cero teoría.

---

## 0. DATOS DEL ENTORNO — ⚠️ RELLENAR ANTES DE PEGAR

```
REPO:               git@github.com:_________/boatclubparty.git
RAMA:               main
SUPABASE_URL:       https://_________.supabase.co
SUPABASE_ANON_KEY:  (en .env local — NUNCA commitear)
FOTOS REALES:       [ ] sí, en /public/assets/  [ ] no → usar placeholders
```

**PASO -1 — CREAR REPO REMOTO (si no existe):**
```bash
gh auth status || gh auth login          # login GitHub si hace falta
gh repo create boatclubparty --private --source=. --remote=origin --push
```
Si `gh` no está instalado: crear repo vacío en github.com y `git remote add origin ... && git push -u origin main`.

**PASO 0 OBLIGATORIO antes de escribir una sola línea:** `git pull`, listar árbol real (`find src -type f`), leer `App.tsx`, `index.css` y `package.json` reales. Si algo difiere de este brief → reportar diferencias y esperar confirmación. El brief describe el estado esperado; **el repo es la verdad**.

---

## 1. CONTEXTO DEL PROYECTO

| Campo | Valor |
|---|---|
| Dominio | boatclubparty.com |
| Negocio | Marketplace de boat parties VIP en Gran Canaria — escalable 1 → 6+ barcos |
| Socios | Dani (producto/estrategia) + Andrés (operaciones, edita datos vía admin panel) |
| Referencia de diseño | **https://oceanbeat.com/** — clonar estructura y sensación, NO copiar contenido ni assets |
| Público | Turistas internacionales 20-45, grupos, despedidas, parejas |
| Tráfico principal | Instagram + WhatsApp → **mobile-first obligatorio** |

---

## 2. STACK (YA EXISTE — NO CAMBIAR)

```
React 19 + Vite 5 + TypeScript (strict)
Tailwind CSS v4 (@tailwindcss/vite, @theme inline en src/index.css — NO crear tailwind.config)
react-router-dom v7 (HashRouter)
Supabase (@supabase/supabase-js) — datos + auth admin
Cloudflare Pages — hosting/deploy
GitHub — fuente única de verdad
```

Estructura de rutas ya existente en `App.tsx`:
```
/                      → HomePage (pública — ESTA ES LA QUE VAMOS A REDISEÑAR)
/admin/login           → LoginPage (Supabase Auth)
/admin/dashboard       → DashboardPage
/admin/events          → EventsPage + EventFormPage (new / :id/edit)
/admin/blog            → BlogPage
/admin/partners        → PartnersPage
/admin/settings        → SettingsPage
```
El panel admin YA existe y funciona con ProtectedRoute + Supabase session. **No lo rompas.**

---

## 3. DESIGN SYSTEM — ⚠️ CAMBIO CRÍTICO RESPECTO A DOCS ANTERIORES

**Todos los briefs viejos dicen "dark/gold". IGNORAR ESO. La nueva dirección es:**

### TEMA CLARO POR DEFECTO (estilo OceanBeat) + toggle día/noche

```css
/* ── LIGHT (default) ── */
--bg-primary:   #FFFFFF;
--bg-secondary: #F7F5F0;   /* secciones alternas, blanco roto cálido */
--bg-card:      #FFFFFF;   /* cards con sombra suave, no borde duro */
--text-primary: #0A0A0F;
--text-muted:   #6B6B6B;
--gold:         #BCA253;   /* acento — CTAs, números de sección, hovers */
--gold-hover:   #A8904A;
--orange:       #E8843A;   /* acento secundario — badges "Live", ofertas */
--border-soft:  rgba(10,10,15,0.08);

/* ── DARK (toggle) ── */
--bg-primary:   #0A0A0F;
--bg-secondary: #0B1C26;
--bg-card:      #0B1C26;
--text-primary: #FFFFFF;
--text-muted:   #B0B0B0;
--gold:         #BCA253;   /* el dorado se mantiene idéntico en ambos temas */
--border-soft:  rgba(188,162,83,0.28);
```

### Implementación del toggle
- Estrategia: clase `dark` en `<html>` + CSS variables (`:root` / `.dark`). Todos los componentes consumen variables, nunca colores hardcoded.
- Toggle sol/luna en la nav (desktop y móvil). Icono SVG inline, sin librería de iconos.
- Persistencia en `localStorage` (`bcp-theme`) + respetar `prefers-color-scheme` en primera visita.
- Transición suave: `transition: background-color .3s, color .3s` en body.

### Tipografía
```
--font-display: 'Bebas Neue'  → headlines H1/H2, precios, botones (letter-spacing 0.04-0.1em)
--font-body:    'Inter'       → todo lo demás (300-700)
```

### Reglas duras
- Mobile-first. Breakpoints: base → md:768 → lg:1024.
- Sin gradientes en texto. Colores sólidos.
- En light: cards blancas con `box-shadow: 0 4px 24px rgba(0,0,0,.06)` y hover que eleva.
- En dark: cards `#0B1C26` con borde dorado sutil (estilo VIP original).
- Números de sección grandes estilo OceanBeat: `01 / 02 / 03` en dorado.

---

## 4. ESTRUCTURA DE LA HOME (clonar patrón OceanBeat, contenido BCP)

Orden exacto de secciones en `HomePage`:

1. **Nav sticky** — logo BOAT CLUB PARTY (Bebas) · links: Home, Events, Fleet, Contact · toggle día/noche · CTA dorado "Book Now" · selector idioma EN/ES (preparar estructura, i18n fase 2)
2. **Hero** — tagline pequeño arriba ("Gran Canaria · Atlantic VIP Parties"), H1 gigante Bebas ("Boat Club Party."), subline 2 líneas, foto/video grande a la derecha o full-bleed, iconos sociales, badge "Since 2024", indicador SCROLL animado
3. **Countdown** al próximo evento (⚠️ bug histórico: la lógica anterior mostraba 00:00:00 — implementar desde cero con `useEffect` + interval, calculando desde `date + time_start` del próximo evento con `status='available'`, timezone `Atlantic/Canary`)
4. **Upcoming Events** — cards estilo OceanBeat: imagen grande, badge "Live · 4h All Inclusive", precio "From €55", nombre Bebas, tagline, horario, hover eleva. Datos desde Supabase (fallback: array local `EVENTS`)
5. **Gallery** — secciones numeradas 01/02/03 por tipo de evento, grid masonry de fotos reales, lightbox simple
6. **Why Us / Built for the Atlantic** — 3 puntos numerados: Open bar on board · Real event photos · Limited capacity VIP
7. **Reviews** — rating grande 4.9 + logo Google, cards de reviews con inicial en círculo
8. **Check-in / Contact** — punto de embarque (Puerto Rico Marina, Gran Canaria), pasos 01/02/03 (llega 30 min antes, muestra ticket, embarca), botones Maps + WhatsApp + Email
9. **FAQ + Booking Promise** — acordeón nativo (`<details>` estilizado o estado React), banner "Free cancellation up to 48h"
10. **Newsletter** — email → tabla `leads` de Supabase
11. **Footer** — 3 columnas: marca+contacto · Events · Company · social · legal

Botón flotante WhatsApp siempre visible (verde, esquina inferior derecha).

### Assets / imágenes
- Ruta única: `/public/assets/` → `events/`, `gallery/`, `hero/`. Formato webp.
- Si no hay fotos reales: placeholders sólidos con ratio correcto (hero 16:9, event cards 4:5, gallery 1:1) usando `--bg-secondary` + icono ancla dorado centrado. Componente `<Img>` con `loading="lazy"` y fallback. Dani suelta las fotos reales después sin tocar código.

---

## 5. DATOS — SUPABASE

```sql
events (
  id uuid pk, slug text unique, boat_name text, date date,
  time_start time, time_end time, location text, marina text,
  price_general numeric, price_vip numeric,
  capacity int, sold int default 0,
  status text default 'available',  -- available | sold_out | cancelled
  dj_name text, dj_image text, cover_image text,
  description text, created_at timestamptz default now()
)

tickets (
  id uuid pk, event_id uuid fk, name text, email text, whatsapp text,
  ticket_type text, quantity int, total numeric,
  status text default 'pending', payment_ref text,
  created_at timestamptz default now()
)

leads ( id uuid pk, email text, whatsapp text, source text, created_at timestamptz default now() )
```

- RLS: lectura pública en `events` (solo `status != 'cancelled'`), escritura solo autenticados. `tickets`/`leads`: insert público, select solo autenticados.
- Cliente en `src/lib/supabase.ts` con `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
- **⚠️ Bug histórico #2: precio inconsistente (€45 vs €65 en distintas páginas).** Regla: el precio SOLO vive en Supabase/EVENTS. Ningún precio hardcoded en JSX. Un solo componente `<Price>` que formatea.

---

## 6. LO QUE NO SE HACE (fase 1)

- ❌ PayPal/Stripe checkout real → botón "Book via WhatsApp" con mensaje prellenado (`wa.me/?text=Hola, quiero reservar [EVENTO] x[N]`). Pagos = fase 2.
- ❌ i18n completo → estructura preparada, solo EN.
- ❌ Sistema de tickets QR, blog público, páginas /events/:slug individuales → fase 2.
- ❌ N8N/Telegram bot → fase 2 (arquitectura ya definida en docs, no tocar ahora).
- ❌ Scripts de Skywork en index.html → **ELIMINARLOS** (embed_website, websiteBadge, websiteTrack). Limpiar también el doble `<meta charset>`.

---

## 7. PROTOCOLO GIT-FIRST (OBLIGATORIO — Anti-Delirium)

```
Antes de CUALQUIER cambio:
1. git pull && git status && git log --oneline -5
2. Leer el archivo real antes de editarlo (nunca operar de memoria)
3. UN cambio atómico por commit
4. git commit -m "tipo: descripción clara" (fix:/feat:/style:/refactor:)
5. git push → Cloudflare Pages despliega automático

PROHIBIDO:
- Editar archivos sin leerlos primero
- Commits múltiples mezclados
- Tocar /admin sin necesidad explícita
- Colores hardcoded fuera del sistema de variables
```

---

## 8. ORDEN DE TRABAJO (ejecutar en esta secuencia)

1. **Setup tema**: reescribir `src/index.css` con sistema light/dark completo (variables `:root`/`.dark`, componentes `.btn-gold`, `.event-card`, etc. adaptados a ambos temas). Crear `src/hooks/useTheme.ts` + componente `ThemeToggle`.
2. **Limpiar `index.html`**: quitar scripts Skywork, meta duplicado, actualizar title/description SEO.
3. **HomePage completa** sección por sección (orden del punto 4), componentes en `src/components/home/`.
4. **Countdown nuevo** — verificar con evento de prueba en Supabase.
5. **Conexión Supabase en home** — hook `useEvents()` con fallback a array local si falla la query.
6. **QA móvil**: 375px, 768px, 1280px. Verificar toggle en todas las secciones.
7. Commit final + resumen de lo hecho y lo pendiente.

### Checkpoints — criterio de "hecho" (parar y mostrar en cada uno)
| # | Checkpoint | Hecho cuando… |
|---|---|---|
| A | Tema | Toggle funciona, persiste, cero colores hardcoded en JSX. **Commit + mostrar.** |
| B | Hero+Nav+Countdown | Countdown correcto con evento de prueba en `Atlantic/Canary`. **Commit + mostrar.** |
| C | Events+Gallery+Why | Cards leen de Supabase con fallback local. **Commit + mostrar.** |
| D | Resto de home | Reviews→Footer completos en ambos temas. **Commit + mostrar.** |
| E | QA | 375/768/1280px OK, lazy images, Lighthouse móvil >90. **Commit final + resumen.** |

Regla: un checkpoint = un commit = una pausa para revisión. Nunca saltar de A a E.

**Primera tarea concreta: Paso 0 (verificación del repo) y después checkpoint A.**

---

## 9. CRITERIO DE CALIDAD

- La web en modo claro debe sentirse como OceanBeat: aire, blanco, tipografía enorme, fotos protagonistas, dorado como acento quirúrgico.
- La web en modo oscuro debe sentirse como el BCP VIP original: dark, dorado, exclusivo.
- Lighthouse móvil > 90 en Performance. Imágenes lazy + webp.
- Si algo del brief entra en conflicto con código existente que funciona → pregunta antes de romper.

*BoatClubParty · Megaprompt Claude Code · v1.0 · julio 2026*
