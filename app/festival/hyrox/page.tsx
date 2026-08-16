import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { AccordionItem } from '@/components/accordion-item'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/festival/hyrox',
  title: 'HYROX-Style',
  description:
    'Eight functional stations against the clock at ZanziFit Festival: Elite, Open and Corporate Teams categories on the Zanzibar coast, 6-8 November 2026.',
  image: '/images/discipline-hyrox.jpg',
})

const CATEGORIES = [
  { name: 'Elite', detail: 'Individual · full competition weight' },
  { name: 'Open', detail: 'Individual · scaled weights available' },
  { name: 'Corporate Teams', detail: 'Relay of 4 · perfect for sponsors' },
]

const STATIONS = [
  { name: 'SkiErg', detail: '1000 m' },
  { name: 'Sled Push', detail: '50 m · loaded sled' },
  { name: 'Sled Pull', detail: '50 m · loaded sled' },
  { name: 'Burpee Broad Jumps', detail: '80 m' },
  { name: 'Rowing', detail: '1000 m' },
  { name: 'Farmers Carry', detail: '200 m' },
  { name: 'Sandbag Lunges', detail: '100 m' },
  { name: 'Wall Balls', detail: 'Reps to finish' },
]

const RACE_DAY = [
  'A 1 km run separates every station, so the format alternates between engine work and load carries all the way to the wall-ball finish.',
  'Waves run throughout race day, with Elite heats first and Open/Corporate Teams following in scheduled blocks.',
  'Weight and rep standards are fixed for Elite and scaled for Open, so first-timers and competitive athletes race the same course fairly.',
  'Corporate Teams race as a relay of four, splitting stations and runs between teammates, built for sponsor and community entries.',
]

const FAQS = [
  {
    question: 'Do I need experience with functional fitness racing to enter?',
    answer:
      'No. The Open category uses scaled weights and is built for first-timers as well as competitive age-groupers. Elite is for athletes who want to race the full competition-weight course.',
  },
  {
    question: 'What is a Corporate Team entry?',
    answer:
      'A relay of four athletes who split the eight stations and connecting runs between them. It is the most popular way for partner and sponsor teams to take part without every member needing to race the full individual course.',
  },
  {
    question: 'What should I train for beforehand?',
    answer:
      'A mix of running and functional strength: the eight stations cover pushing, pulling, carrying and full-body conditioning, each separated by a 1 km run. A discipline-specific prep guide will be shared with confirmed entrants.',
  },
  {
    question: 'Can I do both HYROX-Style and Road Cycling?',
    answer:
      'Yes. The two disciplines run on different parts of the schedule specifically so athletes can race both across the weekend. See the full race-day schedule for how the timings connect.',
  },
]

export default function HyroxPage() {
  return (
    <main>
      <PageHero
        title={<>Eight stations. One clock.</>}
        intro="HYROX-style racing at ZanziFit pairs functional strength stations with connecting runs, from a scaled Open field to full competition-weight Elite heats."
        image={{ src: '/images/hyrox-arena.jpg', alt: 'A HYROX-style athlete competing in front of a crowd' }}
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
            href="/festival/cycling"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
          >
            See Road Cycling
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading title="Three ways to race it." voice="athletic" />
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
          <SectionHeading title="The eight stations." intro="Each station is separated by a 1 km run, run in this order." voice="athletic" />
          <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STATIONS.map((s, i) => (
              <RevealItem
                key={s.name}
                className="rounded-sm border border-border bg-surface-dark px-5 py-4"
              >
                <span className="font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display-athletic mt-2 text-lg font-semibold text-surface-dark-foreground">{s.name}</h3>
                <p className="font-body-athletic mt-1 text-sm text-muted-foreground">{s.detail}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading title="On race day." align="left" voice="athletic" />
            <RevealGroup as="ul" className="mt-8 space-y-3">
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
          </div>
          <Reveal className="relative aspect-4/3 overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/hyrox-arena.jpg"
              alt="A HYROX-style athlete mid-station in front of a packed crowd"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading title="HYROX-Style questions." voice="athletic" />
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
