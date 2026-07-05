-- ============================================================
-- BCP v3 — djs, lineup por evento, blog, settings sociales
-- ============================================================

-- ---------- DJs ----------
create table public.djs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,              -- p.ej. 'Resident Pure Ibiza Radio'
  bio text,
  image text,
  instagram text,
  mixcloud text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- ---------- Lineup por evento ----------
create table public.event_djs (
  event_id uuid not null references public.events(id) on delete cascade,
  dj_id uuid not null references public.djs(id) on delete cascade,
  role text not null default 'support' check (role in ('headliner','support')),
  sort int not null default 0,
  primary key (event_id, dj_id)
);

-- ---------- Blog (estructura espejo de blog.html actual) ----------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'guias' check (category in ('destino','musica','guias')),
  excerpt text,
  content text,              -- markdown ligero
  cover_image text,
  published boolean not null default false,
  created_at timestamptz default now()
);

-- ---------- events: campos de la ficha (referencia web actual) ----------
alter table public.events add column genres text;   -- 'Tech House · Afro House · Deep House'
alter table public.events add column bpm text;      -- '124–130'

-- ---------- settings: sociales + email + número real ----------
insert into public.settings (key, value) values
 ('instagram_url','https://instagram.com/boatclubparty'),
 ('tiktok_url','https://tiktok.com/@boatclubparty'),
 ('facebook_url','https://facebook.com/boatclubparty'),
 ('youtube_url',''),
 ('contact_email','owawild23@gmail.com')
on conflict (key) do nothing;
update public.settings set value = '+34673552772', updated_at = now()
 where key = 'whatsapp_number' and value like '+34X%';

-- ---------- RLS ----------
alter table public.djs enable row level security;
alter table public.event_djs enable row level security;
alter table public.posts enable row level security;

create policy "public_read_djs" on public.djs
  for select using (is_active = true);
create policy "admin_all_djs" on public.djs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_event_djs" on public.event_djs
  for select using (true);
create policy "admin_all_event_djs" on public.event_djs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_posts" on public.posts
  for select using (published = true);
create policy "admin_all_posts" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Seed: DJs de la web/carteles actuales ----------
insert into public.djs (slug, name, tagline, image, instagram, mixcloud) values
 ('agatha-sun','Agatha Sun','Resident Pure Ibiza Radio','/assets/djs/agatha-sun.webp','https://instagram.com/dj.agatha.sun','https://www.mixcloud.com/agathasun/'),
 ('goi-kopher','Goi Kopher','Afro & Deep House','/assets/djs/goi-kopher.webp',null,null),
 ('dj-ardy-ss','DJ Ardy SS','Glam Sun resident','/assets/djs/ardy-ss.webp',null,null);

insert into public.event_djs (event_id, dj_id, role, sort)
select e.id, d.id, x.role, x.sort from (values
  ('sunset-queen-19-jul','agatha-sun','headliner',0),
  ('sunset-queen-19-jul','goi-kopher','support',1),
  ('gold-deck-01-aug','dj-ardy-ss','headliner',0)
) as x(eslug, dslug, role, sort)
join public.events e on e.slug = x.eslug
join public.djs d on d.slug = x.dslug;

update public.events set genres = 'Tech House · Afro House · Deep House', bpm = '124–130'
 where slug = 'sunset-queen-19-jul';
update public.events set genres = 'Afro House · Melodic House', bpm = '120–126'
 where slug = 'gold-deck-01-aug';
