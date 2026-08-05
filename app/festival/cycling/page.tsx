import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { AccordionItem } from '@/components/accordion-item'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Road Cycling',
  description:
    'Closed-road coastal racing at ZanziFit Festival: Elite, Open and Community categories along the Zanzibar coastline, 6-8 November 2026.',
}

const CATEGORIES = [
  { name: 'Elite Road Race', detail: '120 km · closed circuit · UCI-style timing' },
  { name: 'Open 60 km', detail: 'Competitive amateurs · chip-timed' },
  { name: 'Community 20 km', detail: 'All abilities · non-competitive' },
]

const COURSE_POINTS = [
  {
    title: 'Fully closed roads',
    body: 'The full route runs on coastal roads closed to traffic for the race window, marshalled at every junction so the peloton never has to negotiate with local traffic.',
  },
  {
    title: 'Coastal terrain, rolling elevation',
    body: 'Flat-to-rolling coastal tarmac with a handful of short rises near the fishing villages. Built for a fast, tactical race rather than a mountain-stage grind.',
  },
  {
    title: 'One loop, three distances',
    body: 'Elite, Open and Community all share the same start/finish and core loop, run at different lap counts, so every category finishes on the same stretch of sand.',
  },
]

const RACE_DAY = [
  'Dawn rolling start to beat the midday heat, with the Elite race first off the line.',
  'Neutral service and mechanical support positioned along the course, not just at the finish.',
  'Chip timing at the start, finish and intermediate splits for Elite and Open categories.',
  'Hydration and feed stations spaced across the longer distances; Community 20 km riders finish before the first stations are needed.',
]

const FAQS = [
  {
    question: 'Can I bring my own bike, or is one provided?',
    answer:
      'Road cycling categories are bring-your-own-bike. Bike transport and rental partner details for travelling athletes will be published ahead of the registration window.',
  },
  {
    question: 'Is the course draft-legal?',
    answer:
      'The Elite Road Race follows UCI-style draft-legal rules with neutral or lead vehicles as needed. Open and Community categories are non-competitive on drafting and are timed for personal results rather than head-to-head placing.',
  },
  {
    question: 'What bike and kit do I need?',
    answer:
      'A road bike in good mechanical order, a helmet (mandatory for all categories), and weather-appropriate kit for a coastal morning. A full pre-race kit checklist will be sent to confirmed entrants.',
  },
  {
    question: 'Can I do both Road Cycling and HYROX-Style?',
    answer:
      'Yes. The two disciplines run on different parts of the schedule specifically so athletes can race both across the weekend. See the full race-day schedule for how the timings connect.',
  },
]

export default function CyclingPage() {
  return (
    <main>
      <PageHero
        title={<>Closed roads. Open coastline.</>}
        intro="Road cycling at ZanziFit runs on fully closed coastal roads, from a fast community sprint to a UCI-style elite endurance race, all sharing the same start and finish."
        image={{ src: '/images/cycling.jpg', alt: 'The peloton racing along the coastal road' }}
        voice="athletic"
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-sm bg-amber px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Join the Waitlist <Chevrons />
          </Link>
          <Link
            href="/festival/hyrox"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
          >
            See HYROX-Style
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading title="Three distances, one coastline." voice="athletic" />
        <RevealGroup className="mt-14 divide-y divide-border border-t border-border">
          {CATEGORIES.map((c) => (
            <RevealItem key={c.name} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-display-athletic text-xl font-semibold text-surface-dark-foreground">{c.name}</span>
              <span className="font-body-athletic text-muted-foreground">{c.detail}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-y border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Reveal className="relative aspect-4/3 overflow-hidden rounded-lg border border-border md:order-2">
              <Image
                src="/images/zanzibar-coast.png"
                alt="The Zanzibar coastal road the race route follows"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Reveal>
            <div>
              <SectionHeading title="The course." align="left" voice="athletic" />
              <RevealGroup className="mt-8 space-y-6">
                {COURSE_POINTS.map((p) => (
                  <RevealItem key={p.title}>
                    <h3 className="font-display-athletic text-lg font-semibold text-surface-dark-foreground">{p.title}</h3>
                    <p className="font-body-athletic mt-2 leading-relaxed text-muted-foreground">{p.body}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading title="On race day." intro="What to expect from the start line to the finish." voice="athletic" />
        <RevealGroup as="ul" className="mt-10 grid gap-3 sm:grid-cols-2">
          {RACE_DAY.map((item) => (
            <RevealItem
              key={item}
              as="li"
              className="font-body-athletic flex items-start gap-3 rounded-sm border border-border bg-surface-dark-soft px-4 py-4 text-sm leading-relaxed text-surface-dark-foreground"
            >
              <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
              {item}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="border-t border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading title="Road cycling questions." voice="athletic" />
          <div className="mt-10">
            {FAQS.map((f) => (
              <AccordionItem key={f.question} question={f.question} answer={f.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28 text-center">
        <SectionHeading
          title="Ready to line up?"
          align="center"
          intro="Join the waitlist to be first in line when registration opens."
          voice="athletic"
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-sm bg-amber px-7 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Join the Waitlist <Chevrons />
          </Link>
          <Link
            href="/festival"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-7 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
          >
            Back to The Festival
          </Link>
        </div>
      </section>
    </main>
  )
}
