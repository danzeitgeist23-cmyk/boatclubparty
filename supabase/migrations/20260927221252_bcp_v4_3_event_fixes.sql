-- Fix 1: Agatha Sun (la DJ del cartel) no estaba vinculada al lineup del evento
insert into public.event_djs (event_id, dj_id, role, sort)
select e.id, d.id, 'headliner', 0
from public.events e, public.djs d
where e.slug = 'sunglam-sunset-24-oct' and d.slug = 'agatha-sun'
on conflict (event_id, dj_id) do nothing;

-- Fix 2: el cartel dice "GLAM SUN" (marca ya usada en otros eventos), no "SunGlam"
update public.events
set description = replace(description, 'SunGlam', 'Glam Sun'),
    content_i18n = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(content_i18n, '{es,description}', to_jsonb(replace(content_i18n->'es'->>'description', 'SunGlam', 'Glam Sun'))),
            '{it,description}', to_jsonb(replace(content_i18n->'it'->>'description', 'SunGlam', 'Glam Sun'))
          ),
          '{de,description}', to_jsonb(replace(content_i18n->'de'->>'description', 'SunGlam', 'Glam Sun'))
        ),
        '{no,description}', to_jsonb(replace(content_i18n->'no'->>'description', 'SunGlam', 'Glam Sun'))
      ),
      '{nl,description}', to_jsonb(replace(content_i18n->'nl'->>'description', 'SunGlam', 'Glam Sun'))
    )
where slug = 'sunglam-sunset-24-oct';
