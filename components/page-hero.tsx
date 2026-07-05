import type { ReactNode } from 'react'
import { Chevrons } from '@/components/chevrons'

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: ReactNode
  intro?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-ink-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, var(--amber), transparent 45%), radial-gradient(circle at 85% 80%, var(--deep-teal), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mb-5 flex items-center gap-3">
          <Chevrons className="text-amber" />
          <span className="eyebrow text-amber">{eyebrow}</span>
        </div>
        <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-bone text-balance md:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}
