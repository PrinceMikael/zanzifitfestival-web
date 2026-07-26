'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/**
 * Scroll-entrance wrapper. Replays every time a section crosses into view,
 * in either scroll direction, so the page feels equally alive scrolling
 * back up as it does scrolling down. Disabled under prefers-reduced-motion,
 * and content renders fully visible until the client has mounted, so a
 * failed or slow script never leaves the page hidden (server-rendered HTML
 * always ships in its final, visible state).
 */
const EASE_CONFIDENT = [0.16, 1, 0.3, 1] as const

const variants: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: EASE_CONFIDENT },
  },
}

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li'
}) {
  const reduce = useReducedMotion()
  const mounted = useMounted()
  const Component = as === 'li' ? motion.li : motion.div

  if (reduce || !mounted) {
    const Static = as === 'li' ? 'li' : 'div'
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.35 }}
      variants={variants}
      transition={{ duration: 0.85, ease: EASE_CONFIDENT, delay }}
    >
      {children}
    </Component>
  )
}

/**
 * Staggers direct children in as a group when they scroll into view — for
 * card grids and lists that should arrive as a set, not one by one via
 * manually-tuned delays.
 */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.08 },
  },
}

export function RevealGroup({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'ul'
}) {
  const reduce = useReducedMotion()
  const mounted = useMounted()
  const Component = as === 'ul' ? motion.ul : motion.div

  if (reduce || !mounted) {
    const Static = as === 'ul' ? 'ul' : 'div'
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
    >
      {children}
    </Component>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const reduce = useReducedMotion()
  const mounted = useMounted()
  const Component = as === 'li' ? motion.li : motion.div

  if (reduce || !mounted) {
    const Static = as === 'li' ? 'li' : 'div'
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  )
}
