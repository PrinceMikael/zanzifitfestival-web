'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Chevrons } from '@/components/chevrons'
import { Countdown } from '@/components/countdown'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Depth layer moves at a different rate. Disabled for reduced-motion.
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '60%'])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black"
      aria-label="ZanziFit Festival hero"
    >
      {/* Content — constrained to the 144px safe zone. Anchored from the
          top (not vertically centered) so the full stack — title through
          buttons — never gets pushed below the fold on shorter viewports;
          centering a block this tall clipped the countdown/buttons on
          common laptop screen heights. */}
      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className="relative z-10 w-full pb-12 will-change-transform lg:py-0 px-6 sm:px-10 lg:pl-[144px] lg:pr-12"
      >
        <div className="pt-16 lg:pt-24">
          <div className="flex items-center gap-3">
            <Chevrons count={3} className="text-amber" animate />
            <span className="eyebrow text-surface-dark-foreground/80">
              Zanzibar, Tanzania · 6-8 November 2026
            </span>
          </div>

          {/* pt units mirror the Photoshop spec's native units: 135pt = 180px, 24pt = 32px */}
          <h1 className="font-hero-title mt-4 text-balance text-[3.35rem] font-semibold leading-[0.88] tracking-[-0.02em] text-surface-dark-foreground sm:text-7xl lg:text-[min(135pt,8vw)]">
            ZanziFit
            <span className="block text-amber lg:mt-1">Festival</span>
          </h1>

          <p className="font-hero-body mt-4 max-w-2xl text-pretty text-lg leading-snug text-surface-dark-foreground/75 lg:mt-4 lg:text-[24pt] lg:font-normal lg:leading-[1.25]">
            Where the ocean horizon meets the start line. Hybrid road-cycling
            and HYROX-style fitness on the coast of Zanzibar.
          </p>

          <div className="mt-6 lg:mt-6">
            <p className="eyebrow mb-3 text-surface-dark-foreground/55">Countdown to race day</p>
            <Countdown />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-6">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Join the Waitlist
              <Chevrons count={3} className="text-primary-foreground/80" animate />
            </Link>
            <Link
              href="/partnership"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-surface-dark-foreground/30 px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 z-10 hidden justify-center lg:flex">
        <div className="flex rotate-90 items-center gap-1 font-utility text-[0.65rem] uppercase tracking-[0.3em] text-surface-dark-foreground/45">
          <span className="-rotate-90">Scroll</span>
          <Chevrons count={3} className="text-amber" animate />
        </div>
      </div>
    </section>
  )
}
