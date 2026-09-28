-- Quitar el vídeo promocional de la ficha del evento 24-oct: deja solo el
-- cartel (cover_image), que es la misma imagen usada como hero/card en home.
-- No se borra el archivo de Storage, solo deja de mostrarse.
update public.events set promo_video_url = null where slug = 'glam-sun-sunset-24-oct';
