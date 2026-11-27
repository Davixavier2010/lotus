const FALLBACK_LOCAL_URL = 'http://localhost:3000';

/**
 * Resolves the canonical base URL for metadata, sitemap, and robots.
 * Uses NEXT_PUBLIC_SITE_URL when set, otherwise falls back to Vercel's
 * automatic production/deployment URLs or localhost in development.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    FALLBACK_LOCAL_URL;

  const trimmed = raw.trim().replace(/\/+$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
