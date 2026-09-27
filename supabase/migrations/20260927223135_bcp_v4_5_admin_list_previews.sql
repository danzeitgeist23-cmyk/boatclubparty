-- v2.1 quitó la policy de listado público de 'previews' (evitaba enumerar
-- todo el bucket). El admin sigue necesitando poder LISTAR para pickers
-- como "elegir de la galería" en /admin/djs — se lo damos solo a él.
create policy "admin_list_previews" on storage.objects
  for select to authenticated using (bucket_id = 'previews' and public.is_admin());
