import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidChapterSlug } from '@/lib/validation';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ configured: false, progress: [] }, { status: 200 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('reading_progress')
    .select('chapter_slug, story_completed, reflection_completed, personal_note, updated_at')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar progresso de leitura.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ configured: true, progress: data ?? [] }, { status: 200 });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase não configurado neste ambiente.' },
      { status: 503 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  if (!isValidChapterSlug(body.chapterSlug)) {
    return NextResponse.json({ error: 'Capítulo inválido.' }, { status: 400 });
  }

  const storyCompleted = Boolean(body.storyCompleted);
  const reflectionCompleted = storyCompleted ? Boolean(body.reflectionCompleted) : false;
  const personalNote =
    typeof body.personalNote === 'string'
      ? body.personalNote.trim().slice(0, 2000) || null
      : null;

  const { error } = await supabase.from('reading_progress').upsert(
    {
      user_id: user.id,
      chapter_slug: body.chapterSlug,
      story_completed: storyCompleted,
      reflection_completed: reflectionCompleted,
      personal_note: personalNote,
    },
    { onConflict: 'user_id,chapter_slug' }
  );

  if (error) {
    return NextResponse.json(
      { error: 'Não foi possível salvar seu progresso.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
