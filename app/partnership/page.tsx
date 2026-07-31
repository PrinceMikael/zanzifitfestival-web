import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { PartnershipInquiry } from '@/components/partnership-inquiry'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Partnership',
  description:
    'Partner with ZanziFit Festival. Presenting, airline, water, tourism and media partnership tiers at a premium destination endurance event.',
}

const TIERS = [
  {
    name: 'Presenting Partner',
    price: 'Title tier',
    highlight: true,
    perks: ['Naming rights: “ZanziFit presented by…”', 'Logo on start/finish arch & all timing', 'On-stage podium presence', 'Category naming rights', '20 corporate team entries', 'Year-round brand association'],
  },
  {
    name: 'Airline Partner',
    price: 'Category exclusive',
    perks: ['Official travel partner status', 'Athlete flight offers & codes', 'Expo village pavilion', 'Boarding-pass activation', '8 corporate team entries'],
  },
  {
    name: 'Water Partner',
    price: 'Category exclusive',
    perks: ['Branding on every hydration station', 'Product sampling rights', 'Course & recovery-zone presence', 'Sustainability storytelling', '6 corporate team entries'],
  },
  {
    name: 'Tourism Partner',
    price: 'Category exclusive',
    perks: ['Destination & hospitality partner', 'Athlete stay & experience packages', 'Content & film collaboration', 'Expo village presence', '6 corporate team entries'],
  },
  {
    name: 'Media Partner',
    price: 'Category exclusive',
    perks: ['Broadcast & streaming rights billing', 'Content distribution collaboration', 'Interview & press access', 'Co-branded highlight reels'],
  },
]

export default function PartnershipPage() {
  return (
    <main>
      <PageHero
        title={<>Put your brand on the horizon.</>}
        intro="ZanziFit gives partners category exclusivity at a premium destination event, reaching an engaged, affluent, health-focused audience."
        image={{ src: '/images/hyrox-arena.jpg', alt: 'A HYROX-style athlete competing in front of branded sponsor boards and a packed crowd' }}
      >
        <Link href="#inquiry" className="inline-flex items-center gap-2 rounded-sm bg-amber px-7 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5">
          Request the deck <Chevrons />
        </Link>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 lg:px-36 py-20 md:py-28">
        <SectionHeading title="Category-exclusive slots, filling now." />
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((t) => (
            <RevealItem
              key={t.name}
              className={`flex flex-col rounded-lg border p-8 ${
                t.highlight ? 'border-amber bg-surface-dark-soft ring-1 ring-amber/40' : 'border-border bg-surface-dark-soft'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">{t.price}</span>
                {t.highlight ? <span className="rounded-sm bg-amber px-2.5 py-1 font-utility text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground">Flagship</span> : null}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-surface-dark-foreground">{t.name}</h3>
              <ul className="mt-6 flex-1 space-y-3">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href={`?tier=${encodeURIComponent(t.name)}#inquiry`}
                scroll={true}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm border border-border py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
              >
                Enquire
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section id="inquiry" className="scroll-mt-24 border-t border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-start lg:px-36">
          <div>
            <SectionHeading title="Let’s build a partnership." align="left" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Tell us about your brand and the tier you’re interested in. We’ll send the full partnership deck with
                audience data, activation ideas and pricing.
              </p>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-3"><Chevrons className="text-amber" count={1} /> partners@zanzifit.com</p>
                <p className="flex items-center gap-3"><Chevrons className="text-amber" count={1} /> Zanzibar, Tanzania</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Suspense fallback={null}>
              <PartnershipInquiry tiers={TIERS.map((t) => t.name)} />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
