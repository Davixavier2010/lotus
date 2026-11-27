-- Schema do Projeto Lótus (Supabase Postgres)
-- Seguindo rigorosamente as diretrizes de segurança RLS e exposição mínima de dados.

-- 1. Lista de Acompanhamento (Captação de Leitores)
create table if not exists public.waitlist_subscribers (
  id uuid primary key default gen_random_uuid(),
  contact_type text not null check (contact_type in ('email', 'whatsapp')),
  contact_value text not null check (char_length(trim(contact_value)) between 5 and 160),
  reader_name text check (reader_name is null or char_length(trim(reader_name)) <= 100),
  created_at timestamptz not null default now(),
  constraint waitlist_unique_contact unique (contact_type, contact_value)
);

-- Habilitar RLS obrigatoriamente em tabela no schema public
alter table public.waitlist_subscribers enable row level security;

-- Apenas inserção pública permitida (anon e authenticated).
-- Nenhuma política de SELECT público: protege e-mails e WhatsApps de leitura externa (PII).
create policy "Permitir inscrição pública na lista de acompanhamento"
  on public.waitlist_subscribers
  for insert
  to anon, authenticated
  with check (
    contact_type in ('email', 'whatsapp')
    and char_length(trim(contact_value)) between 5 and 160
  );

-- 2. Progresso de Leitura e Reflexões Pessoais do Leitor (Área Autenticada)
create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_slug text not null check (chapter_slug in ('capitulo-1', 'capitulo-2', 'capitulo-3')),
  story_completed boolean not null default false,
  reflection_completed boolean not null default false,
  personal_note text check (personal_note is null or char_length(personal_note) <= 2000),
  updated_at timestamptz not null default now(),
  constraint reading_progress_user_chapter_unique unique (user_id, chapter_slug)
);

alter table public.reading_progress enable row level security;

-- Políticas granulares usando (select auth.uid()) = user_id (sem auth.role() depreciado)
create policy "Leitor visualiza apenas seu próprio progresso"
  on public.reading_progress
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Leitor registra apenas seu próprio progresso"
  on public.reading_progress
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Leitor atualiza apenas seu próprio progresso"
  on public.reading_progress
  for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "Leitor remove apenas seu próprio progresso"
  on public.reading_progress
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Trigger seguro (SECURITY INVOKER) para atualizar updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_reading_progress_updated_at on public.reading_progress;
create trigger set_reading_progress_updated_at
  before update on public.reading_progress
  for each row
  execute function public.handle_updated_at();
