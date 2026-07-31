import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'

/**
 * Accepts an array of partner logos. Real sponsor logos aren't secured yet,
 * so this renders a forward-looking "slots open" state rather than an
 * empty-looking placeholder grid. Populate `partners` (e.g. from a
 * CMS/config) to switch it on once partners are signed.
 */
type Partner = { name: string; logo: string; href?: string }

export function PartnerStrip({ partners = [] as Partner[] }: { partners?: Partner[] }) {
  const hasPartners = partners.length > 0

  return (
    <section className="border-t border-border bg-surface-dark py-16 lg:py-20">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-36">
        {hasPartners ? (
          <>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <p className="eyebrow text-surface-dark-foreground/55">Proudly partnered with</p>
              <Link
                href="/partnership"
                className="font-utility text-xs uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground"
              >
                Become a partner
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((p) => (
                <a
                  key={p.name}
                  href={p.href ?? '#'}
                  className="flex items-center justify-center rounded-sm border border-border p-6 opacity-70 transition-opacity hover:opacity-100"
                >
                  <Image src={p.logo} alt={p.name} width={160} height={60} className="h-10 w-auto" />
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-display text-2xl font-semibold text-surface-dark-foreground sm:text-3xl">
              Founding partner slots are open.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-surface-dark-foreground/60">
              Airline, water, media, tourism and presenting partnerships are available for the inaugural edition.
            </p>
            <Link
              href="/partnership"
              className="mt-2 inline-flex items-center gap-2 rounded-sm border border-amber/60 px-6 py-3 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:bg-amber hover:text-primary-foreground"
            >
              Become a Partner
            </Link>
          </div>
        )}
      </Reveal>
    </section>
  )
}
