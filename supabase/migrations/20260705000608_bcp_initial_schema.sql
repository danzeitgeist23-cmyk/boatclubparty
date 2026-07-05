-- BOATCLUBPARTY · Schema inicial v1
create extension if not exists "pgcrypto";

-- ── EVENTS ──
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  boat_name text not null,
  date date not null,
  time_start time not null,
  time_end time not null,
  location text not null default 'Gran Canaria',
  marina text not null default 'Puerto Rico Marina',
  price_general numeric(8,2) not null,
  price_vip numeric(8,2),
  capacity int not null default 80,
  sold int not null default 0,
  status text not null default 'available' check (status in ('available','sold_out','cancelled')),
  dj_name text,
  dj_image text,
  cover_image text,
  description text,
  created_at timestamptz not null default now()
);

-- ── TICKETS ──
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  whatsapp text,
  ticket_type text not null default 'general' check (ticket_type in ('general','vip')),
  quantity int not null default 1 check (quantity > 0),
  total numeric(8,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','cancelled')),
  payment_ref text,
  created_at timestamptz not null default now()
);

-- ── LEADS ──
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  whatsapp text,
  source text default 'newsletter',
  created_at timestamptz not null default now()
);

-- ── Índices ──
create index idx_events_date_status on public.events (date, status);
create index idx_tickets_event on public.tickets (event_id);

-- ── RLS ──
alter table public.events enable row level security;
alter table public.tickets enable row level security;
alter table public.leads enable row level security;

-- events: lectura pública (no cancelados), escritura solo autenticados
create policy "public_read_events" on public.events
  for select using (status <> 'cancelled');
create policy "auth_write_events" on public.events
  for all to authenticated using (true) with check (true);

-- tickets: insert público (reserva), lectura/gestión solo autenticados
create policy "public_insert_tickets" on public.tickets
  for insert to anon, authenticated with check (true);
create policy "auth_read_tickets" on public.tickets
  for select to authenticated using (true);
create policy "auth_update_tickets" on public.tickets
  for update to authenticated using (true);

-- leads: insert público, lectura solo autenticados
create policy "public_insert_leads" on public.leads
  for insert to anon, authenticated with check (true);
create policy "auth_read_leads" on public.leads
  for select to authenticated using (true);
