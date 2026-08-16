import { PageHero } from '@/components/page-hero'
import { FaqAccordion } from '@/components/faq-accordion'
import { EnquiryLink } from '@/components/enquiry-link'
import { Reveal } from '@/components/reveal'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/faq',
  title: 'FAQ',
  description: 'Travel, visas, accommodation and spectator information for ZanziFit Festival, 6-8 November 2026, Zanzibar.',
})

const FAQ_GROUPS = [
  {
    category: 'Travel & Visas',
    items: [
      {
        question: 'How do I get to Zanzibar?',
        answer:
          'Zanzibar is served by Abeid Amani Karume International Airport (ZNZ), with regular connections via mainland Tanzania and regional hubs. The festival venue is roughly 30–45 minutes from the airport by road. Exact transfer options will be published closer to race day.',
      },
      {
        question: 'Do I need a visa to travel to Tanzania?',
        answer:
          'Visa requirements depend on your nationality. Most visitors can obtain a visa on arrival or apply online in advance; check Tanzania\'s official immigration guidance for your specific country before booking travel. This section will be updated with festival-specific guidance once confirmed.',
      },
    ],
  },
  {
    category: 'Accommodation',
    items: [
      {
        question: 'Where should I stay?',
        answer:
          'Zanzibar\'s coast offers accommodation from beach resorts to guesthouses. Recommended accommodation partners and athlete rate codes will be announced ahead of the registration window.',
      },
    ],
  },
  {
    category: 'Race Day',
    items: [
      {
        question: 'What should I bring?',
        answer:
          'Race-day kit for your discipline (bike and gear for cycling, training kit for HYROX-style events), sun protection, reef-safe sunscreen, and light clothing for the coastal climate. A detailed athlete kit list will be shared with confirmed entrants.',
      },
      {
        question: 'Can I come just to watch?',
        answer:
          'Yes, ZanziFit welcomes spectators. Course-side viewing areas, the festival village, and the finish-line zone are open to the public across the race weekend. Spectator schedules will be published alongside the full race-day program.',
      },
    ],
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  ),
}

export default function FaqPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        title={<>Everything before the start line.</>}
        intro="Travel, visas, accommodation and what to expect as a spectator: the practical details for race weekend."
      />
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <FaqAccordion groups={FAQ_GROUPS} />
        <Reveal delay={0.15} className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 text-center">
          <p className="text-muted-foreground">Still have questions?</p>
          <EnquiryLink label="a question that's not covered here" context="experience" className="mt-3 justify-center" />
        </Reveal>
      </section>
    </main>
  )
}
