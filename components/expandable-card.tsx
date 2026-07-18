'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Chevrons } from '@/components/chevrons'
import { EnquiryLink } from '@/components/enquiry-link'

export function ExpandableCard({
  image,
  alt,
  title,
  badge,
  summary,
  details,
  enquiryLabel,
  enquiryContext,
}: {
  image: string
  alt: string
  title: string
  badge?: string
  summary: string
  details: string[]
  enquiryLabel: string
  enquiryContext: 'accommodation' | 'experience'
}) {
  const [open, setOpen] = useState(false)

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-ink-soft">
      <div className="group relative aspect-[16/10]">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/10 to-transparent" />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-sm bg-ink/80 px-3 py-1.5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber backdrop-blur">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-bone">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          data-cursor-label={open ? 'Close' : 'Open'}
          className="mt-4 flex items-center gap-2 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-bone/70 transition-colors hover:text-amber"
        >
          {open ? 'View less' : 'View more'}
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
