'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpenCheck,
  Check,
  Clock,
  Copy,
  Headphones,
  Maximize2,
  Minimize2,
  Save,
  Share2,
  Type,
  User,
} from 'lucide-react';
import { estimateReadingTime, type ChapterData } from '@/data/lotus-content';
import audioTimings from '@/data/audio-timings.json';
import audioTimingsFem from '@/data/audio-timings-fem.json';
import { HankoMark } from './HankoMark';
import { ThemeToggle } from './ThemeToggle';
import { ChapterAudioPlayer, type AudioSegment } from './ChapterAudioPlayer';
import { ReaderAuthModal } from './ReaderAuthModal';
import { TanzakuBookmarkModal } from './TanzakuBookmarkModal';
import { useFullBookAudio } from './FullBookAudioContext';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface ChapterReaderProps {
  chapter: ChapterData;
  prevChapter: ChapterData | null;
  nextChapter: ChapterData | null;
}

export function ChapterReader({
  chapter,
  prevChapter,
  nextChapter,
}: ChapterReaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { startFullBook } = useFullBookAudio();

  const [reflectionUnlocked, setReflectionUnlocked] = useState(false);
  const [activeContoIdx, setActiveContoIdx] = useState<number | null>(null);
  const [activeReflexaoIdx, setActiveReflexaoIdx] = useState<number | null>(null);
  const [personalNote, setPersonalNote] = useState('');

  const chapterTimings = (
    audioTimings as Record<
      string,
      { conto?: AudioSegment[]; reflexao?: AudioSegment[] }
    >
  )[chapter.slug];

  const chapterTimingsFem = (
    audioTimingsFem as Record<
      string,
      { conto?: AudioSegment[]; reflexao?: AudioSegment[] }
    >
  )[chapter.slug];
  const [noteStatus, setNoteStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedShare, setCopiedShare] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);

  // Se o usuário chegou via link direto #reflexao (ex: Mapa de Pilares), abre a reflexão
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reflexao') {
      setReflectionUnlocked(true);
    }
    const savedSize = typeof window !== 'undefined' ? (window.localStorage.getItem('lotus_fontsize') as 'sm' | 'base' | 'lg' | null) : null;
    if (savedSize && ['sm', 'base', 'lg'].includes(savedSize)) {
      setFontSize(savedSize);
    }
  }, []);

  function handleFontSizeChange(size: 'sm' | 'base' | 'lg') {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lotus_fontsize', size);
    }
  }

  const fontSizeClasses = {
    sm: 'text-[1.05rem] leading-[1.8]',
    base: 'text-[1.18rem] leading-[1.9]',
    lg: 'text-[1.32rem] leading-[2.0]',
  }[fontSize];

  const reflectionFontSizeClasses = {
    sm: 'text-[1.0rem] leading-[1.75]',
    base: 'text-[1.125rem] leading-[1.85]',
    lg: 'text-[1.26rem] leading-[1.95]',
  }[fontSize];

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `Lótus — Capítulo ${chapter.number}: ${chapter.title}`,
      text: `Leia o Capítulo ${chapter.number} (${chapter.title}) do livro Lótus por Davi Xavier.`,
      url,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback para clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  }

  // Carrega progresso local e/ou do Supabase
  useEffect(() => {
    const localKey = `lotus_note_${chapter.slug}`;
    const savedLocal =
      typeof window !== 'undefined' ? window.localStorage.getItem(localKey) : null;
    if (savedLocal) {
      setPersonalNote(savedLocal);
    }

    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
        const res = await fetch('/api/progress');
        if (res.ok) {
          const json = (await res.json()) as {
            progress?: Array<{
              chapter_slug: string;
              story_completed: boolean;
              personal_note: string | null;
            }>;
          };
          const current = json.progress?.find(
            (p) => p.chapter_slug === chapter.slug
          );
          if (current) {
            if (current.story_completed) setReflectionUnlocked(true);
            if (current.personal_note) setPersonalNote(current.personal_note);
          }
        }
      }
    });
  }, [chapter.slug]);

  async function handleUnlockReflection() {
    setReflectionUnlocked(true);

    if (userEmail && isSupabaseConfigured()) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterSlug: chapter.slug,
          storyCompleted: true,
          reflectionCompleted: false,
          personalNote,
        }),
      });
    }
  }

  async function handleSaveNote() {
    setNoteStatus('saving');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`lotus_note_${chapter.slug}`, personalNote);
    }

    if (userEmail && isSupabaseConfigured()) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterSlug: chapter.slug,
          storyCompleted: true,
          reflectionCompleted: true,
          personalNote,
        }),
      });
    }

    setNoteStatus('saved');
    setTimeout(() => setNoteStatus('idle'), 2400);
  }

  return (
    <div className="washi-desk min-h-screen px-0 sm:px-6 lg:px-10">
      <div className="washi-sheet mx-auto min-h-screen max-w-4xl text-[#141416]">
        {/* Barra de progresso de leitura */}
      <motion.div
        style={shouldReduceMotion ? undefined : { scaleX: scrollYProgress }}
        className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-[#C82E36]"
      />

      {/* Cabeçalho limpo de leitura */}
      <header
        className={`sticky top-0 z-40 border-b border-[#141416]/12 bg-[#F4EEDE]/94 backdrop-blur-sm transition-all duration-300 ${
          immersiveMode ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:px-8 sm:py-4">
          <Link
            href="/#sumario"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#141416] transition-colors hover:text-[#C82E36] sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Voltar ao Sumário</span>
            <span className="xs:hidden sm:hidden">Sumário</span>
          </Link>

          <div className="hidden items-center gap-2.5 md:flex">
            <HankoMark size="sm" label="蓮" />
            <span className="font-serif-editorial text-sm font-medium text-[#4A463F]">
              Capítulo {chapter.number} · {chapter.title}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Controles de Tamanho de Fonte */}
            <div className="flex items-center rounded-md border border-[#141416]/20 bg-[#FAF6EB]/60 p-0.5 text-xs text-[#141416]">
              <button
                type="button"
                onClick={() => handleFontSizeChange('sm')}
                aria-label="Tamanho de fonte padrão"
                className={`rounded px-1.5 py-0.5 font-medium transition-colors ${
                  fontSize === 'sm'
                    ? 'bg-[#141416] text-[#FAF6EB]'
                    : 'text-[#4A463F] hover:text-[#141416]'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('base')}
                aria-label="Tamanho de fonte médio"
                className={`rounded px-1.5 py-0.5 font-medium transition-colors ${
                  fontSize === 'base'
                    ? 'bg-[#141416] text-[#FAF6EB]'
                    : 'text-[#4A463F] hover:text-[#141416]'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('lg')}
                aria-label="Tamanho de fonte grande"
                className={`rounded px-1.5 py-0.5 font-medium transition-colors ${
                  fontSize === 'lg'
                    ? 'bg-[#141416] text-[#FAF6EB]'
                    : 'text-[#4A463F] hover:text-[#141416]'
                }`}
              >
                A+
              </button>
            </div>

            {/* Botão de Compartilhar */}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartilhar capítulo"
              className="inline-flex items-center gap-1 rounded-md border border-[#141416]/20 p-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36] sm:px-2.5 sm:py-1.5"
              title="Compartilhar capítulo ou copiar link"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#C82E36]" aria-hidden="true" />
                  <span className="hidden sm:inline text-[#C82E36]">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Compartilhar</span>
                </>
              )}
            </button>

            {/* Botão Modo Imersivo */}
            <button
              type="button"
              onClick={() => setImmersiveMode(!immersiveMode)}
              aria-label={immersiveMode ? 'Sair do Modo Imersivo' : 'Entrar no Modo Imersivo'}
              className={`inline-flex items-center gap-1 rounded-md border p-1.5 text-xs font-medium transition-colors sm:px-2.5 sm:py-1.5 ${
                immersiveMode
                  ? 'border-[#C82E36] bg-[#C82E36] text-[#FAF6EB]'
                  : 'border-[#141416]/20 text-[#141416] hover:border-[#C82E36] hover:text-[#C82E36]'
              }`}
              title={immersiveMode ? 'Sair do Modo Imersivo (Esc)' : 'Modo Imersivo (apenas a leitura)'}
            >
              {immersiveMode ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Modo Padrão</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Imersivo</span>
                </>
              )}
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              aria-label="Área do Leitor"
              className="inline-flex items-center gap-1 rounded-md border border-[#141416]/20 p-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36] sm:px-3 sm:py-1.5"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {userEmail ? 'Leitor conectado' : 'Área do Leitor'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        {/* Título do Capítulo */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-[#141416]/15 pb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#C82E36]">
            <span>Capítulo {chapter.number}</span>
            <div className="flex items-center gap-3 text-[#4A463F]">
              <span>{chapter.pagesLabel}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-medium text-[#C82E36]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {estimateReadingTime(chapter).label}
              </span>
            </div>
          </div>
          <h1 className="mt-3 font-serif-editorial text-4xl font-medium tracking-[-0.02em] text-[#000000] sm:text-5xl">
            {chapter.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4A463F]">
            {chapter.originNote}
          </p>
        </motion.div>

        {/* BLOCO 1 — O CONTO */}
        <section aria-labelledby="conto-heading" className="pt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="conto-heading"
              className="text-sm font-semibold uppercase tracking-wider text-[#C82E36]"
            >
              O Conto
            </h2>
            <button
              type="button"
              onClick={() => startFullBook(chapter.number)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#141416]/20 px-3 py-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
            >
              <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ouvir obra inteira</span>
            </button>
          </div>

          <ChapterAudioPlayer
            chapterSlug={chapter.slug}
            chapterTitle={chapter.title}
            section="conto"
            segments={chapterTimings?.conto}
            segmentsFem={chapterTimingsFem?.conto}
            onActiveIndexChange={setActiveContoIdx}
          />

          {/* Ilustração de abertura do capítulo */}
          <motion.figure
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="my-8 flex justify-center"
          >
            <img
              src={chapter.openingIllustration.src}
              alt={chapter.openingIllustration.alt}
              className="washi-plate max-h-[340px] w-auto select-none object-contain mix-blend-multiply"
            />
          </motion.figure>

          <div className={`mt-7 max-w-[65ch] space-y-6 font-serif-editorial ${fontSizeClasses} text-[#141416]`}>
            {chapter.storyParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  activeContoIdx === index
                    ? 'rounded-r-md border-l-2 border-[#C82E36] bg-[#C82E36]/12 py-1.5 pl-4 text-[#000000] transition-all duration-300 dark:bg-[#D94149]/25 dark:text-[#FAF6EB]'
                    : activeContoIdx !== null
                      ? 'opacity-65 transition-all duration-300'
                      : 'transition-all duration-300'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Ilustração de encerramento do conto (quando disponível) */}
          {chapter.closingIllustration && (
            <figure className="mt-12 flex justify-center">
              <img
                src={chapter.closingIllustration.src}
                alt={chapter.closingIllustration.alt}
                className={
                  chapter.closingIllustration.fullBleed
                    ? 'washi-plate max-h-[460px] w-auto object-contain'
                    : 'washi-plate max-h-[420px] w-auto select-none object-contain mix-blend-multiply'
                }
              />
            </figure>
          )}

          {/* Símbolo tradicional japonês de fim + Ritual de transição */}
          <div className="mt-14 border-y border-[#141416]/15 py-10 text-center">
            <p
              aria-label="Fim do conto"
              className="font-jp-seal text-3xl tracking-widest text-[#141416]"
            >
              終わり
            </p>

            {!reflectionUnlocked ? (
              <div className="mt-6 space-y-3">
                <p className="mx-auto max-w-md text-sm leading-relaxed text-[#4A463F]">
                  O conto chegou ao fim. Quando estiver pronto para explorar os
                  conceitos filosóficos e suas aplicações no cotidiano, abra a
                  reflexão abaixo.
                </p>
                <motion.button
                  type="button"
                  onClick={handleUnlockReflection}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  className="mt-2 inline-flex items-center gap-2.5 rounded-md bg-[#C82E36] px-6 py-3 text-sm font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229]"
                >
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Abrir Reflexão de Lótus</span>
                </motion.button>
              </div>
            ) : (
              <p className="mt-3 text-xs font-medium text-[#C82E36]">
                Conto concluído · Reflexão de Lótus aberta abaixo
              </p>
            )}
          </div>
        </section>

        {/* BLOCO 2 — REFLEXÃO DE LÓTUS */}
        <AnimatePresence>
          {reflectionUnlocked && (
            <motion.section
              id="reflexao"
              aria-labelledby="reflexao-heading"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="pt-14"
            >
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="reflexao-heading"
                  className="font-serif-editorial text-3xl font-medium text-[#C82E36]"
                >
                  Reflexão de Lótus
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {chapter.concepts.map((c) => (
                    <span
                      key={c}
                      className="rounded border border-[#141416]/15 bg-[#FAF6EB] px-2 py-0.5 text-xs font-medium text-[#141416]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <ChapterAudioPlayer
                chapterSlug={chapter.slug}
                chapterTitle={chapter.title}
                section="reflexao"
                segments={chapterTimings?.reflexao}
                segmentsFem={chapterTimingsFem?.reflexao}
                onActiveIndexChange={setActiveReflexaoIdx}
              />

              <div className={`mt-8 max-w-[65ch] space-y-6 font-serif-editorial ${reflectionFontSizeClasses} text-[#141416]`}>
                {chapter.reflectionBlocks.map((block, index) => {
                  const isActive = activeReflexaoIdx === index;
                  const isDimmed = activeReflexaoIdx !== null && !isActive;

                  if (block.type === 'concept' && block.conceptName) {
                    return (
                      <div
                        key={index}
                        className={`rounded-xl border p-5 transition-all duration-300 sm:p-6 ${
                          isActive
                            ? 'border-[#C82E36] bg-[#C82E36]/12 text-[#000000] dark:bg-[#D94149]/25 dark:text-[#FAF6EB]'
                            : `border-[#141416]/15 bg-[#FAF6EB] ${isDimmed ? 'opacity-65' : ''}`
                        }`}
                      >
                        <p>
                          <strong className="font-semibold text-[#C82E36]">
                            {block.conceptName}:
                          </strong>{' '}
                          {block.text}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className={
                        isActive
                          ? 'rounded-r-md border-l-2 border-[#C82E36] bg-[#C82E36]/12 py-1.5 pl-4 text-[#000000] transition-all duration-300 dark:bg-[#D94149]/25 dark:text-[#FAF6EB]'
                          : isDimmed
                            ? 'opacity-65 transition-all duration-300'
                            : 'transition-all duration-300'
                      }
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>

              <p
                aria-label="Fim do capítulo"
                className="mt-10 font-jp-seal text-lg tracking-widest text-[#C82E36]"
              >
                終わり
              </p>

              {/* Caderno Pessoal do Leitor */}
              <div className="mt-14 rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif-editorial text-xl font-medium text-[#000000]">
                    Caderno de Reflexão Pessoal
                  </h3>
                  <span className="text-xs text-[#4A463F]">
                    {userEmail
                      ? 'Sincronizado na sua conta Supabase'
                      : 'Salvo neste navegador'}
                  </span>
                </div>
                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Anote o que este capítulo despertou em você hoje..."
                  aria-label="Anotação pessoal sobre o capítulo"
                  className="mt-3 w-full rounded-md border border-[#141416]/20 bg-[#F4EEDE]/70 p-3.5 text-sm leading-relaxed text-[#141416] placeholder:text-[#4A463F]/75 focus:border-[#C82E36] focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#4A463F]">
                    {personalNote.length}/2000 caracteres
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBookmarkOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#141416]/20 bg-transparent px-3 py-2 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
                      title="Gerar marcador Tanzaku com a arte do capítulo e sua anotação"
                    >
                      <Bookmark className="h-3.5 w-3.5 text-[#C82E36]" aria-hidden="true" />
                      <span>Gerar Marcador</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={noteStatus === 'saving'}
                      className="inline-flex items-center gap-2 rounded-md bg-[#141416] px-4 py-2 text-xs font-medium text-[#F4EEDE] transition-colors hover:bg-[#C82E36]"
                    >
                      {noteStatus === 'saved' ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Anotação salva</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {noteStatus === 'saving' ? 'Salvando...' : 'Salvar anotação'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Navegação de rodapé entre capítulos */}
        <nav
          aria-label="Navegação entre capítulos"
          className="mt-16 flex flex-col justify-between gap-4 border-t border-[#141416]/15 pt-8 sm:flex-row sm:items-center"
        >
          {prevChapter ? (
            <Link
              href={`/capitulos/${prevChapter.slug}`}
              className="group inline-flex items-center gap-3 text-left text-sm font-medium text-[#141416] transition-colors hover:text-[#C82E36]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-xs text-[#4A463F]">
                  Capítulo Anterior
                </span>
                <span className="font-serif-editorial text-base">
                  Cap. {prevChapter.number}: {prevChapter.title}
                </span>
              </span>
            </Link>
          ) : (
            <Link
              href="/#sumario"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4A463F] transition-colors hover:text-[#141416]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Voltar ao Sumário</span>
            </Link>
          )}

          {nextChapter ? (
            <Link
              href={`/capitulos/${nextChapter.slug}`}
              className="group inline-flex items-center justify-end gap-3 text-right text-sm font-medium text-[#141416] transition-colors hover:text-[#C82E36]"
            >
              <span>
                <span className="block text-xs text-[#4A463F]">
                  Próximo Capítulo
                </span>
                <span className="font-serif-editorial text-base">
                  Cap. {nextChapter.number}: {nextChapter.title}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href="/#acompanhamento"
              className="inline-flex items-center justify-end gap-2 text-sm font-medium text-[#C82E36] transition-colors hover:text-[#A82229]"
            >
              <span>Acompanhar novos capítulos</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </nav>

        {/* Rodapé sutil de versão da edição digital */}
        <div className="mt-12 flex items-center justify-between border-t border-[#141416]/10 pt-6 text-xs text-[#4A463F]">
          <span>Lótus — Edição Digital do Autor</span>
          <span className="rounded border border-[#141416]/15 bg-[#FAF6EB] px-2 py-0.5 text-[11px] font-medium text-[#141416]">
            v1.1.0
          </span>
        </div>
      </main>

      <ReaderAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        userEmail={userEmail}
        onAuthChange={setUserEmail}
      />

      <TanzakuBookmarkModal
        isOpen={bookmarkOpen}
        onClose={() => setBookmarkOpen(false)}
        chapter={chapter}
        personalNote={personalNote}
      />

      {/* Botão flutuante minimalista de saída quando em Modo Imersivo */}
      <AnimatePresence>
        {immersiveMode && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setImmersiveMode(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[#141416]/20 bg-[#FAF6EB] px-4 py-2 text-xs font-medium text-[#141416] shadow-lg backdrop-blur transition-all hover:border-[#C82E36] hover:bg-[#C82E36] hover:text-[#FAF6EB]"
              title="Voltar ao modo normal com cabeçalho"
            >
              <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sair do Imersivo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
