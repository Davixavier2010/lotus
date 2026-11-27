export type ContactType = 'email' | 'whatsapp';

export const ALLOWED_CHAPTER_SLUGS = ['capitulo-1', 'capitulo-2', 'capitulo-3'] as const;
export type ChapterSlug = (typeof ALLOWED_CHAPTER_SLUGS)[number];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_DIGITS_REGEX = /^\d{10,15}$/;

export function normalizeContact(type: ContactType, rawValue: string): string {
  const trimmed = rawValue.trim();
  if (type === 'email') {
    return trimmed.toLowerCase();
  }
  return trimmed.replace(/[^\d+]/g, '');
}

export function validateWaitlistInput(input: {
  contactType?: unknown;
  contactValue?: unknown;
  readerName?: unknown;
}):
  | { ok: true; data: { contactType: ContactType; contactValue: string; readerName: string | null } }
  | { ok: false; error: string } {
  const { contactType, contactValue, readerName } = input;

  if (contactType !== 'email' && contactType !== 'whatsapp') {
    return { ok: false, error: 'Selecione um canal válido: e-mail ou WhatsApp.' };
  }

  if (typeof contactValue !== 'string' || !contactValue.trim()) {
    return {
      ok: false,
      error: contactType === 'email' ? 'Informe seu endereço de e-mail.' : 'Informe seu número de WhatsApp com DDD.',
    };
  }

  const normalized = normalizeContact(contactType, contactValue);

  if (contactType === 'email') {
    if (normalized.length > 160 || !EMAIL_REGEX.test(normalized)) {
      return { ok: false, error: 'Endereço de e-mail inválido. Verifique e tente novamente.' };
    }
  } else {
    const digitsOnly = normalized.replace(/\D/g, '');
    if (!WHATSAPP_DIGITS_REGEX.test(digitsOnly)) {
      return { ok: false, error: 'WhatsApp inválido. Informe DDD + número (10 a 15 dígitos).' };
    }
  }

  let cleanName: string | null = null;
  if (typeof readerName === 'string' && readerName.trim().length > 0) {
    cleanName = readerName.trim().slice(0, 100);
  }

  return {
    ok: true,
    data: {
      contactType,
      contactValue: normalized,
      readerName: cleanName,
    },
  };
}

export function isValidChapterSlug(slug: unknown): slug is ChapterSlug {
  return typeof slug === 'string' && (ALLOWED_CHAPTER_SLUGS as readonly string[]).includes(slug);
}
