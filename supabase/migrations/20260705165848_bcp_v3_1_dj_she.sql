-- She (cartel "Goi Kopher & She") + Ardy sin foto de perfil todavía
insert into public.djs (slug, name, tagline, image) values
 ('she','She','Sunset Sessions','/assets/djs/she.webp');
update public.djs set image = null where slug = 'dj-ardy-ss';
insert into public.event_djs (event_id, dj_id, role, sort)
select e.id, d.id, 'support', 1 from public.events e, public.djs d
where e.slug = 'gold-deck-01-aug' and d.slug = 'she';
