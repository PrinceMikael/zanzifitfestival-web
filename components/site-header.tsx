'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chevrons } from '@/components/chevrons'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/festival', label: 'The Festival' },
  { href: '/experience', label: 'Experience Zanzibar' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/partnership', label: 'Partnership' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

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
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-border bg-ink/85 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      {/* Chevron scroll-progress indicator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-border">
        <div
          className="h-px bg-amber transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="ZanziFit Festival home">
          <Image
            src="/zfit-logo.png"
            alt="ZFit Festival"
            width={132}
            height={44}
            priority
            // Header always renders over a dark surface (bg-ink/85 when scrolled,
            // transparent-over-dark-hero otherwise) in both themes, so logo invert
            // stays unconditional.
            className="h-8 w-auto invert lg:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-utility text-[0.82rem] uppercase tracking-[0.14em] transition-colors',
                  active
                    ? 'text-amber'
                    : 'text-bone/70 hover:text-bone',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/register"
            className="group hidden items-center gap-2 rounded-sm bg-amber px-5 py-2.5 font-utility text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Register
            <Chevrons count={3} className="text-primary-foreground/80" animate />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-sm border border-border text-bone lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-ink/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-border/60 py-3 font-utility text-sm uppercase tracking-[0.14em] text-bone/80"
              >
                {item.label}
                <Chevrons count={1} className="text-amber" />
              </Link>
            ))}
            <Link
              href="/register"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-5 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Register Your Category
              <Chevrons count={3} className="text-primary-foreground/80" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
