import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'

export const metadata: Metadata = {
  title: 'Leadership',
  description:
    'Meet the team behind ZanziFit Festival — endurance athletes, event operators and Zanzibari hospitality leaders.',
}

const TEAM = [
  {
    name: 'Ally Daudi',
    role: 'Founder & Executive Director',
    image: '/images/leadership/ally-daudi.jpg',
    bio: 'Founder of ZanziFit Festival, driving the vision to bring a world-class endurance sports platform to East Africa.',
  },
  {
    name: 'Salim Kikeke',
    role: 'Chairman of the Board',
    image: '/images/leadership/salim-kikeke.jpg',
    bio: 'Chairs the ZanziFit board, guiding the festival\'s governance and long-term strategic direction.',
  },
  {
    name: 'Hassan Mussa',
    role: 'Project Manager & Board Member',
    image: '/images/leadership/hassan-mussa.jpg',
    bio: 'Oversees festival project delivery, coordinating the operational work that turns the event plan into race day.',
  },
  {
    name: 'Mohamed Sharif',
    role: 'Director & Board Member',
    image: '/images/leadership/mohamed-sharif.jpg',
    bio: 'Contributes to board-level direction and oversight across the festival\'s core operations.',
  },
  {
    name: 'Hassan Ali',
    role: 'Director & Board Member',
    image: '/images/leadership/hassan-ali.jpg',
    bio: 'Contributes to board-level direction and oversight across the festival\'s core operations.',
  },
  {
    name: 'Walter Mwach',
    role: 'Board Secretary',
    image: '/images/leadership/walter-mwach.jpg',
    bio: 'Maintains board governance records and supports the formal decision-making process behind the festival.',
  },
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
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeading
            eyebrow="Governance"
            title="One board, full accountability."
            align="center"
          />
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            The six leaders above make up ZanziFit Festival&apos;s complete governing board —
            there is no separate advisory layer. As the festival grows, formal advisory and
            sanctioning partnerships (destination, sporting, medical) will be announced here.
          </p>
        </div>
      </section>
    </main>
  )
}
