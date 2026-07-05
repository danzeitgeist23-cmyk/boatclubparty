# BOATCLUBPARTY.com

VIP boat parties · Gran Canaria · React 19 + Vite + Tailwind v4 + Supabase

## Quick start
```bash
npm install
npm run dev        # http://localhost:5173
```
`.env` ya incluye la conexión a Supabase (proyecto akuaoafcxbyoofmvheyf).
El archivo está gitignoreado — usa `.env.example` como plantilla en otros entornos.

## Estado
- ✅ Supabase: schema events/tickets/leads + RLS + 2 eventos seed
- ✅ Sistema de tema light/dark con toggle y persistencia (checkpoint A)
- ✅ Admin: login (Supabase Auth), dashboard, gestión sold-out
- ⏳ Home real estilo OceanBeat → ver CLAUDE.md (checkpoints B–E)

## Admin
Crear usuario en Supabase → Authentication → Users → Add user.
Login en `/#/admin/login`.

## Deploy (Cloudflare Pages)
Build command: `npm run build` · Output: `dist`
Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
