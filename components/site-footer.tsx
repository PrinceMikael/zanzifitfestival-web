import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'
import { Chevrons } from '@/components/chevrons'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/social-icons'

const COLUMNS = [
  {
    heading: 'Compete',
    links: [
      { href: '/festival', label: 'The Festival' },
      { href: '/register', label: 'Register' },
      { href: '/festival#cycling', label: 'Road Cycling' },
      { href: '/festival#hyrox', label: 'HYROX-Style' },
    ],
  },
  {
    heading: 'Discover',
    links: [
      { href: '/about', label: 'About' },
      { href: '/leadership', label: 'Leadership' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { href: '/partnership', label: 'Partnership' },
      { href: '/contact', label: 'Contact' },
      { href: '/live', label: 'Live Leaderboard' },
    ],
  },
]

const SOCIALS = [
  { href: '#', label: 'Instagram', Icon: InstagramIcon },
  { href: '#', label: 'Facebook', Icon: FacebookIcon },
  { href: '#', label: 'YouTube', Icon: YoutubeIcon },
  { href: 'https://wa.me/255686915587', label: 'WhatsApp', Icon: MessageCircle },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image
              src="/zfit-logo.png"
              alt="ZFit Festival"
              width={150}
              height={50}
              // Footer always renders on bg-ink (literal brand-dark), unaffected
              // by the light/dark toggle — logo invert stays unconditional.
              className="h-9 w-auto invert"
            />
            <p className="mt-5 text-pretty leading-relaxed text-bone/65">
              A hybrid road-cycling and HYROX-style functional fitness festival
              where the Zanzibar horizon meets the start line.
            </p>
            <p className="mt-5 font-utility text-sm uppercase tracking-[0.16em] text-bone/80">
              6 November 2026
              <span className="mx-2 text-amber">/</span>
              Zanzibar, Tanzania
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="eyebrow text-amber">{col.heading}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-bone/70 transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-display text-2xl text-bone">
              Stay on the start line.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60">
              Registration windows, category cutoffs and travel updates —
              straight to your inbox. No noise.
            </p>
            <NewsletterForm />
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <div className="flex gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-bone/70 transition-colors hover:border-amber hover:text-amber"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            <a
              href="mailto:info@zanzifit.com"
              className="font-utility text-xs uppercase tracking-[0.16em] text-bone/45 transition-colors hover:text-amber"
            >
              info@zanzifit.com
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-bone/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ZanziFit Festival. All rights reserved.</p>
          <div className="flex items-center gap-2 font-utility uppercase tracking-[0.16em]">
            <Chevrons count={3} className="text-amber/70" />
            <span>Horizon meets the start line</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
