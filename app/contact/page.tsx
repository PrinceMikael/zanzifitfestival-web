import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with ZanziFit Festival — Zanzibar, Tanzania.',
}

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to the team.</>}
        intro="Questions about the festival, your category, or partnering with us — reach out and we'll get back to you."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Get in touch" title="We're based in Zanzibar." align="left" />
            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-3">
                <Chevrons className="text-amber" count={1} />
                <a href="mailto:info@zanzifit.com" className="transition-colors hover:text-amber">
                  info@zanzifit.com
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
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
