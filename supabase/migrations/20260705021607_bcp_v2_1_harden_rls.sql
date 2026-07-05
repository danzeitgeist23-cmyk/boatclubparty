-- ============================================================
-- BCP v2.1 — endurecimiento RLS previo a auth de clientes
-- Con /account/* cualquier turista tendrá sesión "authenticated":
-- las policies v1 basadas solo en sesión pasan a exigir is_admin().
-- ============================================================

-- events: escritura solo admin (lectura pública no cambia)
drop policy "auth_write_events" on public.events;
create policy "admin_write_events" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- tickets: lectura/edición global solo admin ("own_tickets" ya cubre al cliente)
drop policy "auth_read_tickets" on public.tickets;
create policy "admin_read_tickets" on public.tickets
  for select to authenticated using (public.is_admin());
drop policy "auth_update_tickets" on public.tickets;
create policy "admin_update_tickets" on public.tickets
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- leads: lectura solo admin (insert público del newsletter no cambia)
drop policy "auth_read_leads" on public.leads;
create policy "admin_read_leads" on public.leads
  for select to authenticated using (public.is_admin());

-- funciones de trigger: no invocables vía /rest/v1/rpc
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.sync_bookings_count() from public, anon, authenticated;

-- bucket previews es público: la URL pública no necesita policy y
-- la policy de SELECT permitía listar todos los objetos
drop policy "public_read_previews" on storage.objects;
