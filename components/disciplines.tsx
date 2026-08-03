import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/section-heading'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'

const DISCIPLINES = [
  {
    title: 'Road Cycling',
    href: '/festival/cycling',
    image: '/images/discipline-road-cycling.jpg',
    copy: 'Coastal road racing on closed circuits along the Zanzibar coastline, from a fast community sprint to a punishing elite endurance loop.',
    categories: ['Elite Road Race', 'Open 60km', 'Community 20km'],
    stat: { value: '80km', label: 'Longest elite loop' },
    textAlign: 'left' as const,
  },
  {
    title: 'HYROX-Style',
    href: '/festival/hyrox',
    image: '/images/discipline-hyrox.jpg',
    copy: 'Eight functional stations against the clock: sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.',
    categories: ['Elite', 'Open', 'Corporate Teams'],
    stat: { value: '8', label: 'Timed stations' },
    textAlign: 'right' as const,
  },
]

export function Disciplines() {
  return (
    <section className="border-t border-border bg-surface-dark py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Choose your start line."
            intro="ZanziFit runs two competitions across one weekend on the same coastline. Pick your lane, or take on both."
          />
        </Reveal>
      </div>

      <RevealGroup className="mt-14 flex flex-col gap-6">
        {DISCIPLINES.map((d) => (
          <RevealItem key={d.title}>
            <Link href={d.href} className="group block bg-surface-dark-soft transition-colors">
              <div className="relative aspect-16/10 overflow-hidden sm:aspect-32/9">
                <Image
                  src={d.image}
                  alt={d.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/25 to-transparent" />
                {d.textAlign === 'left' && (
                  <div className="absolute inset-0 bg-linear-to-r from-ink/70 via-ink/10 to-transparent" />
                )}
                {d.textAlign === 'right' && (
                  <div className="absolute inset-0 bg-linear-to-l from-ink/70 via-ink/10 to-transparent" />
                )}

                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-10',
                    d.textAlign === 'right' && 'items-end text-right',
                  )}
                >
                  <div className={cn('flex flex-col gap-2', d.textAlign === 'right' && 'items-end')}>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-3xl text-bone sm:text-4xl lg:text-5xl">
                        {d.title}
                      </h3>
                      <ArrowUpRight className="size-6 shrink-0 text-bone/50 transition-colors group-hover:text-amber" />
                    </div>
                    <p className="max-w-md text-pretty leading-relaxed text-bone/80">
                      {d.copy}
                    </p>
                  </div>

                  <div
                    className={cn(
                      'flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-8',
                      d.textAlign === 'right' && 'sm:flex-row-reverse',
                    )}
                  >
                    <div className="flex flex-wrap gap-2">
                      {d.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-sm border border-bone/25 bg-ink/40 px-3 py-1.5 font-utility text-xs uppercase tracking-[0.12em] text-bone/80 backdrop-blur-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className={cn('flex items-end gap-6', d.textAlign === 'right' && 'flex-row-reverse')}>
                      <div className={d.textAlign === 'right' ? 'text-right' : undefined}>
                        <div className="font-utility text-2xl font-semibold text-amber sm:text-3xl">
                          {d.stat.value}
                        </div>
                        <div className="mt-1 font-utility text-xs uppercase tracking-[0.16em] text-bone/60">
                          {d.stat.label}
                        </div>
                      </div>
                      <span className="font-utility text-xs uppercase tracking-[0.16em] text-bone/80 transition-colors group-hover:text-amber">
                        Explore format
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
