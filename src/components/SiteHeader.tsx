'use client';

import Link from 'next/link';
import { HankoMark } from './HankoMark';
import { ThemeToggle } from './ThemeToggle';
import { PetalButtonLink } from './PetalButtonLink';
import { BookOpen, User } from 'lucide-react';

interface SiteHeaderProps {
  onOpenAuth?: () => void;
  onOpenOracle?: () => void;
  userEmail?: string | null;
}

export function SiteHeader({ onOpenAuth, onOpenOracle, userEmail }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#141416]/12 bg-[#F4EEDE]/94 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-8 sm:py-4">
        {/* Marca Lótus à esquerda */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 text-[#000000] transition-opacity hover:opacity-85 sm:gap-3"
        >
          <HankoMark size="sm" label="蓮" />
          <span className="font-serif-editorial text-lg font-medium tracking-tight sm:text-xl">
            Lótus
          </span>
        </Link>

        {/* Links de seções com espaçamento equilibrado para desktop */}
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
          <a href="#bussola" className="transition-colors hover:text-[#C82E36]">
            Bússola
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

        {/* Ações da direita compactas no celular */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {onOpenOracle && (
            <button
              type="button"
              onClick={onOpenOracle}
              className="inline-flex items-center rounded-md border border-[#141416]/20 bg-transparent px-2 py-1 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36] sm:px-3 sm:py-1.5"
              title="Tirar uma reflexão ou consultar as filosofias orientais do livro"
            >
              <span>Reflexão</span>
            </button>
          )}

          <ThemeToggle />

          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              aria-label="Área do leitor"
              className="inline-flex items-center gap-1 rounded-md border border-[#141416]/20 px-2 py-1 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36] sm:px-2.5 sm:py-1.5"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {userEmail ? 'Leitor' : 'Conta'}
              </span>
            </button>
          )}

          {/* Botão de Ler Capítulo 1 adaptado no mobile */}
          <PetalButtonLink
            href="/capitulos/capitulo-1"
            className="inline-flex items-center gap-1 rounded-md bg-[#C82E36] px-2.5 py-1.5 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline whitespace-nowrap">Capítulo 1</span>
            <span className="xs:hidden sm:hidden whitespace-nowrap">Cap. 1</span>
          </PetalButtonLink>
        </div>
      </div>
    </header>
  );
}
