import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CHAPTERS } from '@/data/lotus-content';
import { ChapterReader } from '@/components/ChapterReader';

export function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({
    slug: chapter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = CHAPTERS.find((c) => c.slug === slug);
  if (!chapter) {
    return { title: 'Capítulo não encontrado — Lótus' };
  }
  const title = `Capítulo ${chapter.number}: ${chapter.title} — Lótus`;
  const canonicalPath = `/capitulos/${chapter.slug}`;

  return {
    title,
    description: chapter.originNote,
    keywords: ['Lótus', chapter.title, ...chapter.concepts],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: canonicalPath,
      siteName: 'Lótus',
      title,
      description: chapter.originNote,
      images: [
        {
          url: chapter.openingIllustration.src,
          alt: chapter.openingIllustration.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: chapter.originNote,
      images: [chapter.openingIllustration.src],
    },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = CHAPTERS.findIndex((c) => c.slug === slug);

  if (index === -1) {
    notFound();
  }

  const chapter = CHAPTERS[index];
  const prevChapter = index > 0 ? CHAPTERS[index - 1] : null;
  const nextChapter = index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null;

  return (
    <ChapterReader
      chapter={chapter}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
