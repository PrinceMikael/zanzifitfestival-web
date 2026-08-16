import type { Metadata } from 'next'

const SITE_URL = 'https://zanzifitfestival.com'
const SITE_NAME = 'ZanziFit Festival'
// Branded 1200x630 share card generated at build time by
// app/opengraph-image.tsx (void-black ground, wordmark, dates — the
// "Timing Board" system). Used as the default share image for every page
// that doesn't pass its own `image`; only discipline pages currently do.
const DEFAULT_OG_IMAGE = '/opengraph-image'

/**
 * Builds canonical + Open Graph + Twitter metadata for a route from the
 * same title/description every page already defines, so each page/*.tsx
 * only needs one extra `path` field rather than repeating the full OG
 * block. Root defaults (title template, metadataBase) live in
 * app/layout.tsx — this only fills in what's page-specific.
 */
export function pageMetadata({
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
}: {
  path: string
  title: string
  description: string
  image?: string
}): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: image }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}
