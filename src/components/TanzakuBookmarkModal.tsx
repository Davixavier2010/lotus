'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Bookmark, Check } from 'lucide-react';
import { HankoMark } from './HankoMark';
import type { ChapterData } from '@/data/lotus-content';

interface TanzakuBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: ChapterData;
  personalNote?: string;
}

const CHAPTER_QUOTES: Record<number, { quote: string; concept: string }> = {
  1: {
    quote: 'Enfrente o samurai com a mesma mente serena com que você prepara o chá.',
    concept: 'Zanshin · Presença e Atenção Plena',
  },
  2: {
    quote: 'A balsa serve para cruzar o rio turbulento, não para ser carregada nos ombros montanha acima.',
    concept: 'Upaya · A Sabedoria do Desapego',
  },
  3: {
    quote: 'Quem compreende o fluxo natural do rio encontra a direção sem esgotar as forças.',
    concept: 'Wu Wei · Harmonia Sem Esforço Forçado',
  },
};

export function TanzakuBookmarkModal({
  isOpen,
  onClose,
  chapter,
  personalNote,
}: TanzakuBookmarkModalProps) {
  const bookmarkRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const quoteInfo = CHAPTER_QUOTES[chapter.number] || {
    quote: 'Nem todos os grandes confrontos acontecem nos campos de batalha, mas dentro da mente.',
    concept: chapter.concepts[0] || 'Zen',
  };

  async function handleDownloadPNG() {
    setDownloading(true);
    try {
      // Criação de canvas nativo de alta definição (600x1600 px) para qualidade impecável de impressão
      const canvas = document.createElement('canvas');
      const width = 600;
      const height = 1600;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Fundo Pergaminho Washi
      ctx.fillStyle = '#EDE0C8';
      ctx.fillRect(0, 0, width, height);

      // Borda decorativa interna dupla
      ctx.strokeStyle = '#C82E36';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = 'rgba(20, 20, 22, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Furo do cordão tradicional Tanzaku no topo
      ctx.fillStyle = '#CBB389';
      ctx.beginPath();
      ctx.arc(width / 2, 65, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(20, 20, 22, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Selo Hanko tradicional Lótus
      ctx.fillStyle = '#C82E36';
      ctx.fillRect(width / 2 - 28, 120, 56, 56);
      ctx.fillStyle = '#FAF6EB';
      ctx.font = 'bold 36px "Noto Serif JP", serif';
      ctx.textAlign = 'center';
      ctx.fillText('蓮', width / 2, 162);

      // Título Editorial
      ctx.fillStyle = '#141416';
      ctx.font = '600 24px Georgia, serif';
      ctx.fillText('L Ó T U S', width / 2, 225);

      ctx.fillStyle = '#C82E36';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.fillText(`CAPÍTULO ${chapter.number}`, width / 2, 260);

      ctx.fillStyle = '#000000';
      ctx.font = '500 26px Georgia, serif';
      ctx.fillText(`"${chapter.title}"`, width / 2, 300);

      // Linha sutil divisória
      ctx.strokeStyle = 'rgba(20, 20, 22, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 340);
      ctx.lineTo(width - 80, 340);
      ctx.stroke();

      // Citação do Capítulo
      ctx.fillStyle = '#141416';
      ctx.font = 'italic 28px Georgia, serif';
      const quoteWords = `“${quoteInfo.quote}”`.split(' ');
      let line = '';
      let y = 430;
      for (const word of quoteWords) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 140 && line !== '') {
          ctx.fillText(line.trim(), width / 2, y);
          line = word + ' ';
          y += 46;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width / 2, y);

      // Conceito Filosófico
      y += 90;
      ctx.fillStyle = 'rgba(200, 46, 54, 0.1)';
      ctx.fillRect(70, y - 32, width - 140, 50);
      ctx.strokeStyle = 'rgba(200, 46, 54, 0.35)';
      ctx.strokeRect(70, y - 32, width - 140, 50);

      ctx.fillStyle = '#C82E36';
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.fillText(quoteInfo.concept.toUpperCase(), width / 2, y);

      // Anotação pessoal do leitor (se houver)
      if (personalNote && personalNote.trim().length > 0) {
        y += 120;
        ctx.fillStyle = '#4A463F';
        ctx.font = '600 13px -apple-system, sans-serif';
        ctx.fillText('REFLEXÃO PESSOAL DO LEITOR', width / 2, y);

        y += 38;
        ctx.fillStyle = '#141416';
        ctx.font = 'italic 20px Georgia, serif';
        const noteWords = `"${personalNote.trim()}"`.split(' ');
        let noteLine = '';
        let noteLinesCount = 0;
        for (const w of noteWords) {
          if (noteLinesCount >= 4) break;
          const test = noteLine + w + ' ';
          if (ctx.measureText(test).width > width - 140 && noteLine !== '') {
            ctx.fillText(noteLine.trim(), width / 2, y);
            noteLine = w + ' ';
            y += 34;
            noteLinesCount++;
          } else {
            noteLine = test;
          }
        }
        if (noteLinesCount < 4) {
          ctx.fillText(noteLine.trim(), width / 2, y);
        }
      }

      // Encerramento Tradicional no Rodapé
      ctx.fillStyle = '#C82E36';
      ctx.font = 'bold 30px "Noto Serif JP", serif';
      ctx.fillText('終わり', width / 2, height - 120);

      ctx.fillStyle = '#4A463F';
      ctx.font = '500 16px Georgia, serif';
      ctx.fillText('Lótus · Davi Xavier, 16 anos', width / 2, height - 75);

      // Download do arquivo
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `marcador-lotus-capitulo-${chapter.number}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      // Fallback
    } finally {
      setDownloading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tanzaku-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop escurecido suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/65 backdrop-blur-sm"
          />

          {/* Modal com a pré-visualização do Tanzaku */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#141416]/20 bg-[#EDE0C8] p-6 shadow-2xl sm:p-8"
          >
            {/* Topo do Modal */}
            <div className="flex items-center justify-between border-b border-[#141416]/12 pb-4">
              <div className="flex items-center gap-2.5">
                <HankoMark size="sm" label="蓮" />
                <div>
                  <h3
                    id="tanzaku-title"
                    className="font-serif-editorial text-lg font-medium text-[#000000]"
                  >
                    Marcador de Página Tanzaku
                  </h3>
                  <p className="text-xs text-[#4A463F]">
                    Tradição oriental para imprimir ou usar no celular
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar prévia"
                className="rounded-md p-1.5 text-[#4A463F] transition-colors hover:bg-[#141416]/10 hover:text-[#141416]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Pré-visualização do Marcador */}
            <div className="my-5 flex flex-1 items-center justify-center overflow-y-auto py-2">
              <div
                ref={bookmarkRef}
                className="washi-sheet relative flex w-[230px] flex-col items-center justify-between rounded-md border-2 border-[#C82E36] bg-[#EDE0C8] p-5 text-center shadow-xl sm:w-[260px]"
                style={{ aspectRatio: '1 / 2.7' }}
              >
                {/* Ilhós/Furo do topo */}
                <div className="h-4 w-4 rounded-full border border-[#141416]/30 bg-[#CBB389]" />

                {/* Selo e Título */}
                <div className="mt-4 flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-[#C82E36] font-jp-seal text-xl font-bold text-[#FAF6EB]">
                    蓮
                  </span>
                  <span className="mt-2 font-serif-editorial text-sm font-semibold tracking-widest text-[#141416]">
                    L Ó T U S
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C82E36]">
                    Capítulo {chapter.number}
                  </span>
                </div>

                {/* Frase central */}
                <div className="my-auto px-2">
                  <p className="font-serif-editorial text-sm italic leading-relaxed text-[#000000]">
                    &ldquo;{quoteInfo.quote}&rdquo;
                  </p>
                  <span className="mt-3 inline-block rounded border border-[#C82E36]/30 bg-[#C82E36]/10 px-2 py-0.5 text-[10px] font-medium text-[#C82E36]">
                    {quoteInfo.concept}
                  </span>

                  {personalNote && personalNote.trim().length > 0 && (
                    <div className="mt-3 border-t border-[#141416]/10 pt-2 text-[10px] italic text-[#4A463F]">
                      &ldquo;{personalNote.slice(0, 90)}...&rdquo;
                    </div>
                  )}
                </div>

                {/* Base */}
                <div className="mt-4 border-t border-[#141416]/15 pt-2 text-[11px] text-[#4A463F]">
                  <p className="font-jp-seal text-sm text-[#C82E36]">終わり</p>
                  <p className="mt-0.5 text-[10px]">Davi Xavier, 16 anos</p>
                </div>
              </div>
            </div>

            {/* Ações inferiores */}
            <div className="flex flex-col gap-3 border-t border-[#141416]/12 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#4A463F]">
                Download em alta definição (600 × 1600 px)
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  disabled={downloading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#C82E36] px-4 py-2.5 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] sm:w-auto"
                >
                  {downloaded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Marcador Baixado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>{downloading ? 'Gerando...' : 'Baixar Marcador (PNG)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
