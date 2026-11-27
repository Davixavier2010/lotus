'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, LayoutGroup, useReducedMotion } from 'framer-motion';
import { PHILOSOPHICAL_PILLARS, type ConceptHighlight } from '@/data/lotus-content';
import { ArrowUpRight } from 'lucide-react';

const CHAPTER_FILTERS = [
  { label: 'Todos os 13 pilares', value: 0 },
  { label: 'Capítulo 1', value: 1 },
  { label: 'Capítulo 2', value: 2 },
  { label: 'Capítulo 3', value: 3 },
];

export function PillarsMap() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [activePillar, setActivePillar] = useState<ConceptHighlight>(
    PHILOSOPHICAL_PILLARS[0]
  );

  const visiblePillars =
    selectedChapter === 0
      ? PHILOSOPHICAL_PILLARS
      : PHILOSOPHICAL_PILLARS.filter((p) => p.chapterNumber === selectedChapter);

  return (
    <div className="space-y-8">
      <LayoutGroup>
        <div
          className="flex flex-wrap gap-2 border-b border-[#141416]/12 pb-4"
          role="tablist"
          aria-label="Filtrar pilares por capítulo"
        >
          {CHAPTER_FILTERS.map((filter) => {
            const isSelected = selectedChapter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedChapter(filter.value);
                  const firstMatch =
                    filter.value === 0
                      ? PHILOSOPHICAL_PILLARS[0]
                      : PHILOSOPHICAL_PILLARS.find(
                          (p) => p.chapterNumber === filter.value
                        );
                  if (firstMatch) setActivePillar(firstMatch);
                }}
                className={`relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'text-[#FAF6EB]'
                    : 'text-[#4A463F] hover:text-[#141416]'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="pillarFilterBg"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 32 }
                    }
                    className="absolute inset-0 rounded-md bg-[#141416]"
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-wrap gap-2.5 lg:col-span-7">
          {visiblePillars.map((pillar) => {
            const isActive = activePillar.name === pillar.name;
            return (
              <button
                key={pillar.name}
                type="button"
                onClick={() => setActivePillar(pillar)}
                className={`rounded-md border px-4 py-2.5 text-left transition-all ${
                  isActive
                    ? 'border-[#C82E36] bg-[#C82E36] text-[#FAF6EB]'
                    : 'border-[#141416]/18 bg-[#FAF6EB]/65 text-[#141416] hover:border-[#141416]/45'
                }`}
              >
                <span className="font-serif-editorial block text-base font-medium leading-tight">
                  {pillar.name}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    isActive ? 'text-[#FAF6EB]/85' : 'text-[#4A463F]'
                  }`}
                >
                  Cap. {pillar.chapterNumber}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={activePillar.name}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-6 sm:p-7 lg:col-span-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#C82E36]">
                Capítulo {activePillar.chapterNumber} · {activePillar.subtitle}
              </p>
              <h3 className="mt-1 font-serif-editorial text-2xl font-medium text-[#000000]">
                {activePillar.name}
              </h3>
            </div>
          </div>

          <p className="mt-4 font-serif-editorial text-base leading-relaxed text-[#141416]/90">
            {activePillar.summary}
          </p>

          <div className="mt-6 border-t border-[#141416]/12 pt-4">
            <Link
              href={`/capitulos/${activePillar.chapterSlug}#reflexao`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C82E36] transition-colors hover:text-[#A82229]"
            >
              <span>Ler no Capítulo {activePillar.chapterNumber}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
