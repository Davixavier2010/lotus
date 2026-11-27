-- Políticas de leitura administrativa usando app_metadata (nunca user_metadata, que é editável pelo usuário)
drop policy if exists "Admin visualiza lista de acompanhamento" on public.waitlist_subscribers;
create policy "Admin visualiza lista de acompanhamento"
  on public.waitlist_subscribers
  for select
  to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

grant select on public.waitlist_subscribers to authenticated;

drop policy if exists "Admin visualiza progresso de leitura" on public.reading_progress;
create policy "Admin visualiza progresso de leitura"
  on public.reading_progress
  for select
  to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- Promover conta de administrador (rodar após criar o usuário no Auth)
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'davi.xs2010@gmail.com';
