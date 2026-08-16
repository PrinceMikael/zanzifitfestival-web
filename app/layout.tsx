import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans, Plus_Jakarta_Sans, Source_Serif_4, Syne } from 'next/font/google'
import localFont from 'next/font/local'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  // Every .font-display usage sitewide pairs Fraunces with weight 600
  // only (confirmed by audit) — the 400/700/900 weights this used to
  // load were never actually used, so they were trimmed.
  weight: ['600'],
  style: ['normal'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600'],
})

// Nav bar only: links at weight 500, the CTA button at weight 600 —
// per exact spec (Plus Jakarta Sans, 14px / 0.875rem).
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['500', '600'],
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  // Still backs .font-display-athletic (competition-page headings,
  // several set at font-semibold) — kept loaded even though the hero
  // title itself has moved to Clash Display Bold below.
  weight: ['600', '700', '800'],
})

// Three weights of one local family, sharing one CSS variable — Next.js
// picks the matching file per requested font-weight automatically.
//   700 (Bold)    -> hero title ("ZanziFit Festival")
//   500 (Medium)  -> hero subhead paragraph
//   400 (Regular) -> hero eyebrow line + nav brand wordmark
const clashDisplay = localFont({
  src: [
    { path: '../public/fonts/clash-display/ClashDisplay-Regular.otf', weight: '400' },
    { path: '../public/fonts/clash-display/ClashDisplay-Medium.otf', weight: '500' },
    { path: '../public/fonts/clash-display/ClashDisplay-Bold.otf', weight: '700' },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})

const SITE_URL = 'https://zanzifitfestival.com'
const SITE_NAME = 'ZanziFit Festival'
const DEFAULT_DESCRIPTION =
  'A hybrid road-cycling and HYROX-style functional fitness festival on the coast of Zanzibar, Tanzania. Race weekend 6-8 November 2026, race day 7 November.'
// Branded 1200x630 share card generated at build time by
// app/opengraph-image.tsx — see lib/seo.ts for the per-page equivalent.
const DEFAULT_OG_IMAGE = '/opengraph-image'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ZanziFit Festival, Zanzibar, 6-8 November 2026',
    template: '%s · ZanziFit Festival',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'ZanziFit',
    'Zanzibar fitness festival',
    'HYROX Africa',
    'road cycling Zanzibar',
    'endurance festival Tanzania',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'ZanziFit Festival, Zanzibar, 6-8 November 2026',
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'ZanziFit Festival, road cycling and HYROX-style racing on the Zanzibar coast',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZanziFit Festival, Zanzibar, 6-8 November 2026',
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  generator: 'v0.app',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/zfit-logo.svg`,
  // Footer social links (site-footer.tsx) are still placeholder "#" hrefs.
  // Add the live Instagram/Facebook/YouTube URLs here once those exist —
  // fake URLs would be worse for schema validity than omitting them.
  sameAs: [] as string[],
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} ${plusJakartaSans.variable} ${sourceSerif.variable} ${syne.variable} ${clashDisplay.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
