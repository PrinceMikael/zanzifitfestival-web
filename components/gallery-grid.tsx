'use client'

import { useState } from 'react'
import Image from 'next/image'

type Item = { src: string; alt: string; tag: string; span?: boolean }

const ITEMS: Item[] = [
  { src: '/images/cycling.png', alt: 'The peloton racing along the coastal road', tag: 'Cycling', span: true },
  { src: '/images/hyrox-arena.png', alt: 'An athlete pulling a weighted sled', tag: 'HYROX' },
  { src: '/images/finish-line.png', alt: 'An athlete crossing the finish line at sunset', tag: 'Moments' },
  { src: '/images/festival-village.png', alt: 'The festival village at golden hour', tag: 'Festival', span: true },
  { src: '/images/zanzibar-coast.png', alt: 'Aerial view of the Zanzibar coastline', tag: 'Destination' },
  { src: '/images/finish-line.png', alt: 'The ZanziFit start line at dawn', tag: 'Moments' },
]

const FILTERS = ['All', 'Cycling', 'HYROX', 'Festival', 'Destination', 'Moments']

export function GalleryGrid() {
  const [filter, setFilter] = useState('All')
  const visible = filter === 'All' ? ITEMS : ITEMS.filter((i) => i.tag === filter)

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-sm border px-4 py-2 font-utility text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
              filter === f
                ? 'border-amber bg-amber text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-amber hover:text-amber'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[260px]">
        {visible.map((item, idx) => (
          <figure
            key={item.src + idx}
            className={`group relative overflow-hidden rounded-lg border border-border ${
              item.span ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <Image
              src={item.src || '/placeholder.svg'}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <figcaption className="absolute bottom-3 left-3 rounded-sm bg-ink/80 px-2.5 py-1 font-utility text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-amber opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {item.tag}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
