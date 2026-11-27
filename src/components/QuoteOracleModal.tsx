'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Copy,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { HankoMark } from './HankoMark';

export interface ZenQuote {
  quote: string;
  source: string;
  concept: string;
  conceptMeaning: string;
  chapterSlug: string;
  chapterNumber: number;
}

export const ZEN_QUOTES: ZenQuote[] = [
  {
    quote:
      'Nem todos os grandes confrontos acontecem nos campos de batalha, mas sim dentro das nossas mentes.',
    source: 'Prefácio de Lótus',
    concept: 'Mushin',
    conceptMeaning: 'A mente vazia de ruídos, aberta para ver a verdade sem ilusões.',
    chapterSlug: 'capitulo-1',
    chapterNumber: 1,
  },
  {
    quote:
      'Enfrente o samurai com a mesma mente serena com que você prepara o chá.',
    source: 'Capítulo 1: O Mestre de Chá e o Samurai',
    concept: 'Zanshin',
    conceptMeaning: 'Estado de atenção contínua e presença total no momento presente.',
    chapterSlug: 'capitulo-1',
    chapterNumber: 1,
  },
  {
    quote:
      'A honra não está na vitória sobre o outro, mas no domínio da própria postura diante do medo.',
    source: 'Capítulo 1: O Mestre de Chá e o Samurai',
    concept: 'Bushido',
    conceptMeaning: 'O Caminho do Guerreiro pautado na coragem serena e na retidão moral.',
    chapterSlug: 'capitulo-1',
    chapterNumber: 1,
  },
  {
    quote:
      'A balsa serve para cruzar a correnteza turbulenta, não para ser carregada nos ombros montanha acima.',
    source: 'Capítulo 2: A Ilha e a Balsa',
    concept: 'Upaya & Desapego',
    conceptMeaning: 'A sabedoria de soltar os métodos que já cumpriram sua função na sua travessia.',
    chapterSlug: 'capitulo-2',
    chapterNumber: 2,
  },
  {
    quote:
      'A pressa é o ruído da mente tentando chegar a um lugar que já está sob seus próprios pés.',
    source: 'Capítulo 2: A Ilha e a Balsa',
    concept: 'Wabi-sabi',
    conceptMeaning: 'Reconhecer a beleza na incompletude e no ritmo natural do tempo.',
    chapterSlug: 'capitulo-2',
    chapterNumber: 2,
  },
  {
    quote:
      'Quem nada contra o próprio cardume consome suas forças; quem compreende o fluxo encontra a direção.',
    source: 'Capítulo 3: Os Peixes e o Rio',
    concept: 'Wu Wei',
    conceptMeaning: 'A arte da ação sem esforço forçado, agindo em harmonia com a natureza.',
    chapterSlug: 'capitulo-3',
    chapterNumber: 3,
  },
  {
    quote:
      'O silêncio não é a ausência de som, mas a presença da atenção plena em cada respiração.',
    source: 'Capítulo 3: Os Peixes e o Rio',
    concept: 'Zen & Dhyana',
    conceptMeaning: 'O cultivo da clareza mental além das distrações e excesso de telas.',
    chapterSlug: 'capitulo-3',
    chapterNumber: 3,
  },
];

interface QuoteOracleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteOracleModal({ isOpen, onClose }: QuoteOracleModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const current = ZEN_QUOTES[currentIndex];

  function handleNextQuote() {
    setIsRotating(true);
    setCurrentIndex((prev) => (prev + 1) % ZEN_QUOTES.length);
    setTimeout(() => setIsRotating(false), 450);
  }

  async function handleCopy() {
    const textToCopy = `“${current.quote}”\n\n— Filosofia: ${current.concept} (${current.conceptMeaning})\n— Do livro Lótus por Davi Xavier\nhttps://lotus-livro.vercel.app/capitulos/${current.chapterSlug}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="oracle-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop suave de tinta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm"
          />

          {/* Modal estilo pergaminho tradicional */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="washi-sheet relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[#141416]/20 bg-[#EDE0C8] p-6 shadow-2xl sm:p-8"
          >
            {/* Linha superior com selo e fechar */}
            <div className="flex items-center justify-between border-b border-[#141416]/12 pb-4">
              <div className="flex items-center gap-2.5">
                <HankoMark size="sm" label="蓮" />
                <div>
                  <h3
                    id="oracle-title"
                    className="font-serif-editorial text-lg font-medium text-[#000000]"
                  >
                    Reflexão do Momento
                  </h3>
                  <p className="text-xs text-[#4A463F]">
                    Sabedoria oriental para desacelerar a mente
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar reflexão"
                className="rounded-md p-1.5 text-[#4A463F] transition-colors hover:bg-[#141416]/10 hover:text-[#141416]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conteúdo da Citação */}
            <div className="my-7">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-[#141416]/15 bg-[#E2D0B0] px-3 py-1 text-xs font-medium text-[#141416]">
                  {current.concept}
                </span>
                <span className="text-xs font-medium text-[#4A463F]">
                  Capítulo {current.chapterNumber}
                </span>
              </div>

              <blockquote className="mt-5 font-serif-editorial text-xl font-normal leading-relaxed text-[#141416] sm:text-2xl sm:leading-relaxed">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Explicação da Filosofia */}
              <div className="mt-5 rounded-xl border border-[#141416]/12 bg-[#E2D0B0]/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[#C82E36]">
                  Filosofia Aplicada · {current.concept}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#141416]/90">
                  {current.conceptMeaning}
                </p>
              </div>

              <p className="mt-3 text-right text-xs text-[#4A463F]">
                Origem: <span className="font-medium text-[#141416]">{current.source}</span>
              </p>
            </div>

            {/* Ações inferiores */}
            <div className="flex flex-col gap-3 border-t border-[#141416]/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleNextQuote}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#141416]/20 bg-[#EDE0C8] px-4 py-2.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 transition-transform duration-500 ${
                    isRotating ? 'rotate-180 text-[#C82E36]' : ''
                  }`}
                />
                <span>Tirar outra reflexão</span>
              </button>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#141416]/20 bg-[#EDE0C8] px-3.5 py-2 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
                  title="Copiar citação para colar onde quiser"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#C82E36]" />
                      <span className="text-[#C82E36]">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar reflexão</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/capitulos/${current.chapterSlug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#C82E36] px-3.5 py-2 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229]"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Ler Conto</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
