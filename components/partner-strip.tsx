import Link from 'next/link'
import Image from 'next/image'

/**
 * Accepts an array of partner logos. Real sponsor logos aren't secured yet,
 * so this renders an "open slots" placeholder state. Populate `partners`
 * (e.g. from a CMS/config) to switch it on.
 */
type Partner = { name: string; logo: string; href?: string }

const SLOT_LABELS = [
  'Airline Partner',
  'Water Partner',
  'Media Partner',
  'Tourism Partner',
  'Presenting Partner',
]

export function PartnerStrip({ partners = [] as Partner[] }: { partners?: Partner[] }) {
  const hasPartners = partners.length > 0

  return (
    <section className="border-t border-border bg-ink py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="eyebrow text-bone/55">
            {hasPartners ? 'Proudly partnered with' : 'Partnership slots open'}
          </p>
          <Link
            href="/partnership"
            className="font-utility text-xs uppercase tracking-[0.14em] text-amber transition-colors hover:text-bone"
          >
            Become a partner
          </Link>
        </div>

        {hasPartners ? (
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
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SLOT_LABELS.map((label) => (
              <div
                key={label}
                className="flex h-24 items-center justify-center rounded-sm border border-dashed border-border/70 px-4 text-center font-utility text-xs uppercase tracking-[0.14em] text-bone/40"
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
