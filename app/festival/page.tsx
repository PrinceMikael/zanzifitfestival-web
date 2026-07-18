import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'

export const metadata: Metadata = {
  title: 'The Festival',
  description:
    'Two disciplines, one weekend on the Zanzibar coast. Explore the road-cycling and HYROX-style courses, the race-day schedule and what is included.',
}

const DISCIPLINES = [
  {
    tag: 'Discipline 01',
    name: 'Road Cycling',
    image: '/images/cycling.png',
    blurb:
      'Closed-road coastal racing along the Fumba peninsula, from a fast community sprint to a punishing elite endurance loop.',
    categories: [
      { name: 'Elite Road Race', detail: '120 km · closed circuit · UCI-style timing' },
      { name: 'Open 60 km', detail: 'Competitive amateurs · chip-timed' },
      { name: 'Community 20 km', detail: 'All abilities · non-competitive' },
    ],
  },
  {
    tag: 'Discipline 02',
    name: 'HYROX-Style',
    image: '/images/hyrox-arena.png',
    blurb:
      'Eight functional stations against the clock — sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.',
    categories: [
      { name: 'Elite', detail: 'Individual · full competition weight' },
      { name: 'Open', detail: 'Individual · scaled weights available' },
      { name: 'Corporate Teams', detail: 'Relay of 4 · perfect for sponsors' },
    ],
  },
]

const SCHEDULE = [
  { day: 'Fri 6 Nov', title: 'Registration & Expo', items: ['Athlete check-in opens', 'Partner expo village', 'Course briefings', 'Welcome sundowner'] },
  { day: 'Sat 7 Nov', title: 'Race Day', items: ['Elite road race — dawn start', 'HYROX-style waves all day', 'Community 20 km ride', 'Live finish-line coverage'] },
  { day: 'Sun 8 Nov', title: 'Awards & Recovery', items: ['Podium ceremony', 'Beach recovery sessions', 'Closing celebration', 'Departures'] },
]

const INCLUDED = ['Chip timing & official results', 'Medical & safety cover', 'Finisher medal & tee', 'Hydration & fuel stations', 'Expo village access', 'Post-race recovery zone']

export default function FestivalPage() {
  return (
    <main>
      <PageHero
        eyebrow="The festival"
        title={<>Two disciplines. One coastline. One weekend.</>}
        intro="6–8 November 2026 in Fumba Town, Zanzibar. Race the discipline you love — or take on both — then recover on the same sand you started from."
        image={{ src: '/images/cycling.png', alt: 'The peloton racing along the coastal road' }}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="inline-flex items-center gap-2 rounded-sm bg-amber px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5">
            Register <Chevrons />
          </Link>
          <a href="#schedule" className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber">
            View schedule
          </a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Choose your start line" title="Pick your lane — or take on both." />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {DISCIPLINES.map((d) => (
            <article key={d.name} className="overflow-hidden rounded-lg border border-border bg-surface-dark-soft">
              <div className="group relative aspect-[16/10]">
                <Image src={d.image} alt={`${d.name} at ZanziFit Festival`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark-soft via-surface-dark-soft/20 to-transparent" />
                <span className="absolute left-5 top-5 rounded-sm bg-ink/80 px-3 py-1.5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber backdrop-blur">
                  {d.tag}
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-display text-3xl font-semibold text-surface-dark-foreground">{d.name}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d.blurb}</p>
                <ul className="mt-6 divide-y divide-border border-t border-border">
                  {d.categories.map((c) => (
                    <li key={c.name} className="flex items-baseline justify-between gap-4 py-3">
                      <span className="font-utility text-sm font-semibold uppercase tracking-[0.1em] text-surface-dark-foreground">{c.name}</span>
                      <span className="text-right text-sm text-muted-foreground">{c.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="schedule" className="scroll-mt-24 border-y border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Race weekend" title="Three days on the coast." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {SCHEDULE.map((s) => (
              <div key={s.day} className="rounded-lg border border-border bg-background p-8">
                <div className="font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber">{s.day}</div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-surface-dark-foreground">{s.title}</h3>
                <ul className="mt-5 space-y-3">
                  {s.items.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="Your entry includes" title="Everything but the effort." align="left" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-surface-dark-soft px-4 py-3 text-sm text-surface-dark-foreground">
                  <Chevrons className="shrink-0 text-amber" count={1} />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="/images/festival-village.png" alt="The ZanziFit festival village and expo at golden hour" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>
    </main>
  )
}
