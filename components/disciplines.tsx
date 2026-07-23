import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const DISCIPLINES = [
  {
    tag: 'Discipline 01',
    title: 'Road Cycling',
    href: '/festival#cycling',
    image: '/images/cycling.png',
    copy: 'Coastal road racing on closed circuits along the Zanzibar coastline — from a fast community sprint to a punishing elite endurance loop.',
    categories: ['Elite Road Race', 'Open 60km', 'Community 20km'],
    stat: { value: '80km', label: 'Longest elite loop' },
  },
  {
    tag: 'Discipline 02',
    title: 'HYROX-Style',
    href: '/festival#hyrox',
    image: '/images/hyrox-arena.png',
    copy: 'Eight functional stations against the clock — sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.',
    categories: ['Elite', 'Open', 'Corporate Teams'],
    stat: { value: '8', label: 'Timed stations' },
  },
]

export function Disciplines() {
  return (
    <section className="border-t border-border bg-surface-dark py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Choose your start line."
          intro="ZanziFit runs two competitions across one weekend on the same coastline — pick your lane, or take on both."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {DISCIPLINES.map((d) => (
            <Link
              key={d.title}
              href={d.href}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface-dark-soft transition-colors hover:border-amber/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={d.image}
                  alt={d.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark-soft via-surface-dark-soft/20 to-transparent" />
                <span className="absolute left-5 top-5 eyebrow rounded-sm bg-ink/70 px-3 py-1.5 text-amber backdrop-blur-sm">
                  {d.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl text-surface-dark-foreground lg:text-4xl">
                    {d.title}
                  </h3>
                  <ArrowUpRight className="size-6 shrink-0 text-surface-dark-foreground/40 transition-colors group-hover:text-amber" />
                </div>
                <p className="mt-4 text-pretty leading-relaxed text-surface-dark-foreground/65">
                  {d.copy}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {d.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-sm border border-border px-3 py-1.5 font-utility text-xs uppercase tracking-[0.12em] text-surface-dark-foreground/70"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-end justify-between border-t border-border pt-5">
                  <div>
                    <div className="font-utility text-3xl font-semibold text-amber">
                      {d.stat.value}
                    </div>
                    <div className="mt-1 font-utility text-xs uppercase tracking-[0.16em] text-surface-dark-foreground/50">
                      {d.stat.label}
                    </div>
                  </div>
                  <span className="font-utility text-xs uppercase tracking-[0.16em] text-surface-dark-foreground/70 group-hover:text-amber">
                    Explore format
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
