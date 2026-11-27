import type { Metadata } from 'next';
import { Spectral, Hanken_Grotesk, Noto_Serif_JP } from 'next/font/google';
import { getSiteUrl } from '@/lib/site-url';
import { FullBookAudioProvider } from '@/components/FullBookAudioContext';
import './globals.css';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jp',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lótus — Contos Orientais e Reflexões Intrapessoais',
  description:
    'Nem todos os grandes confrontos acontecem nos campos de batalha, mas sim dentro das nossas mentes. Leia os contos épicos orientais e as reflexões filosóficas de Lótus.',
  keywords: [
    'Lótus',
    'contos orientais',
    'filosofia oriental',
    'reflexões intrapessoais',
    'zen',
    'bushido',
    'autoconhecimento',
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Lótus',
    title: 'Lótus — Contos Orientais e Reflexões Intrapessoais',
    description:
      'Nem todos os grandes confrontos acontecem nos campos de batalha, mas sim dentro das nossas mentes. Leia os contos épicos orientais e as reflexões filosóficas de Lótus.',
    images: [
      {
        url: '/ilustracoes/lotus-capa.jpg',
        alt: 'Capa da obra Lótus — Contos Orientais e Reflexões Intrapessoais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lótus — Contos Orientais e Reflexões Intrapessoais',
    description:
      'Contos épicos orientais e reflexões filosóficas sobre a mente humana.',
    images: ['/ilustracoes/lotus-capa.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'Vn3YNF9iwKa2dE2OuW0eOoTePijKASZAcVx6U6y9mx8',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spectral.variable} ${hankenGrotesk.variable} ${notoSerifJp.variable}`}
    >
      <body className="min-h-screen bg-[var(--washi-bg)] text-[#141416] antialiased">
        <FullBookAudioProvider>{children}</FullBookAudioProvider>
      </body>
    </html>
  );
}
