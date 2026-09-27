alter table public.events add column if not exists promo_video_url text;

insert into public.events (
  slug, boat_name, date, time_start, time_end,
  location, marina, price_general, price_vip,
  capacity, status, cover_image, promo_video_url, description
) values (
  'sunglam-sunset-24-oct',
  'Hidden Horizon',
  '2026-10-24',
  '15:00', '20:00',
  'Gran Canaria',
  'Exact boarding point revealed via WhatsApp 24h before departure',
  60, null,
  40, 'available',
  'https://akuaoafcxbyoofmvheyf.supabase.co/storage/v1/object/public/previews/sunglam-24oct-poster.jpg',
  'https://akuaoafcxbyoofmvheyf.supabase.co/storage/v1/object/public/previews/sunglam-24oct-promo.mp4',
  'SunGlam — Sunset Boat Party. A 4-hour sunset experience on a vessel we''ll only reveal when it''s time to board.

Includes:
– Drinks: water, beer, soft drinks, sangria
– Lunch: wrinkled potatoes with mojo, coleslaw, marinated chicken
– Banana boat ride & snorkel gear on board
– Free swim time

Boarding point shared privately via WhatsApp the day before.'
);
