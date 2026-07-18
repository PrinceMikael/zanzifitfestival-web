'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(fine && !reduced)
  }, [])

  useEffect(() => {
    if (!enabled) return

    function onMove(e: MouseEvent) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor-label]') as HTMLElement | null
      if (interactive) {
        setActive(true)
        setLabel(interactive.getAttribute('data-cursor-label'))
      } else {
        setActive(false)
        setLabel(null)
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      <div
        className={`flex items-center justify-center rounded-full border border-amber bg-ink/40 shadow-[0_0_0_1.5px_rgba(237,231,216,0.9)] backdrop-blur-sm transition-all duration-200 ease-out ${
          active ? 'h-16 w-16 border-amber' : 'h-3 w-3 border-transparent bg-amber'
        }`}
      >
        {label ? (
          <span className="font-utility text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-bone">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}
