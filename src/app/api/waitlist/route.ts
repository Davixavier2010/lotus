import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateWaitlistInput } from '@/lib/validation';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: 'Corpo da requisição inválido.' },
      { status: 400 }
    );
  }

  const validated = validateWaitlistInput({
    contactType: body.contactType,
    contactValue: body.contactValue,
    readerName: body.readerName,
  });

  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const supabase = await createClient();

  if (!supabase) {
    // Modo pronto-para-conectar: variáveis Supabase ainda não configuradas no .env.local
    return NextResponse.json(
      {
        status: 'preview',
        message:
          'Inscrição validada localmente. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para persistência no Supabase.',
      },
      { status: 202 }
    );
  }

  const { error } = await supabase.from('waitlist_subscribers').insert({
    contact_type: validated.data.contactType,
    contact_value: validated.data.contactValue,
    reader_name: validated.data.readerName,
  });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        {
          status: 'already_registered',
          message: 'Este contato já está na Lista de Acompanhamento do Lótus.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Não foi possível registrar sua inscrição agora. Tente novamente em instantes.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      status: 'subscribed',
      message: 'Você entrou na Lista de Acompanhamento. Avisaremos sobre novos capítulos.',
    },
    { status: 201 }
  );
}
