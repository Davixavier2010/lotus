'use client';

import Link from 'next/link';
import { HankoMark } from './HankoMark';
import { ThemeToggle } from './ThemeToggle';
import { PetalButtonLink } from './PetalButtonLink';
import { BookOpen, User } from 'lucide-react';

interface SiteHeaderProps {
  onOpenAuth?: () => void;
  userEmail?: string | null;
}

export function SiteHeader({ onOpenAuth, userEmail }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#141416]/12 bg-[#F4EEDE]/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-[#000000] transition-opacity hover:opacity-80"
        >
          <HankoMark size="sm" label="蓮" />
          <span className="font-serif-editorial text-xl font-medium tracking-tight">
            Lótus
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-7 text-sm font-medium text-[#141416]/80 md:flex"
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

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-md border border-[#141416]/20 px-3 py-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {userEmail ? 'Leitor conectado' : 'Área do Leitor'}
              </span>
              <span className="sm:hidden">{userEmail ? 'Conta' : 'Entrar'}</span>
            </button>
          )}
          <PetalButtonLink
            href="/capitulos/capitulo-1"
            className="inline-flex items-center gap-2 rounded-md bg-[#C82E36] px-3.5 py-2 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] sm:text-sm"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ler Capítulo 1</span>
          </PetalButtonLink>
        </div>
      </div>
    </header>
  );
}
