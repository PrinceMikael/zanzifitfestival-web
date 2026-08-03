'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chevrons } from '@/components/chevrons'
import { ThemeToggle } from '@/components/theme-toggle'

const PRIMARY_NAV = [
  { href: '/experience', label: 'Experience Zanzibar' },
  { href: '/accommodation', label: 'Accommodation' },
]

const FESTIVAL_NAV = [
  { href: '/festival/cycling', label: 'Road Cycling' },
  { href: '/festival/hyrox', label: 'HYROX-Style' },
]

const MORE_NAV = [
  { href: '/partnership', label: 'Partnership' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const MOBILE_NAV = [
  { href: '/about', label: 'About' },
  { href: '/festival', label: 'The Festival', children: FESTIVAL_NAV },
  { href: '/experience', label: 'Experience Zanzibar' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/partnership', label: 'Partnership' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'festival' | 'more' | null>(null)
  const festivalRef = useRef<HTMLDivElement>(null)
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
    function onPointerDown(e: PointerEvent) {
      const ref = openMenu === 'festival' ? festivalRef : moreRef
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

  const festivalActive = pathname.startsWith('/festival')
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
            // Theme toggling sets `data-theme` on <html> (no `.dark` class), so
            // `dark:` variants never match here. Invert by default (correct for
            // the dark theme, the site default), and cancel the invert in light
            // mode via an explicit data-theme attribute selector.
            className="h-12 w-auto invert transition-transform duration-300 group-hover:scale-[1.03] lg:h-[4.5rem] [:root[data-theme='light']_&]:invert-0"
          />
          <span className="hidden flex-col border-l border-border/70 pl-3 leading-none sm:flex lg:hidden">
            <span className="font-utility text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-amber">
              Zanzibar
            </span>
            <span className="mt-1 font-utility text-[0.62rem] uppercase tracking-[0.2em] text-foreground/50">
              6&ndash;8 Nov 2026
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Primary">
          <NavLink href="/about" active={pathname === '/about'}>
            About
          </NavLink>
          <div className="relative" ref={festivalRef}>
            <button
              type="button"
              onClick={() => setOpenMenu((v) => (v === 'festival' ? null : 'festival'))}
              aria-expanded={openMenu === 'festival'}
              aria-haspopup="menu"
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap font-utility text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors',
                festivalActive ? 'text-amber' : 'text-foreground/90 hover:text-foreground',
              )}
            >
              The Festival
              <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'festival' && 'rotate-180')} />
            </button>
            {openMenu === 'festival' && (
              <div
                role="menu"
                className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 rounded-sm border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md"
              >
                <Link
                  href="/festival"
                  role="menuitem"
                  className={cn(
                    'flex items-center justify-between rounded-sm px-3 py-2.5 font-utility text-[0.8rem] uppercase tracking-[0.12em] transition-colors',
                    pathname === '/festival'
                      ? 'text-amber'
                      : 'text-foreground/70 hover:bg-surface-dark-soft hover:text-foreground',
                  )}
                >
                  Overview
                  <Chevrons count={1} className="text-amber" />
                </Link>
                <div className="my-1 border-t border-border/60" />
                {FESTIVAL_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="flex items-center justify-between rounded-sm px-3 py-2.5 font-utility text-[0.8rem] uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:bg-surface-dark-soft hover:text-foreground"
                  >
                    {item.label}
                    <Chevrons count={1} className="text-amber" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.href} href={item.href} active={pathname === item.href}>
              {item.label}
            </NavLink>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setOpenMenu((v) => (v === 'more' ? null : 'more'))}
              aria-expanded={openMenu === 'more'}
              aria-haspopup="menu"
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap font-utility text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors',
                moreActive ? 'text-amber' : 'text-foreground/90 hover:text-foreground',
              )}
            >
              More
              <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'more' && 'rotate-180')} />
            </button>
            {openMenu === 'more' && (
              <div
                role="menu"
                className="absolute left-1/2 top-full mt-4 w-48 -translate-x-1/2 rounded-sm border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md"
              >
                {MORE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      'flex items-center justify-between rounded-sm px-3 py-2.5 font-utility text-[0.8rem] uppercase tracking-[0.12em] transition-colors',
                      pathname === item.href
                        ? 'text-amber'
                        : 'text-foreground/70 hover:bg-surface-dark-soft hover:text-foreground',
                    )}
                  >
                    {item.label}
                    <Chevrons count={1} className="text-amber" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <style data-impeccable-css="9bc03082">{`
            @scope ([data-impeccable-variant="1"]) {
              :scope > a {
                background: color-mix(in srgb, var(--amber) 22%, transparent);
                backdrop-filter: blur(var(--p-blur, 12px));
                -webkit-backdrop-filter: blur(var(--p-blur, 12px));
                border: 1px solid color-mix(in srgb, var(--amber) 45%, transparent);
                border-radius: 999px;
                color: var(--bone);
                font-weight: 700;
                box-shadow: none;
              }
            }
            @scope ([data-impeccable-variant="2"]) {
              :scope > a {
                background: color-mix(in srgb, var(--bone) 14%, transparent);
                backdrop-filter: blur(var(--p-blur, 16px));
                -webkit-backdrop-filter: blur(var(--p-blur, 16px));
                border: 1px solid color-mix(in srgb, var(--bone) 35%, transparent);
                border-radius: 999px;
                color: var(--bone);
                font-weight: 700;
                box-shadow: inset 0 1px 0 color-mix(in srgb, var(--bone) 25%, transparent);
              }
            }
            @scope ([data-impeccable-variant="3"]) {
              :scope > a {
                background: color-mix(in srgb, var(--amber) 16%, transparent);
                backdrop-filter: blur(var(--p-blur, 10px));
                -webkit-backdrop-filter: blur(var(--p-blur, 10px));
                border: 1px solid color-mix(in srgb, var(--amber) 60%, transparent);
                border-radius: 999px;
                color: var(--bone);
                font-weight: 700;
                transition: background 0.2s, border-color 0.2s, transform 0.2s;
              }
              :scope > a:hover {
                background: color-mix(in srgb, var(--amber) 28%, transparent);
                transform: translateY(-1px);
              }
            }
          `}</style>
          <div data-impeccable-variant="1" style={{ display: "none" }} data-impeccable-params='[{"id":"blur","kind":"range","min":4,"max":24,"step":1,"default":12,"label":"Blur"}]'>
            <Link
              href="/register"
              className="group hidden items-center gap-2.5 whitespace-nowrap px-5 py-2.5 font-utility text-[0.78rem] uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 sm:inline-flex"
            >
              Join Waitlist
              <Chevrons count={3} className="text-bone/80" animate />
            </Link>
          </div>
          <div data-impeccable-variant="2" style={{ display: "none" }} data-impeccable-params='[{"id":"blur","kind":"range","min":4,"max":24,"step":1,"default":16,"label":"Blur"}]'>
            <Link
              href="/register"
              className="group hidden items-center gap-2.5 whitespace-nowrap px-5 py-2.5 font-utility text-[0.78rem] uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 sm:inline-flex"
            >
              Join Waitlist
              <Chevrons count={3} className="text-bone/80" animate />
            </Link>
          </div>
          <div data-impeccable-variant="3" style={{ display: "none" }} data-impeccable-params='[{"id":"blur","kind":"range","min":4,"max":24,"step":1,"default":10,"label":"Blur"}]'>
            <Link
              href="/register"
              className="group hidden items-center gap-2.5 whitespace-nowrap px-5 py-2.5 font-utility text-[0.78rem] uppercase tracking-[0.14em] sm:inline-flex"
            >
              Join Waitlist
              <Chevrons count={3} className="text-bone/80" animate />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-sm border border-border text-foreground lg:hidden"
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
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
            <div className="flex items-center gap-2">
              <Chevrons count={3} className="text-amber" animate />
              <span className="font-display text-2xl font-semibold text-foreground">
                Zanzibar <span className="text-amber">·</span> 6&ndash;8 Nov 2026
              </span>
            </div>
          </div>
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6" aria-label="Mobile">
            {MOBILE_NAV.map((item) => (
              <div key={item.href} className="border-b border-border/60">
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3 font-utility text-sm uppercase tracking-[0.14em] text-foreground/80"
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
                        className="flex items-center justify-between py-2 font-utility text-xs uppercase tracking-[0.12em] text-foreground/60"
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
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-5 py-3.5 font-utility text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground"
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
        'relative flex items-center gap-1.5 whitespace-nowrap font-utility text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors',
        active ? 'text-amber' : 'text-foreground/90 hover:text-foreground',
      )}
    >
      {children}
      {active && <Chevrons count={1} className="text-amber" />}
    </Link>
  )
}
