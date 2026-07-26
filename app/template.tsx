'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  // Server-rendered HTML must ship fully visible: if this gated on
  // animate-on-mount alone, a failed or slow script would leave every
  // page permanently at opacity:0. Only animate once React confirms the
  // client is actually running.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (reduce || !mounted) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
