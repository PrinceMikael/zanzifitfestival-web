import Link from 'next/link'
import { Chevrons } from '@/components/chevrons'

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface-dark-soft py-24 lg:py-32">
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(223,162,59,0.9) 0%, rgba(223,162,59,0) 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Chevrons count={3} className="text-amber" animate />
        </div>
        <h2 className="mt-6 text-balance font-display text-4xl leading-[1.02] text-surface-dark-foreground sm:text-6xl lg:text-7xl">
          The horizon is set for 6 November 2026.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/65">
          Categories are limited and fill fast. Lock in your place on the start
          line in Zanzibar.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-8 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Register Your Category
            <Chevrons count={3} className="text-primary-foreground/80" />
          </Link>
          <Link
            href="/festival"
            className="inline-flex items-center justify-center rounded-sm border border-surface-dark-foreground/30 px-8 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
          >
            Explore the Festival
          </Link>
        </div>
      </div>
    </section>
  )
}
