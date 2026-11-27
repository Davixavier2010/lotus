import type { MetadataRoute } from 'next';
import { CHAPTERS } from '@/data/lotus-content';
import { getSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const chapterEntries: MetadataRoute.Sitemap = CHAPTERS.map((chapter) => ({
    url: `${siteUrl}/capitulos/${chapter.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...chapterEntries,
  ];
}
