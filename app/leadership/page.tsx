import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Leadership',
  description:
    'Meet the team behind ZanziFit Festival: endurance athletes, event operators and Zanzibari hospitality leaders.',
}

const LEADS = [
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
]

const TEAM = [
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
    bio: 'Brings a background in athlete and venue operations, focused on race-day logistics and on-site safety.',
  },
  {
    name: 'Hassan Ali',
    role: 'Director & Board Member',
    image: '/images/leadership/hassan-ali.jpg',
    bio: 'Leads engagement with Zanzibari hospitality and tourism partners, from accommodation to spectator experience.',
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
        title={<>The people behind the horizon.</>}
        intro="ZanziFit's core team is the group of six who hold direct operating and governing responsibility for the festival, spanning event delivery, athlete and venue operations, and Zanzibari hospitality partnerships. Every decision on the festival's direction runs through this group."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading title="Founder & governance." />
        <RevealGroup className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {LEADS.map((m) => (
            <RevealItem key={m.name} className="sm:flex sm:gap-6">
              <div className="group relative aspect-4/5 overflow-hidden sm:w-2/5 sm:shrink-0">
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}, ${m.role}`}
                  fill
                  className="object-cover transition-all duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, 30vw"
                />
              </div>
              <div className="mt-5 sm:mt-0 sm:flex sm:flex-col sm:justify-center">
                <h3 className="font-display text-2xl font-semibold text-surface-dark-foreground">{m.name}</h3>
                <div className="mt-1 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">{m.role}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl border-t border-border px-6 py-20 md:py-28">
        <SectionHeading title="Operating team." />
        <RevealGroup className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <RevealItem key={m.name}>
              <div className="group relative aspect-4/5 overflow-hidden">
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}, ${m.role}`}
                  fill
                  className="object-cover transition-all duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-surface-dark-foreground">{m.name}</h3>
              <div className="mt-1 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber">{m.role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mt-16 border-t border-border pt-10 text-center">
          <p className="text-muted-foreground">Interested in partnering with ZanziFit?</p>
          <Link
            href="/partnership"
            className="mt-3 inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground"
          >
            Explore partnership tiers
            <Chevrons />
          </Link>
        </Reveal>
      </section>
    </main>
  )
}
