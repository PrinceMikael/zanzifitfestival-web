import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Chevrons } from '@/components/chevrons'

export function WhyZanzibar() {
  return (
    <section className="border-t border-border bg-surface-dark py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
          <Image
            src="/images/zanzibar-coast.png"
            alt="A traditional dhow sailing off the Zanzibar coast at golden hour"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink/50 to-transparent" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Chevrons count={3} className="text-amber" />
            <span className="eyebrow text-amber">Why Zanzibar</span>
          </div>
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-surface-dark-foreground sm:text-5xl">
            A finish line worth travelling for.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-surface-dark-foreground/70">
            Race on closed coastal roads, recover on white sand, and celebrate
            under the same sky that has guided dhows for centuries. ZanziFit
            pairs competition-grade organisation with the hospitality of one of
            East Africa&apos;s most iconic destinations — so athletes arrive to
            compete and leave having travelled.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground"
          >
            More about the festival
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
