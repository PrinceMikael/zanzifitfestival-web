import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'

export const metadata: Metadata = {
  title: 'About',
  description:
    'ZanziFit is a hybrid road-cycling and HYROX-style fitness festival built to put Zanzibar on the global endurance map.',
}

const VALUES = [
  {
    title: 'Two sports, one weekend',
    body: 'Road cycling and functional fitness racing share the same coastline, the same village and the same finish line — so athletes and their families never have to choose.',
  },
  {
    title: 'Destination-grade hospitality',
    body: 'We pair competition-grade timing and safety with the warmth of one of East Africa’s most iconic destinations. You come to race; you leave having travelled.',
  },
  {
    title: 'Built for the region',
    body: 'Community categories, local athlete pathways and partnerships with Zanzibari operators mean the festival grows the sport at home, not just for visitors.',
  },
]

const TIMELINE = [
  { year: '2024', label: 'The idea', body: 'A group of endurance athletes and Zanzibari operators sketch a festival that treats the island as the arena.' },
  { year: '2025', label: 'Foundations', body: 'Courses mapped along the Zanzibar coastline, timing and medical partners secured, first sponsors on board.' },
  { year: '2026', label: 'Race day', body: 'Inaugural edition — 6 November. 1,500+ athletes across 15 countries.' },
  { year: '2027', label: 'The horizon', body: 'A recurring fixture on the global hybrid-fitness calendar, with qualifying pathways for African athletes.' },
]

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About the festival"
        title={<>Where the ocean horizon meets the start line.</>}
        intro="ZanziFit is a hybrid endurance festival on the coast of Zanzibar — road cycling and HYROX-style functional fitness racing across one unforgettable weekend."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="/images/finish-line.png"
              alt="An athlete crossing the ZanziFit finish line at sunset on the Zanzibar coast"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading eyebrow="Our story" title="A festival, not just a race." align="left" />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Most endurance events ask you to fly somewhere grey, suffer, and fly home. ZanziFit was built on the
                opposite idea: that the best finish lines are worth travelling for.
              </p>
              <p>
                We took two of the fastest-growing sports in the world — road cycling and HYROX-style functional
                racing — and set them against the turquoise water and closed coastal roads of Zanzibar.
                The result is equal parts competition and celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="What we stand for" title="The principles behind ZanziFit." />
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.title} className="border-t-2 border-amber pt-6">
                <span className="font-utility text-sm font-semibold text-amber">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-surface-dark-foreground">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeading eyebrow="The road here" title="From idea to start line." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
          {TIMELINE.map((t) => (
            <div key={t.year} className="bg-background p-8">
              <div className="font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber">
                {t.year}
              </div>
              <div className="mt-3 font-display text-xl font-semibold text-surface-dark-foreground">{t.label}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-deep-teal py-16 text-bone">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-balance md:text-4xl">
            Be part of the first edition.
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-sm bg-amber px-7 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Register your category <Chevrons />
          </Link>
        </div>
      </section>
    </main>
  )
}
