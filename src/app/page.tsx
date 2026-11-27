import { HomeClient } from '@/components/HomeClient';
import { JsonLd } from '@/components/JsonLd';
import { CHAPTERS } from '@/data/lotus-content';
import { getSiteUrl } from '@/lib/site-url';

export default function HomePage() {
  const siteUrl = getSiteUrl();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'Lótus — Contos Orientais e Reflexões Intrapessoais',
    description:
      'Nem todos os grandes confrontos acontecem nos campos de batalha, mas sim dentro das nossas mentes. Contos épicos orientais e reflexões filosóficas.',
    inLanguage: 'pt-BR',
    url: siteUrl,
    image: `${siteUrl}/ilustracoes/lotus-capa.jpg`,
    genre: ['Filosofia Oriental', 'Contos', 'Autoconhecimento'],
    hasPart: CHAPTERS.map((chapter) => ({
      '@type': 'Chapter',
      position: chapter.number,
      name: `Capítulo ${chapter.number}: ${chapter.title}`,
      url: `${siteUrl}/capitulos/${chapter.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <HomeClient />
    </>
  );
}
