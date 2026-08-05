'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chevrons } from '@/components/chevrons'

// Five top-level decision points, each grounded in what the visitor is
// actually deciding:
//   About        -> who is behind this (story + the people)
//   The Festival  -> what the competition is
//   Experience    -> should I go, where do I stay
//   Partnership   -> a named revenue persona, given real top-level scent
//   More          -> FAQ + Contact only (support/utility, not a catch-all —
//                    Partnership/Leadership have their own homes above)
const ABOUT_NAV = [{ href: '/leadership', label: 'Leadership' }]

const FESTIVAL_NAV = [
  { href: '/festival/cycling', label: 'Road Cycling' },
  { href: '/festival/hyrox', label: 'HYROX-Style' },
]

const EXPERIENCE_NAV = [{ href: '/accommodation', label: 'Accommodation' }]

const MORE_NAV = [
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const MOBILE_NAV = [
  { href: '/about', label: 'About', children: ABOUT_NAV },
  { href: '/festival', label: 'The Festival', children: FESTIVAL_NAV },
  { href: '/experience', label: 'Experience Zanzibar', children: EXPERIENCE_NAV },
  { href: '/partnership', label: 'Partnership' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'about' | 'festival' | 'experience' | 'more' | null>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const festivalRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(1, y / h) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    if (!openMenu) return
    const refs = { about: aboutRef, festival: festivalRef, experience: experienceRef, more: moreRef }
    function onPointerDown(e: PointerEvent) {
      const ref = refs[openMenu as keyof typeof refs]
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenMenu(null)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenu])

  // Close an open dropdown if a resize crosses the lg breakpoint while
  // it's open (e.g. rotating a tablet), so state can't strand a desktop
  // dropdown open underneath the mobile layout.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth < 1024) setOpenMenu(null)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const aboutActive = pathname === '/about' || pathname === '/leadership'
  const festivalActive = pathname.startsWith('/festival')
  const experienceActive = pathname === '/experience' || pathname === '/accommodation'
  const moreActive = MORE_NAV.some((item) => item.href === pathname)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md'
          : 'bg-linear-to-b from-ink/70 to-transparent',
      )}
    >
      {/* Chevron scroll-progress band — the ">>>" motif carried into the chrome itself */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-border/60">
        <div
          className="h-full bg-amber shadow-[0_0_12px_rgba(242,169,68,0.65)] transition-[width] duration-150"
          style={{ width: `${Math.max(progress * 100, 2)}%` }}
        />
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="ZanziFit Festival home">
          <Image
            src="/zfit-logo.svg"
            alt="ZFit Festival"
            width={220}
            height={76}
            priority
            // Site is dark-only: the logo asset is a dark mark, so it's
            // always inverted to read light-on-black in the header.
            className="h-12 w-auto invert transition-transform duration-300 group-hover:scale-[1.03] lg:h-[4.5rem]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Primary">
          <NavDropdown
            label="About"
            overviewHref="/about"
            overviewLabel="Overview"
            items={ABOUT_NAV}
            active={aboutActive}
            open={openMenu === 'about'}
            onToggle={() => setOpenMenu((v) => (v === 'about' ? null : 'about'))}
            containerRef={aboutRef}
            pathname={pathname}
          />
          <NavDropdown
            label="The Festival"
            overviewHref="/festival"
            overviewLabel="Overview"
            items={FESTIVAL_NAV}
            active={festivalActive}
            open={openMenu === 'festival'}
            onToggle={() => setOpenMenu((v) => (v === 'festival' ? null : 'festival'))}
            containerRef={festivalRef}
            pathname={pathname}
          />
          <NavDropdown
            label="Experience Zanzibar"
            overviewHref="/experience"
            overviewLabel="Overview"
            items={EXPERIENCE_NAV}
            active={experienceActive}
            open={openMenu === 'experience'}
            onToggle={() => setOpenMenu((v) => (v === 'experience' ? null : 'experience'))}
            containerRef={experienceRef}
            pathname={pathname}
          />
          <NavLink href="/partnership" active={pathname === '/partnership'}>
            Partnership
          </NavLink>
          <NavDropdown
            label="More"
            items={MORE_NAV}
            active={moreActive}
            open={openMenu === 'more'}
            onToggle={() => setOpenMenu((v) => (v === 'more' ? null : 'more'))}
            containerRef={moreRef}
            pathname={pathname}
          />
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="group hidden items-center gap-2.5 whitespace-nowrap rounded-sm border border-amber/60 px-5 py-2.5 font-nav text-[0.78rem] font-semibold text-bone transition-all hover:-translate-y-0.5 hover:border-amber hover:shadow-[0_8px_24px_-8px_rgba(242,169,68,0.7)] sm:inline-flex"
          >
            Join Waitlist
            <Chevrons count={3} className="text-amber" animate />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-sm border border-border text-foreground lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 pt-6 pb-4 sm:px-6" aria-label="Mobile">
            {MOBILE_NAV.map((item) => (
              <div key={item.href} className="border-b border-border/60">
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3 font-nav text-sm font-semibold text-foreground/80"
                >
                  {item.label}
                  <Chevrons count={1} className="text-amber" />
                </Link>
                {item.children ? (
                  <div className="flex flex-col pb-3 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center justify-between py-2 font-nav text-xs font-semibold text-foreground/60"
                      >
                        {child.label}
                        <Chevrons count={1} className="text-amber/70" />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link
              href="/register"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-5 py-3.5 font-nav text-sm font-semibold text-primary-foreground"
            >
              Join the Waitlist
              <Chevrons count={3} className="text-primary-foreground/80" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-1.5 whitespace-nowrap font-nav text-[0.82rem] font-semibold transition-colors',
        active ? 'text-amber' : 'text-foreground/90 hover:text-foreground',
      )}
    >
      {children}
      {active && <Chevrons count={1} className="text-amber" />}
    </Link>
  )
}

function NavDropdown({
  label,
  overviewHref,
  overviewLabel = 'Overview',
  items,
  active,
  open,
  onToggle,
  containerRef,
  pathname,
}: {
  label: string
  overviewHref?: string
  overviewLabel?: string
  items: { href: string; label: string }[]
  active: boolean
  open: boolean
  onToggle: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
  pathname: string
}) {
  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'flex items-center gap-1.5 whitespace-nowrap font-nav text-[0.82rem] font-semibold transition-colors',
          active ? 'text-amber' : 'text-foreground/90 hover:text-foreground',
        )}
      >
        {label}
        {/* Single brand chevron rotates to signal open/closed — the same
            >>> motif used for active links and CTAs, not a generic caret. */}
        <Chevrons count={1} className={cn('transition-transform duration-200', open ? '-rotate-90' : 'rotate-90')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 rounded-sm border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md"
          >
            {overviewHref && (
              <>
                <Link
                  href={overviewHref}
                  role="menuitem"
                  className={cn(
                    'flex items-center justify-between rounded-sm px-3 py-2.5 font-nav text-[0.8rem] font-semibold transition-colors',
                    pathname === overviewHref
                      ? 'text-amber'
                      : 'text-foreground/70 hover:bg-surface-dark-soft hover:text-foreground',
                  )}
                >
                  {overviewLabel}
                  <Chevrons count={1} className="text-amber" />
                </Link>
                <div className="my-1 border-t border-border/60" />
              </>
            )}
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={cn(
                  'flex items-center justify-between rounded-sm px-3 py-2.5 font-nav text-[0.8rem] font-semibold transition-colors',
                  pathname === item.href
                    ? 'text-amber'
                    : 'text-foreground/70 hover:bg-surface-dark-soft hover:text-foreground',
                )}
              >
                {item.label}
                <Chevrons count={1} className="text-amber" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
