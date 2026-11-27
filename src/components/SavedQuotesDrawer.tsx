'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkCheck, Copy, Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export interface SavedHighlight {
  id: string;
  text: string;
  chapterNumber: number;
  chapterTitle: string;
  savedAt: number;
}

interface SavedQuotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  highlights: SavedHighlight[];
  onRemoveHighlight: (id: string) => void;
  onClearAll: () => void;
}

export function SavedQuotesDrawer({
  isOpen,
  onClose,
  highlights,
  onRemoveHighlight,
  onClearAll,
}: SavedQuotesDrawerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(item: SavedHighlight) {
    const textToCopy = `“${item.text}”\n\n— Lótus (Capítulo ${item.chapterNumber}: ${item.chapterTitle})\nDavi Xavier, 16 anos`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop escurecido suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm"
          />

          {/* Gaveta lateral deslizante à direita */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md border-l border-[#141416]/15 bg-[#EDE0C8] shadow-2xl flex flex-col"
            >
              {/* Topo da Gaveta */}
              <div className="flex items-center justify-between border-b border-[#141416]/12 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="h-4 w-4 text-[#C82E36]" aria-hidden="true" />
                  <h3
                    id="drawer-title"
                    className="font-serif-editorial text-lg font-medium text-[#000000]"
                  >
                    Trechos Guardados
                  </h3>
                  <span className="rounded-full bg-[#C82E36]/10 px-2 py-0.5 text-xs font-semibold text-[#C82E36]">
                    {highlights.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar gaveta"
                  className="rounded-md p-1.5 text-[#4A463F] transition-colors hover:bg-[#141416]/10 hover:text-[#141416]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Lista de Trechos */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {highlights.length === 0 ? (
                  <div className="my-auto py-16 text-center">
                    <p className="font-serif-editorial text-base italic text-[#4A463F]">
                      Nenhum trecho guardado ainda.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#4A463F]/80 max-w-xs mx-auto">
                      Selecione qualquer frase do conto ou da reflexão e clique no botão{' '}
                      <strong className="font-medium text-[#C82E36]">Guardar trecho</strong> que aparece sobre ela.
                    </p>
                  </div>
                ) : (
                  highlights.map((item) => (
                    <article
                      key={item.id}
                      className="group relative rounded-xl border border-[#141416]/12 bg-[#FAF6EB] p-4 transition-all hover:border-[#C82E36]/40 shadow-xs"
                    >
                      <div className="flex items-baseline justify-between gap-2 border-b border-[#141416]/8 pb-2 text-[11px] text-[#4A463F]">
                        <span className="font-medium text-[#C82E36]">
                          Capítulo {item.chapterNumber} · {item.chapterTitle}
                        </span>
                        <span>
                          {new Date(item.savedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </span>
                      </div>

                      <blockquote className="mt-3 font-serif-editorial text-sm leading-relaxed text-[#141416] border-l-2 border-[#C82E36] pl-3 py-0.5">
                        &ldquo;{item.text}&rdquo;
                      </blockquote>

                      <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-[#141416]/6">
                        <button
                          type="button"
                          onClick={() => handleCopy(item)}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-[#4A463F] transition-colors hover:bg-[#141416]/8 hover:text-[#141416]"
                          title="Copiar citação com referência"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="h-3 w-3 text-[#C82E36]" />
                              <span className="text-[#C82E36]">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveHighlight(item.id)}
                          aria-label="Remover este trecho"
                          className="rounded p-1 text-[#4A463F]/70 transition-colors hover:text-[#C82E36]"
                          title="Remover trecho"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Rodapé da Gaveta */}
              {highlights.length > 0 && (
                <div className="border-t border-[#141416]/12 bg-[#E2D0B0]/40 p-4 flex items-center justify-between text-xs">
                  <span className="text-[#4A463F]">
                    Salvo silenciosamente no seu navegador
                  </span>
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-[#4A463F] hover:text-[#C82E36] transition-colors underline"
                  >
                    Limpar todos
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
