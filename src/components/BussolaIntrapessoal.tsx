'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, BookOpen } from 'lucide-react';

interface MindStateOption {
  id: string;
  label: string;
  concepts: string[];
  summary: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterSlug: string;
}

const MIND_STATES: MindStateOption[] = [
  {
    id: 'perfeccionismo',
    label: 'Preso na cobrança por resultados ou perfeccionismo',
    concepts: ['Chado', 'Wabi-sabi'],
    summary:
      'O ritual importa tanto quanto o destino. Aprender a valorizar o processo diário e aceitar as próprias imperfeições sem rigidez.',
    chapterNumber: 1,
    chapterTitle: 'O Mestre de Chá e o Samurai',
    chapterSlug: 'capitulo-1',
  },
  {
    id: 'ansiedade',
    label: 'Sem foco ou ansioso diante de um desafio',
    concepts: ['Zanshin', 'Bushido'],
    summary:
      'Alcançar o estado de alerta relaxado: manter a mente desperta, presente e serena mesmo sob pressão.',
    chapterNumber: 1,
    chapterTitle: 'O Mestre de Chá e o Samurai',
    chapterSlug: 'capitulo-1',
  },
  {
    id: 'conflito',
    label: 'Lidando com provocações, raiva ou conflitos',
    concepts: ['Sei-chō-dō', 'Gokui', 'Mushin'],
    summary:
      'A verdadeira estratégia não está em vencer o embate pela força, mas em redirecionar a tensão e dissolver o conflito antes que ele cresça.',
    chapterNumber: 2,
    chapterTitle: 'A Balsa de Tsukahara Bokuden',
    chapterSlug: 'capitulo-2',
  },
  {
    id: 'controle',
    label: 'Tentando controlar cada detalhe da rotina',
    concepts: ['Ziran', 'Yin Yang', 'Wei'],
    summary:
      'Equilibrar razão e intuição, abandonando o excesso de controle artificial (Wei) para confiar no fluxo natural das coisas (Ziran).',
    chapterNumber: 3,
    chapterTitle: 'A Alegria dos Peixes, Yin Yang',
    chapterSlug: 'capitulo-3',
  },
];

export function BussolaIntrapessoal() {
  const [selectedState, setSelectedState] = useState<MindStateOption>(MIND_STATES[0]);

  return (
    <section
      id="bussola"
      aria-labelledby="bussola-heading"
      className="border-t border-[#141416]/12 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Cabeçalho da Seção */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C82E36]">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Orientação Filosofica</span>
          </div>
          <h2
            id="bussola-heading"
            className="mt-3 font-serif-editorial text-3xl font-medium tracking-[-0.02em] text-[#000000] sm:text-4xl"
          >
            Bússola Intrapessoal
          </h2>
          <p className="mt-3 font-serif-editorial text-xl italic text-[#4A463F]">
            &ldquo;Qual confronto acontece dentro da sua mente agora?&rdquo;
          </p>
          <p className="mt-2 text-sm text-[#4A463F]/90">
            Escolha o estado que melhor descreve o seu momento e descubra qual conto e filosofia oriental podem trazer clareza hoje.
          </p>
        </div>

        {/* Grade de Seleção de Estados Mentais */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MIND_STATES.map((state) => {
            const isSelected = selectedState.id === state.id;
            return (
              <button
                key={state.id}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`group relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#C82E36] bg-[#EDE0C8] shadow-sm ring-1 ring-[#C82E36]'
                    : 'border-[#141416]/15 bg-[#E2D0B0]/40 hover:border-[#141416]/40 hover:bg-[#E2D0B0]/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block h-2 w-2 rounded-full transition-colors ${
                        isSelected ? 'bg-[#C82E36]' : 'bg-[#141416]/20 group-hover:bg-[#141416]/40'
                      }`}
                    />
                    <span className="text-[11px] font-medium text-[#4A463F]">
                      Cap. {state.chapterNumber}
                    </span>
                  </div>
                  <p className="mt-4 font-serif-editorial text-base font-medium leading-snug text-[#141416]">
                    {state.label}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 pt-2 border-t border-[#141416]/10">
                  {state.concepts.map((c) => (
                    <span
                      key={c}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#C82E36]/10 text-[#C82E36]'
                          : 'bg-[#141416]/5 text-[#4A463F]'
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel de Resposta / Recomendação com Fade Suave */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedState.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-2xl border border-[#141416]/15 bg-[#EDE0C8] p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C82E36]">
                      Conceitos-chave:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedState.concepts.map((c) => (
                        <span
                          key={c}
                          className="rounded-md border border-[#C82E36]/30 bg-[#C82E36]/10 px-2.5 py-0.5 text-xs font-medium text-[#C82E36]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="font-serif-editorial text-lg leading-relaxed text-[#141416] sm:text-xl">
                    {selectedState.summary}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#4A463F]">
                    <span>Capítulo indicado:</span>
                    <strong className="font-medium text-[#000000]">
                      Capítulo {selectedState.chapterNumber} — {selectedState.chapterTitle}
                    </strong>
                  </div>
                </div>

                <div className="flex shrink-0 items-center">
                  <Link
                    href={`/capitulos/${selectedState.chapterSlug}`}
                    className="inline-flex items-center gap-2.5 rounded-md bg-[#C82E36] px-5 py-3 text-sm font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229]"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Ler Capítulo {selectedState.chapterNumber}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
