'use client';

import Link from 'next/link';
import { HankoMark } from './HankoMark';
import { ThemeToggle } from './ThemeToggle';
import { PetalButtonLink } from './PetalButtonLink';
import { BookOpen, Sparkles, User } from 'lucide-react';

interface SiteHeaderProps {
  onOpenAuth?: () => void;
  onOpenOracle?: () => void;
  userEmail?: string | null;
}

export function SiteHeader({ onOpenAuth, onOpenOracle, userEmail }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#141416]/12 bg-[#F4EEDE]/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Marca Lótus à esquerda com respiração generosa */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 pr-4 text-[#000000] transition-opacity hover:opacity-85 sm:pr-8"
        >
          <HankoMark size="sm" label="蓮" />
          <span className="font-serif-editorial text-xl font-medium tracking-tight">
            Lótus
          </span>
        </Link>

        {/* Links de seções com espaçamento equilibrado */}
        <nav
          aria-label="Navegação principal"
          className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium text-[#141416]/80 lg:flex lg:gap-8"
        >
          <a href="#prefacio" className="transition-colors hover:text-[#C82E36]">
            Prefácio
          </a>
          <a href="#como-funciona" className="transition-colors hover:text-[#C82E36]">
            Dinâmica
          </a>
          <a href="#sumario" className="transition-colors hover:text-[#C82E36]">
            Sumário
          </a>
          <a href="#pilares" className="transition-colors hover:text-[#C82E36]">
            Pilares
          </a>
          <a href="#autor" className="transition-colors hover:text-[#C82E36]">
            Autor
          </a>
          <a href="#acompanhamento" className="transition-colors hover:text-[#C82E36]">
            Acompanhamento
          </a>
        </nav>

        {/* Ações da direita: Reflexão do Momento, Tema, Leitor e Botão Ler Capítulo 1 alinhado à borda */}
        <div className="flex shrink-0 items-center gap-2 pl-4 sm:gap-2.5 sm:pl-6">
          {onOpenOracle && (
            <button
              type="button"
              onClick={onOpenOracle}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#C82E36]/35 bg-[#C82E36]/8 px-2.5 py-1.5 text-xs font-medium text-[#C82E36] transition-colors hover:bg-[#C82E36] hover:text-[#FAF6EB]"
              title="Tirar uma reflexão ou consultar as filosofias orientais do livro"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Reflexão do Momento</span>
              <span className="md:hidden">Reflexão</span>
            </button>
          )}

          <ThemeToggle />

          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#141416]/20 px-2.5 py-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {userEmail ? 'Leitor' : 'Área do Leitor'}
              </span>
            </button>
          )}

          {/* Botão de Ler Capítulo 1 deslocado no limite da borda direita */}
          <PetalButtonLink
            href="/capitulos/capitulo-1"
            className="inline-flex items-center gap-2 rounded-md bg-[#C82E36] px-3.5 py-2 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] sm:text-sm"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="whitespace-nowrap">Ler Capítulo 1</span>
          </PetalButtonLink>
        </div>
      </div>
    </header>
  );
}
