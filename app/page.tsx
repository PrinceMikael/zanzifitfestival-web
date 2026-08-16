import type { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { Disciplines } from '@/components/disciplines'
import { PartnerStrip } from '@/components/partner-strip'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

// Event schema: makes the festival eligible for Google's event rich
// results (date, location, ticket link) in search. Dates/location here
// must stay in sync with the ones quoted in copy across the site (hero,
// footer, festival page) if those ever change.
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: 'ZanziFit Festival',
  description:
    'A hybrid road-cycling and HYROX-style functional fitness festival on the coast of Zanzibar, Tanzania.',
  startDate: '2026-11-06',
  endDate: '2026-11-08',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Zanzibar, Tanzania',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zanzibar',
      addressCountry: 'TZ',
    },
  },
  image: ['https://zanzifitfestival.com/images/zanzibar-hero.jpg'],
  organizer: {
    '@type': 'Organization',
    name: 'ZanziFit Festival',
    url: 'https://zanzifitfestival.com',
  },
  url: 'https://zanzifitfestival.com',
}

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Hero />
      <Disciplines />
      <PartnerStrip />
      <CtaBand />
    </main>
  )
}
