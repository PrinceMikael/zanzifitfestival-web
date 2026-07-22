'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Chevrons } from '@/components/chevrons'
import { Countdown } from '@/components/countdown'
import { HorizonLayer } from '@/components/hero-art'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Depth layers move at different rates. Disabled for reduced-motion.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '38%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '60%'])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-surface-dark pt-16 lg:pt-20"
      aria-label="ZanziFit Festival hero"
    >
      {/* Layer 1 — horizon + sails + palms (slowest) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <HorizonLayer />
      </motion.div>

      {/* Layer 2 — HYROX athlete silhouette (medium) */}
      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center will-change-transform"
        aria-hidden="true"
      >
        <AthleteSilhouette className="h-[42vh] w-auto max-w-none translate-y-[8%] text-ink/85 sm:h-[52vh]" />
      </motion.div>

      {/* Gradient scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/45 to-surface-dark/20" />

      {/* Layer 3 — foreground content (fastest, sharpest) */}
      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 will-change-transform sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <Chevrons count={3} className="text-amber" animate />
            <span className="eyebrow text-surface-dark-foreground/80">
              Zanzibar, Tanzania · 6 November 2026
            </span>
          </div>

          <h1 className="mt-6 text-balance font-display text-[3.35rem] font-semibold leading-[0.95] tracking-[-0.02em] text-surface-dark-foreground sm:text-7xl lg:text-[6.5rem]">
            ZanziFit
            <br />
            <span className="text-amber">Festival</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/75 lg:text-xl">
            Where the ocean horizon meets the start line. A hybrid road-cycling
            and HYROX-style functional fitness festival on the coast of
            Zanzibar.
          </p>

          <div className="mt-8">
            <p className="eyebrow mb-3 text-surface-dark-foreground/55">Countdown to race day</p>
            <Countdown />
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Register Your Category
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
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <div className="flex rotate-90 items-center gap-1 font-utility text-[0.65rem] uppercase tracking-[0.3em] text-surface-dark-foreground/45">
          <span className="-rotate-90">Scroll</span>
          <Chevrons count={3} className="text-amber" animate />
        </div>
      </div>
    </section>
  )
}

function AthleteSilhouette({ className }: { className?: string }) {
  // Flat HYROX sled-pull silhouette — graphic, composites over the horizon.
  return (
    <svg viewBox="0 0 420 260" className={className} fill="currentColor">
      {/* sled */}
      <rect x="12" y="212" width="86" height="20" rx="2" />
      <rect x="30" y="176" width="10" height="40" />
      <rect x="70" y="176" width="10" height="40" />
      {/* rope */}
      <path
        d="M96 196 L214 150"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      {/* athlete leaning into the pull */}
      <path d="M300 232 l-26 -70 l14 -6 l30 60 z" />
      <path d="M250 236 l-22 -58 l16 -8 l26 52 z" />
      <path d="M236 176 c-6 -30 6 -58 30 -70 l30 40 c-16 8 -26 26 -24 44 z" />
      <path d="M296 108 l40 30 -12 16 -44 -26 z" />
      <path d="M270 116 l-58 30 -8 -14 56 -34 z" />
      <circle cx="288" cy="78" r="22" />
    </svg>
  )
}
