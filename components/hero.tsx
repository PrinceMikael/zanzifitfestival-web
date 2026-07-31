'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

  // Depth layers move at different rates. Disabled for reduced-motion.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '60%'])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-surface-dark pt-16 lg:block lg:pt-0"
      aria-label="ZanziFit Festival hero"
    >
      {/* Layer 1 — Zanzibar aerial photograph (slowest) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/zanzibar-hero.jpg"
          alt="Aerial view of Stone Town's coastline in Zanzibar at golden hour, with dhow boats along the beach"
          fill
          priority
          sizes="100vw"
          className="scale-[1.08] object-cover object-[65%_60%]"
        />
      </motion.div>

      {/* Gradient scrim for text legibility — tuned to keep the photograph
          visible; strongest low and left where the text sits, clear
          elsewhere so the destination is still the star of the frame. */}
      <div className="absolute inset-0 bg-linear-to-t from-surface-dark/95 via-surface-dark/45 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-surface-dark/65 via-surface-dark/15 to-transparent" />

      {/* Layer 3 — foreground content (fastest, sharpest) */}
      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 will-change-transform sm:px-6 lg:px-8 lg:pb-20 lg:pt-[200px]"
      >
        <div className="max-w-3xl lg:max-w-none">
          <div className="flex items-center gap-3">
            <Chevrons count={3} className="text-amber" animate />
            <span className="eyebrow text-surface-dark-foreground/80">
              Zanzibar, Tanzania · 6-8 November 2026
            </span>
          </div>

          <h1 className="font-hero-title mt-6 text-balance text-[3.35rem] font-semibold leading-[0.95] tracking-[-0.02em] text-surface-dark-foreground sm:text-7xl lg:text-[180px] lg:leading-[180px]">
            ZanziFit
            <span className="block text-amber lg:mt-[25px]">Festival</span>
          </h1>

          <p className="font-hero-body mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/75 lg:mt-10 lg:max-w-2xl lg:text-[32px] lg:font-normal lg:leading-relaxed">
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
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <div className="flex rotate-90 items-center gap-1 font-utility text-[0.65rem] uppercase tracking-[0.3em] text-surface-dark-foreground/45">
          <span className="-rotate-90">Scroll</span>
          <Chevrons count={3} className="text-amber" animate />
        </div>
      </div>
    </section>
  )
}
