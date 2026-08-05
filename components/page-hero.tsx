'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

const EASE_CONFIDENT = [0.16, 1, 0.3, 1] as const

export function PageHero({
  title,
  intro,
  image,
  children,
  voice = 'editorial',
}: {
  title: ReactNode
  intro?: string
  image?: { src: string; alt: string }
  children?: ReactNode
  // 'editorial' (default) is the sitewide Fraunces/Source-Serif-4 voice.
  // 'athletic' opts into Syne/IBM-Plex-Sans for competition-register
  // pages (Festival, HYROX-Style, Road Cycling) — see app/globals.css.
  voice?: 'editorial' | 'athletic'
}) {
  const reduce = useReducedMotion()
  // Server-rendered HTML always ships fully visible; animation only
  // engages once the client confirms it has mounted and can run it.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const animateIn = !reduce && mounted

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface-dark-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, var(--amber), transparent 45%), radial-gradient(circle at 85% 80%, var(--ink), transparent 50%)',
        }}
      />
      <div
        className={`relative mx-auto px-6 pb-16 pt-32 md:pb-24 md:pt-40 ${
          image ? 'max-w-7xl grid gap-12 md:grid-cols-2 md:items-center' : 'max-w-3xl text-center'
        }`}
      >
        <motion.div
          initial={animateIn ? { opacity: 0, y: 36 } : false}
          animate={animateIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE_CONFIDENT }}
        >
          <h1
            className={`font-semibold leading-[0.95] tracking-tight text-surface-dark-foreground text-balance ${
              voice === 'athletic' ? 'font-display-athletic' : 'font-display'
            } ${image ? 'max-w-4xl text-4xl md:text-6xl' : 'mx-auto text-5xl md:text-7xl'}`}
          >
            {title}
          </h1>
          {intro ? (
            <p
              className={`mt-6 text-lg leading-relaxed text-muted-foreground text-pretty ${
                voice === 'athletic' ? 'font-body-athletic' : ''
              } ${image ? 'max-w-2xl' : 'mx-auto max-w-2xl'}`}
            >
              {intro}
            </p>
          ) : null}
          {children ? (
            <div className={`mt-8 ${image ? '' : 'flex justify-center'}`}>{children}</div>
          ) : null}
        </motion.div>
        {image ? (
          <motion.div
            className="relative aspect-4/3 overflow-hidden rounded-lg border border-border"
            initial={animateIn ? { opacity: 0, scale: 0.94, y: 24 } : false}
            animate={animateIn ? { opacity: 1, scale: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_CONFIDENT }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
