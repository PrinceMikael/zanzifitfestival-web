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
    name: 'Walter Mwacha',
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
        intro="ZanziFit's core team is the group of six who hold direct operating and governing responsibility for the festival — spanning event delivery, athlete and venue operations, and Zanzibari hospitality partnerships. Every decision on the festival's direction runs through this group."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Leadership" title="Meet the core team." />
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <article key={m.name}>
              <div className="group relative aspect-[4/5] overflow-hidden">
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}, ${m.role}`}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-surface-dark-foreground">{m.name}</h3>
              <div className="mt-1 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">{m.role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
