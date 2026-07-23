import type { ReactNode } from 'react'
import Image from 'next/image'

export function PageHero({
  title,
  intro,
  image,
  children,
}: {
  title: ReactNode
  intro?: string
  image?: { src: string; alt: string }
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface-dark-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, var(--amber), transparent 45%), radial-gradient(circle at 85% 80%, var(--ink), transparent 50%)',
        }}
      />
      <div
        className={`relative mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-24 md:pt-40 ${
          image ? 'grid gap-12 md:grid-cols-2 md:items-center' : ''
        }`}
      >
        <div>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-surface-dark-foreground text-balance md:text-6xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {intro}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
