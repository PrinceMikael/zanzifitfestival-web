'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { ExpandableCard } from '@/components/expandable-card'
import { RevealGroup, RevealItem } from '@/components/reveal'

type Stay = {
  title: string
  area: string
  badge: string
  distanceMins: number
  image: string | null
  summary: string
  details: string[]
}

type Tier = {
  id: string
  eyebrow: string
  title: string
  kind: 'hotel' | 'resort' | 'boutique' | 'budget'
  items: Stay[]
}

export function AccommodationTiers({ tiers }: { tiers: Tier[] }) {
  const [sortByDistance, setSortByDistance] = useState(false)

  return (
    <>
      {tiers.map((tier) => (
        <TierSection key={tier.id} tier={tier} sortByDistance={sortByDistance} onToggleSort={() => setSortByDistance((v) => !v)} />
      ))}
    </>
  )
}

function TierSection({
  tier,
  sortByDistance,
  onToggleSort,
}: {
  tier: Tier
  sortByDistance: boolean
  onToggleSort: () => void
}) {
  const items = useMemo(() => {
    if (!sortByDistance) return tier.items
    return [...tier.items].sort((a, b) => a.distanceMins - b.distanceMins)
  }, [tier.items, sortByDistance])

  const closest = useMemo(
    () => tier.items.reduce((min, i) => (i.distanceMins < min.distanceMins ? i : min), tier.items[0]),
    [tier.items],
  )

  return (
    <section
      id={tier.id}
      className="scroll-mt-24 border-b border-border px-6 py-20 md:py-28 odd:bg-surface-dark-soft"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={tier.title} />
          <button
            type="button"
            onClick={onToggleSort}
            aria-pressed={sortByDistance}
            className="mb-1 flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground/70 transition-colors hover:border-amber hover:text-amber"
          >
            <ArrowUpDown className="size-3.5" />
            {sortByDistance ? 'Sorted: closest first' : 'Sort by distance'}
          </button>
        </div>
        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RevealItem key={item.title}>
              <ExpandableCard
                image={item.image}
                alt={item.title}
                title={item.title}
                badge={item.badge}
                summary={`${item.area}: ${item.summary}`}
                details={item.details}
                enquiryLabel={item.title}
                enquiryContext="accommodation"
                kind={tier.kind}
                featured={item.title === closest.title}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
