import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase não configurado.' },
      { status: 503 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Faça login para acessar o painel administrativo.' },
      { status: 401 }
    );
  }

  const isAdmin = user.app_metadata?.role === 'admin';
  if (!isAdmin) {
    return NextResponse.json(
      {
        error: 'Acesso restrito ao administrador.',
        code: 'NOT_ADMIN',
        email: user.email ?? null,
      },
      { status: 403 }
    );
  }

  const [subscribersRes, progressRes] = await Promise.all([
    supabase
      .from('waitlist_subscribers')
      .select('id, contact_type, contact_value, reader_name, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('reading_progress')
      .select('chapter_slug, story_completed, reflection_completed, updated_at'),
  ]);

  if (subscribersRes.error) {
    return NextResponse.json(
      { error: 'Erro ao carregar inscritos. Verifique as políticas RLS de admin.' },
      { status: 500 }
    );
  }

  const subscribers = subscribersRes.data ?? [];
  const progressRows = progressRes.data ?? [];

  const chapterStats = ['capitulo-1', 'capitulo-2', 'capitulo-3'].map((slug) => {
    const rows = progressRows.filter((r) => r.chapter_slug === slug);
    return {
      chapter_slug: slug,
      stories_completed: rows.filter((r) => r.story_completed).length,
      reflections_completed: rows.filter((r) => r.reflection_completed).length,
    };
  });

  return NextResponse.json({
    adminEmail: user.email,
    subscribers,
    chapterStats,
  });
}
