import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'

export const metadata: Metadata = {
  title: 'Leadership',
  description:
    'Meet the team behind ZanziFit Festival — endurance athletes, event operators and Zanzibari hospitality leaders.',
}

const TEAM = [
  {
    name: 'Juma Salim',
    role: 'Founder & Festival Director',
    image: '/images/leader-1.png',
    bio: 'Endurance athlete and events entrepreneur. Juma founded ZanziFit to give East Africa a world-class festival on home soil.',
  },
  {
    name: 'Amina Rashid',
    role: 'Event Director',
    image: '/images/leader-2.png',
    bio: 'Fifteen years running large-scale destination events across the region. Amina owns race-weekend delivery end to end.',
  },
  {
    name: 'David Okoth',
    role: 'Head of Sport & Competition',
    image: '/images/leader-3.png',
    bio: 'Former national cyclist and certified course designer. David maps the courses and holds the timing to elite standards.',
  },
  {
    name: 'Sofia Mbwana',
    role: 'Head of Partnerships',
    image: '/images/leader-4.png',
    bio: 'Brand and sponsorship strategist. Sofia builds the partner programme that keeps the festival premium and sustainable.',
  },
]

const ADVISORS = [
  'Zanzibar Tourism Board — destination advisory',
  'Regional Cycling Federation — sporting sanction',
  'Coastal Medical Group — safety & medical direction',
  'HYROX-style format consultants — competition design',
]

export default function LeadershipPage() {
  return (
    <main>
      <PageHero
        eyebrow="The team"
        title={<>The people behind the horizon.</>}
        intro="ZanziFit is run by a team that lives at the intersection of endurance sport, world-class event operations and Zanzibari hospitality."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Leadership" title="Meet the core team." />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <article key={m.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}, ${m.role}`}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-bone">{m.name}</h3>
              <div className="mt-1 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">{m.role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-ink-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Advisory & partners" title="Backed by the right expertise." />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {ADVISORS.map((a) => (
              <li key={a} className="flex items-center gap-3 rounded-sm border border-border bg-background px-5 py-4 text-bone">
                <Chevrons className="shrink-0 text-amber" count={1} />
                <span className="text-sm leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
