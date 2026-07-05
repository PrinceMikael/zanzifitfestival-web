import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { FaqAccordion } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Travel, visas, accommodation and spectator information for ZanziFit Festival, 6 November 2026, Fumba Town, Zanzibar.',
}

const FAQS = [
  {
    question: 'How do I get to Zanzibar?',
    answer:
      'Zanzibar is served by Abeid Amani Karume International Airport (ZNZ), with regular connections via mainland Tanzania and regional hubs. Fumba Town, the festival venue, is roughly 30–45 minutes from the airport by road — exact transfer options will be published closer to race day.',
  },
  {
    question: 'Do I need a visa to travel to Tanzania?',
    answer:
      'Visa requirements depend on your nationality. Most visitors can obtain a visa on arrival or apply online in advance; check Tanzania\'s official immigration guidance for your specific country before booking travel. This section will be updated with festival-specific guidance once confirmed.',
  },
  {
    question: 'Where should I stay?',
    answer:
      'Fumba Town and the wider Zanzibar coast offer accommodation from beach resorts to guesthouses. Recommended accommodation partners and athlete rate codes will be announced ahead of the registration window.',
  },
  {
    question: 'What should I bring?',
    answer:
      'Race-day kit for your discipline (bike and gear for cycling, training kit for HYROX-style events), sun protection, reef-safe sunscreen, and light clothing for the coastal climate. A detailed athlete kit list will be shared with confirmed entrants.',
  },
  {
    question: 'Can I come just to watch?',
    answer:
      'Yes — ZanziFit welcomes spectators. Course-side viewing areas, the festival village, and the finish-line zone are open to the public across the race weekend. Spectator schedules will be published alongside the full race-day program.',
  },
]

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title={<>Everything before the start line.</>}
        intro="Travel, visas, accommodation and what to expect as a spectator — the practical details for race weekend."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <FaqAccordion items={FAQS} />
      </section>
    </main>
  )
}
