'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Clock, MapPin, Waves, Building2, Tent, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chevrons } from '@/components/chevrons'
import { EnquiryLink } from '@/components/enquiry-link'

const TIER_ICON = {
  hotel: Building2,
  resort: Waves,
  boutique: Tent,
  budget: Wallet,
  activity: MapPin,
} as const

type TierKind = keyof typeof TIER_ICON

export function ExpandableCard({
  image,
  alt,
  title,
  badge,
  summary,
  details,
  enquiryLabel,
  enquiryContext,
  kind = 'activity',
  featured = false,
}: {
  image: string | null
  alt: string
  title: string
  badge?: string
  summary: string
  details: string[]
  enquiryLabel: string
  enquiryContext: 'accommodation' | 'experience'
  kind?: TierKind
  featured?: boolean
}) {
  const [open, setOpen] = useState(false)
  const TierIcon = TIER_ICON[kind]
  const isStay = kind !== 'activity'

  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border bg-surface-dark-soft transition-colors',
        featured ? 'border-amber/40 sm:col-span-2' : 'border-border',
      )}
    >
      <div className={cn('group relative', featured ? 'aspect-21/9' : 'aspect-16/10')}>
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? '100vw' : '(max-width: 1024px) 100vw, 33vw'}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--amber)/12,transparent_55%)]"
          >
            <TierIcon className="size-10 text-surface-dark-foreground/20" strokeWidth={1.25} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-surface-dark-soft via-surface-dark-soft/10 to-transparent" />
        {featured ? (
          <span className="absolute right-4 top-4 rounded-sm bg-amber px-3 py-1.5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground">
            Closest to the venue
          </span>
        ) : null}
        {badge ? (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-sm bg-ink/80 px-3 py-1.5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber backdrop-blur">
            {isStay ? <MapPin className="size-3.5" /> : <Clock className="size-3.5" />}
            {badge}
          </span>
        ) : null}
      </div>

      <div className={cn('p-6', featured && 'sm:p-8')}>
        <h3 className={cn('font-display font-semibold text-surface-dark-foreground', featured ? 'text-2xl' : 'text-xl')}>
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          data-cursor-label={open ? 'Close' : 'Open'}
          className="mt-4 flex items-center gap-2 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground/70 transition-colors hover:text-amber"
        >
          {open ? 'View less' : `View more (${details.length})`}
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open ? (
          <ul className="mt-4 space-y-2 border-t border-border pt-4">
            {details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                {d}
              </li>
            ))}
          </ul>
        ) : null}

        <EnquiryLink label={enquiryLabel} context={enquiryContext} className="mt-5" />
      </div>
    </article>
  )
}
