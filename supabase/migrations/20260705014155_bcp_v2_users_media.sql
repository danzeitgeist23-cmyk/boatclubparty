-- ============================================================
-- BCP v2 — users, rewards, media, settings
-- Migración: bcp_v2_users_media · Julio 2026
-- ============================================================

-- ---------- Perfiles de cliente (extiende auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  whatsapp text,
  role text not null default 'customer' check (role in ('customer','admin')),
  is_family boolean not null default false,        -- Boat Club Family
  bookings_count int not null default 0,           -- se incrementa por trigger
  created_at timestamptz default now()
);

-- ---------- Niveles de descuento automáticos ----------
create table public.discount_tiers (
  id serial primary key,
  min_bookings int not null,        -- 2, 4, 8
  percent int not null,             -- 5, 10, 15
  label text not null               -- 'Sailor', 'Captain', 'Legend'
);
insert into public.discount_tiers (min_bookings, percent, label) values
 (2,5,'Sailor'), (4,10,'Captain'), (8,15,'Legend');

-- ---------- Media a la venta (fotos/vídeo por evento) ----------
create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete set null,
  type text not null check (type in ('photo_pack','video','single_photo')),
  title text not null,
  preview_url text,                 -- watermark/baja calidad, público
  full_url text,                    -- Supabase Storage, bucket privado
  price numeric(8,2) not null,
  created_at timestamptz default now()
);

-- ---------- Settings clave-valor → panel Connectors del admin ----------
create table public.settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);
insert into public.settings (key, value) values
 ('ga4_id',''), ('gads_id',''), ('meta_pixel_id',''),
 ('whatsapp_number','+34XXXXXXXXX'),
 ('mixcloud_user','boatclubparty'),
 ('radio_pure_url','https://pureibiza.radioca.st/stream'),
 ('radio_global_url','https://listenssl.ibizaglobalradio.com:8024/stream'),
 ('family_discount_percent','10');

-- ---------- tickets: vincular a usuario registrado ----------
alter table public.tickets add column user_id uuid references auth.users(id);

-- ---------- Trigger: perfil automático al registrarse ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Trigger: reservas pagadas → bookings_count ----------
create or replace function public.sync_bookings_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.user_id is not null then
    update public.profiles set bookings_count = (
      select count(*) from public.tickets
      where user_id = new.user_id and status = 'paid'
    ) where id = new.user_id;
  end if;
  return new;
end $$;

create trigger on_ticket_paid after insert or update of status, user_id on public.tickets
  for each row execute function public.sync_bookings_count();

-- ---------- Helper admin (security definer, evita recursión RLS) ----------
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.media_items enable row level security;
alter table public.settings enable row level security;
alter table public.discount_tiers enable row level security;

create policy "own_profile" on public.profiles
  for select using (auth.uid() = id);
create policy "own_profile_update" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'customer');
create policy "admin_all_profiles" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_media_preview" on public.media_items
  for select using (true);
create policy "admin_write_media" on public.media_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_settings" on public.settings
  for select using (true);
create policy "admin_write_settings" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_tiers" on public.discount_tiers
  for select using (true);
create policy "admin_write_tiers" on public.discount_tiers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "own_tickets" on public.tickets
  for select to authenticated using (user_id = auth.uid());

-- ---------- Storage: buckets media (privado) + previews (público) ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', false), ('previews', 'previews', true)
on conflict (id) do nothing;

create policy "public_read_previews" on storage.objects
  for select using (bucket_id = 'previews');
create policy "admin_read_media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admin_write_storage" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media','previews') and public.is_admin());
create policy "admin_update_storage" on storage.objects
  for update to authenticated
  using (bucket_id in ('media','previews') and public.is_admin());
create policy "admin_delete_storage" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media','previews') and public.is_admin());
