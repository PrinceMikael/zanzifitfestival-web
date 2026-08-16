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
      className="relative flex min-h-[500px] flex-col overflow-hidden bg-black lg:min-h-svh"
      aria-label="ZanziFit Festival hero"
    >
      {/* Full-bleed background photo. Unlike the previous cutout asset,
          this is a genuine wide (16:9-ish) photo with the subject already
          positioned right-of-center and dark on the left — suited to a
          true background treatment with text over it. */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-battle-ropes-bg.webp"
          alt="A ZanziFit athlete mid-effort on battle ropes during a HYROX-style functional fitness session"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_30%]"
        />
      </motion.div>

      {/* Scrim — strongest low and left where the text sits, so the photo
          stays visible on the right without fighting text legibility. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />

      {/* Content — outer element handles the full-bleed safe-zone padding;
          inner element caps the reading column at 1600px and centers it,
          so on ultra-wide/zoomed-out viewports (4K, wide monitors) the
          text stops pinning to the physical left edge with a growing dead
          zone to the right. Below a 1600px-wide viewport this is a no-op
          (the cap never engages) so normal desktop/laptop layout is
          unchanged. lg:items-center vertically centers the stack within
          the section (which sets its own lg:min-h-svh floor); the section
          is flex-col so this motion.div only ever grows to the content's
          natural height plus that floor — it can't force extra space that
          would push the stack off-screen on a short viewport the way a
          hard 100%-height flex-center container would. */}
      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className="relative z-10 flex w-full flex-1 pb-12 will-change-transform lg:py-0 px-6 sm:px-10 lg:px-12 xl:px-16 lg:items-center"
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="pt-20 sm:pt-24 lg:pt-0">
            <h1 className="font-hero-title text-balance text-[2.75rem] font-bold leading-[0.95] tracking-[-0.02em] text-surface-dark-foreground sm:text-7xl lg:text-[clamp(6rem,8.08vw,10rem)]">
              ZanziFit
              <span className="block text-amber lg:mt-1">Festival</span>
            </h1>

            <p className="font-hero-subhead font-medium mt-6 max-w-2xl text-pretty text-base leading-relaxed text-surface-dark-foreground/75 sm:mt-4 sm:text-lg sm:leading-snug lg:mt-4 lg:text-[clamp(1.25rem,1.4vw,1.75rem)] lg:leading-tight">
              Where the ocean horizon meets the start line. Hybrid road-cycling
              and HYROX-style fitness on the coast of Zanzibar.
            </p>

            <div className="mt-9 sm:mt-6 lg:mt-8">
              <p className="eyebrow mb-3 text-surface-dark-foreground/55">Countdown to race day</p>
              <Countdown className="lg:gap-4" />
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:items-center sm:gap-3 lg:mt-8 lg:gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5 lg:px-9 lg:py-5 lg:text-base"
              >
                Join the Waitlist
                <Chevrons count={3} className="text-primary-foreground/80" animate />
              </Link>
              <Link
                href="/partnership"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-surface-dark-foreground/30 px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber lg:px-9 lg:py-5 lg:text-base"
              >
                Become a Partner
              </Link>
            </div>
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
