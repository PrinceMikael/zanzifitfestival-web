import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4, Syne } from 'next/font/google'
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

const clashDisplay = localFont({
  src: '../public/fonts/clash-display/ClashDisplay-Bold.otf',
  variable: '--font-clash-display',
  weight: '700',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ZanziFit Festival, Zanzibar, 6-8 November 2026',
    template: '%s · ZanziFit Festival',
  },
  description:
    'A hybrid road-cycling and HYROX-style functional fitness festival on the coast of Zanzibar, Tanzania. Race weekend 6-8 November 2026, race day 7 November.',
  keywords: [
    'ZanziFit',
    'Zanzibar fitness festival',
    'HYROX Africa',
    'road cycling Zanzibar',
    'endurance festival Tanzania',
  ],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  generator: 'v0.app',
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
      className={`${fraunces.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} ${sourceSerif.variable} ${syne.variable} ${clashDisplay.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
