'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Headphones, Sparkles } from 'lucide-react';
import { BOOK_PREFACE, CHAPTERS, estimateReadingTime } from '@/data/lotus-content';
import { SiteHeader } from './SiteHeader';
import { HankoMark } from './HankoMark';
import { BookIntro } from './BookIntro';
import { PetalButtonLink } from './PetalButtonLink';
import { PillarsMap } from './PillarsMap';
import { BussolaIntrapessoal } from './BussolaIntrapessoal';
import { WaitlistForm } from './WaitlistForm';
import { ReaderAuthModal } from './ReaderAuthModal';
import { QuoteOracleModal } from './QuoteOracleModal';
import { useFullBookAudio } from './FullBookAudioContext';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function HomeClient() {
  const shouldReduceMotion = useReducedMotion();
  const { startFullBook } = useFullBookAudio();
  const [authOpen, setAuthOpen] = useState(false);
  const [oracleOpen, setOracleOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [lastRead, setLastRead] = useState<{
    slug: string;
    number: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('lotus_last_read');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.slug && parsed?.number && parsed?.title) {
            setLastRead(parsed);
          }
        }
      } catch {
        // ignore
      }
    }

    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  return (
    <div className="washi-desk min-h-screen px-0 sm:px-6 lg:px-10">
      <BookIntro />
      <div className="washi-sheet mx-auto min-h-screen max-w-6xl text-[#141416]">
        <SiteHeader
          onOpenAuth={() => setAuthOpen(true)}
          onOpenOracle={() => setOracleOpen(true)}
          userEmail={userEmail}
        />

        {/* Faixa discreta de Retomar Leitura */}
        {lastRead && (
          <aside
            aria-label="Continuar leitura anterior"
            className="border-b border-[#141416]/10 bg-[#E2D0B0]/50 px-4 py-2.5 transition-colors sm:px-8"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex min-w-0 items-center gap-2 text-[#4A463F]">
                <BookOpen className="h-4 w-4 shrink-0 text-[#C82E36]" aria-hidden="true" />
                <span className="truncate">
                  Continuar leitura:{' '}
                  <strong className="font-medium text-[#141416]">
                    Capítulo {lastRead.number} — {lastRead.title}
                  </strong>
                </span>
              </div>
              <Link
                href={`/capitulos/${lastRead.slug}`}
                className="inline-flex shrink-0 items-center gap-1 font-medium text-[#C82E36] transition-colors hover:text-[#A82229] hover:underline"
              >
                <span>Retomar</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        )}

      <main>
        {/* 1. HERO (Primeira Dobra) */}
        <section className="mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center px-5 py-10 sm:px-8 sm:py-12">
          <div className="grid w-full gap-10 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="mb-6 flex items-center gap-3.5">
                <HankoMark size="lg" label="蓮" />
                <span className="text-sm font-medium text-[#4A463F]">
                  Contos orientais e filosofia intrapessoal
                </span>
              </div>

              <h1 className="font-serif-editorial text-5xl font-medium tracking-[-0.03em] text-[#000000] sm:text-7xl">
                Lótus
              </h1>

              <blockquote className="mt-7 max-w-[54ch] border-l border-[#C82E36] pl-5 font-serif-editorial text-xl leading-relaxed text-[#141416] sm:text-2xl">
                “{BOOK_PREFACE.lead}”
              </blockquote>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <PetalButtonLink
                  href="/capitulos/capitulo-1"
                  className="inline-flex items-center gap-2.5 rounded-md bg-[#C82E36] px-6 py-3.5 text-sm font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229]"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>Começar a Leitura — Capítulo 1</span>
                </PetalButtonLink>

                <a
                  href="#sumario"
                  className="inline-flex items-center gap-2 rounded-md border border-[#141416]/25 px-5 py-3.5 text-sm font-medium text-[#141416] transition-colors hover:border-[#141416]"
                >
                  <span>Explorar Sumário</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            {/* Ilustração Original da Capa */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:col-span-5"
            >
              <div className="mx-auto max-w-[280px] sm:max-w-[340px]">
                <img
                  src="/ilustracoes/lotus-capa.jpg"
                  alt="Ilustração em aquarela e nanquim da flor de lótus com o kanji 蓮"
                  className="washi-plate h-auto w-full select-none mix-blend-multiply"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. SOBRE A OBRA (Prefácio) */}
        <section
          id="prefacio"
          className="border-t border-[#141416]/12 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <h2 className="font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl">
              {BOOK_PREFACE.title}
            </h2>

            <div className="mt-8 max-w-[65ch] space-y-6 font-serif-editorial text-lg leading-[1.85] text-[#141416] sm:text-xl">
              {BOOK_PREFACE.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <p
              aria-label="Fim do prefácio"
              className="mt-10 font-jp-seal text-lg tracking-widest text-[#C82E36]"
            >
              {BOOK_PREFACE.endingSymbol}
            </p>
          </div>
        </section>

        {/* 3. SUMÁRIO INTERATIVO */}
        <section
          id="sumario"
          className="border-t border-[#141416]/12 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl">
                  Sumário Interativo
                </h2>
                <p className="mt-2 text-base text-[#4A463F]">
                  Escolha um capítulo para iniciar a leitura integral.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => startFullBook(1)}
                  className="inline-flex items-center gap-2 rounded-md border border-[#C82E36] bg-[#F4EEDE] px-4 py-2 text-xs font-medium text-[#C82E36] transition-colors hover:bg-[#C82E36] hover:text-[#FAF6EB]"
                >
                  <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Ouvir obra inteira</span>
                </button>
                <span className="text-xs font-medium text-[#4A463F]">
                  3 capítulos disponíveis
                </span>
              </div>
            </div>

            <div className="mt-10 divide-y divide-[#141416]/15 border-y border-[#141416]/15">
              {CHAPTERS.map((chapter) => (
                <article
                  key={chapter.slug}
                  className="grid gap-6 py-8 md:grid-cols-12 md:items-center"
                >
                  <div className="flex items-center gap-4 md:col-span-3">
                    <img
                      src={chapter.openingIllustration.src}
                      alt={chapter.openingIllustration.alt}
                      className="h-16 w-16 shrink-0 rounded object-contain mix-blend-multiply sm:h-20 sm:w-20"
                    />
                    <div>
                      <span className="text-xs font-medium text-[#C82E36]">
                        Capítulo {chapter.number}
                      </span>
                      <p className="mt-1 text-xs text-[#4A463F]">{chapter.pagesLabel}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#4A463F]/85">
                        <Clock className="h-3 w-3 text-[#C82E36]" aria-hidden="true" />
                        {estimateReadingTime(chapter).label}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-6">
                    <h3 className="font-serif-editorial text-2xl font-medium text-[#000000]">
                      <Link
                        href={`/capitulos/${chapter.slug}`}
                        className="transition-colors hover:text-[#C82E36]"
                      >
                        “{chapter.title}”
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4A463F]">
                      {chapter.originNote}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {chapter.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="rounded border border-[#141416]/15 bg-[#F4EEDE] px-2.5 py-0.5 text-xs font-medium text-[#141416]"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:col-span-3 md:justify-end">
                    <PetalButtonLink
                      href={`/capitulos/${chapter.slug}`}
                      className="inline-flex items-center gap-2 rounded-md border border-[#141416] px-4 py-2.5 text-sm font-medium text-[#141416] transition-colors hover:bg-[#141416] hover:text-[#F4EEDE]"
                    >
                      <span>Ler capítulo</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </PetalButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. BÚSSOLA INTRAPESSOAL */}
        <BussolaIntrapessoal />

        {/* 5. MAPA DOS PILARES FILOSÓFICOS */}
        <section
          id="pilares"
          className="border-t border-[#141416]/12 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl">
                Mapa dos Pilares Filosóficos
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#4A463F]">
                Explore os 13 conceitos orientais presentes nos três primeiros
                capítulos de Lótus e acesse diretamente a reflexão de cada um.
              </p>
            </div>

            <div className="mt-10">
              <PillarsMap />
            </div>
          </div>
        </section>

        {/* 6. COMO FUNCIONA A LEITURA */}
        <section
          id="como-funciona"
          className="border-t border-[#141416]/12 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl">
                Como Funciona a Leitura
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#4A463F]">
                Cada capítulo do livro segue um ritmo contemplativo em dois tempos:
                primeiro a vivência da narrativa sem interrupções; depois, o mergulho
                nos conceitos filosóficos aplicados ao presente.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="border-t-2 border-[#141416] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#C82E36]">
                    Primeiro Tempo
                  </span>
                  <span className="font-jp-seal text-sm text-[#4A463F]">
                    終わり
                  </span>
                </div>
                <h3 className="mt-3 font-serif-editorial text-2xl font-medium text-[#000000]">
                  O Conto
                </h3>
                <p className="mt-3 max-w-[58ch] font-serif-editorial text-base leading-relaxed text-[#141416]/90">
                  Você lê a parábola oriental por completo, em página limpa e
                  respirada, até alcançar o símbolo tradicional japonês de
                  encerramento (<span className="font-jp-seal">終わり</span>). Nenhuma
                  explicação interrompe a imersão.
                </p>
              </div>

              <div className="border-t-2 border-[#C82E36] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#C82E36]">
                    Segundo Tempo
                  </span>
                  <Sparkles className="h-4 w-4 text-[#C82E36]" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-serif-editorial text-2xl font-medium text-[#000000]">
                  Reflexão de Lótus
                </h3>
                <p className="mt-3 max-w-[58ch] font-serif-editorial text-base leading-relaxed text-[#141416]/90">
                  Ao concluir o conto, a seção filosófica se abre. Nela, cada
                  conceito japonês ou chinês da história é desdobrado e traduzido
                  para decisões cotidianas, relações e autoconhecimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. SOBRE O AUTOR */}
        <section
          id="autor"
          className="border-t border-[#141416]/12 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl">
                Sobre o Autor
              </h2>
              <span className="text-xs font-medium text-[#C82E36]">
                Davi Xavier, 16 anos
              </span>
            </div>

            <div className="mt-8 max-w-[65ch] space-y-5 font-serif-editorial text-lg leading-[1.85] text-[#141416]">
              <p>
                Oi, eu sou o Davi Xavier e tenho 16 anos. Estou escrevendo o{' '}
                <em>Lótus</em> para jovens e adultos que querem enxergar a vida
                de um jeito diferente, com menos pressa e menos barulho.
              </p>
              <p>
                A ideia do livro é pegar ensinamentos da filosofia asiática
                antiga e adaptar para o que a gente vive hoje, como o excesso de
                telas, a pressão do trabalho, a rotina corrida e as batalhas que
                acontecem na nossa própria mente.
              </p>
              <p>
                Não escrevo como alguém que já tem todas as respostas. Faço este
                livro também para aprender, e cada conto aqui é um exercício
                prático que vou descobrindo enquanto escrevo.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 border-t border-[#141416]/12 pt-6 text-xs text-[#4A463F]">
              <span>
                <strong className="font-medium text-[#141416]">Público:</strong>{' '}
                Jovens e adultos
              </span>
              <span>
                <strong className="font-medium text-[#141416]">Foco:</strong>{' '}
                Filosofia asiática aplicada às telas, trabalho e rotina
              </span>
            </div>
          </div>
        </section>

        {/* 7. LISTA DE ACOMPANHAMENTO */}
        <section
          id="acompanhamento"
          className="border-t border-[#141416]/12 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl">
                Lista de Acompanhamento
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#4A463F]">
                O Capítulo 3 ainda está com páginas em aberto e novos contos estão
                sendo escritos. Deixe seu e-mail ou WhatsApp para receber avisos sobre
                novos capítulos e o lançamento do livro completo.
              </p>
            </div>

            <div className="mt-8">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#141416]/15 bg-[#F4EEDE] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 text-sm text-[#4A463F] sm:flex-row sm:items-center sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <HankoMark size="sm" label="蓮" />
            <span className="font-serif-editorial text-base text-[#141416]">
              Lótus
            </span>
            <span>· Contos orientais sob uma ótica intrapessoal</span>
            <span className="rounded-full border border-[#141416]/20 bg-[#EDE0C8] px-2 py-0.5 text-[11px] font-medium text-[#141416]">
              v1.1.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-[#4A463F] transition-colors hover:text-[#C82E36]"
            >
              Painel do Autor
            </Link>
            <p className="font-jp-seal text-sm text-[#C82E36]">終わり</p>
          </div>
        </div>
      </footer>

      <ReaderAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        userEmail={userEmail}
        onAuthChange={setUserEmail}
      />

      <QuoteOracleModal
        isOpen={oracleOpen}
        onClose={() => setOracleOpen(false)}
      />
      </div>
    </div>
  );
}
