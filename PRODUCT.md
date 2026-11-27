# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + Supabase (`@supabase/supabase-js`, `@supabase/ssr`).

## Users

Leitores interessados em literatura contemplativa, contos tradicionais orientais (japoneses e chineses), filosofia prática e autoconhecimento intrapessoal — acessando tanto em desktop quanto em dispositivos móveis para leitura longa e reflexão.

## Product Purpose

Site editorial e vitrine interativa de leitura do livro *Lótus*, apresentando a obra, seu prefácio, os três primeiros capítulos completos (cada um dividido em *O Conto* e *Reflexão de Lótus*), o mapa dos pilares filosóficos e uma lista de acompanhamento para avisos de novos capítulos e lançamento do livro completo.

## Positioning

Diferente de blogs genéricos ou catálogos de e-books, o site impõe a dinâmica ritualística de leitura do *Lótus*: primeiro a imersão narrativa ininterrupta no conto até o selo japonês de encerramento (`終わり`), para só então desbloquear e explorar a *Reflexão de Lótus* que traduz cada conceito oriental para os desafios cotidianos e intrapessoais.

## Operating Context

Leitura calma e focada em tela (desktop e mobile), com navegação fluida entre a página inicial (vitrine editorial, sumário interativo e pilares filosóficos) e as páginas de leitura de cada capítulo. Integração com Supabase estruturada via migrations SQL, RLS e `@supabase/ssr` (pronta para conexão via variáveis de ambiente).

## Capabilities and Constraints

- Exibição completa dos textos originais transcritos: Prefácio, Sumário e Capítulos 1, 2 e 3 (*O Conto* + *Reflexão de Lótus*).
- Separação clara e ritualística entre o Bloco 1 (*O Conto*, encerrado por `終わり`) e o Bloco 2 (*Reflexão de Lótus*).
- Formulário de Lista de Acompanhamento (e-mail ou WhatsApp) + área opcional de leitor autenticado (progresso de leitura e anotações pessoais) via Supabase com RLS.
- Sem credenciais Supabase ativas no momento: schema SQL, políticas RLS, clients SSR/browser e `.env.example` prontos para plugar URL e Publishable Key.

## Brand Commitments

- **Nome da Obra:** Lótus
- **Estilo:** Minimalismo editorial oriental, calma, respiro visual e conforto para leitura longa.
- **Paleta Pinned:** Fundo principal papel natural / creme quente (`#F4EEDE`), tipografia principal e contrastes profundos (`#141416` e `#000000`), cor de destaque vermelho fechado (`#C82E36`).
- **Tipografia:** Fonte serifada elegante para títulos e leitura dos contos + fonte sem serifa limpa para navegação, metadados e botões.
- **Símbolo de Encerramento:** `終わり` ao final do Prefácio e de cada Conto/Reflexão conforme manuscrito.

## Evidence on Hand

- Conteúdo integral fornecido em PDF (`Lótus — Estrutura do Site e Conteúdo Completo`): Prefácio, Sumário (Capítulos 1 a 3), textos completos dos Capítulos 1 (*O Mestre de Chá e o Samurai*), 2 (*A Balsa de Tsukahara Bokuden*) e 3 (*A Alegria dos Peixes, Yin Yang*), além dos 13 pilares filosóficos.
- Capítulo 3 indicado no sumário original como "Páginas: 21 a (em aberto)".

## Product Principles

1. **Imersão antes da análise:** O conto vem sempre inteiro e sem interrupções antes da reflexão filosófica.
2. **Respiro e conforto de leitura:** Espaços em branco generosos, medida tipográfica confortável e ritmo editorial calmo.
3. **Fidelidade ao texto original:** Preservar integralmente a voz, os diálogos, os termos orientais e os marcadores `終わり`.
4. **Segurança por padrão:** Nenhuma chave secreta exposta no cliente; RLS ativo em todas as tabelas expostas do Supabase.
