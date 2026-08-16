import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/contact',
  title: 'Contact',
  description: 'Get in touch with ZanziFit Festival in Zanzibar, Tanzania.',
})

export default function ContactPage() {
  return (
    <main>
      <PageHero
        title={<>Talk to the ZanziFit team.</>}
        intro="Race categories, travel logistics, or anything else about race weekend: message us directly and a member of our Zanzibar-based team will reply within two business days."
      />
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="We're based in Zanzibar." align="left" />
            <Reveal delay={0.1}>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-3">
                  <Chevrons className="text-amber" count={1} />
                  <a href="mailto:info@zanzifitfestival.com" className="transition-colors hover:text-amber">
                    info@zanzifitfestival.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Chevrons className="text-amber" count={1} />
                  +255 686 915 587
                </p>
                <p className="flex items-center gap-3">
                  <Chevrons className="text-amber" count={1} />
                  Zanzibar, Tanzania
                </p>
                <p className="flex items-center gap-3">
                  <Chevrons className="text-amber" count={1} />
                  <a
                    href="https://wa.me/255686915587"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="Chat"
                    className="transition-colors hover:text-amber"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              </div>

              <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
                Looking to sponsor the festival instead?{' '}
                <Link href="/partnership" className="font-semibold text-amber transition-colors hover:text-surface-dark-foreground">
                  Visit our Partnership page
                </Link>
                .
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  )
}
