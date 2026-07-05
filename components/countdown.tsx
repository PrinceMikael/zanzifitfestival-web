'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const EVENT_DATE = new Date('2026-11-06T08:00:00+03:00') // EAT

function diff() {
  const now = Date.now()
  const total = Math.max(0, EVENT_DATE.getTime() - now)
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const minutes = Math.floor((total % 3600000) / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

export function Countdown({ className }: { className?: string }) {
  const [time, setTime] = useState<ReturnType<typeof diff> | null>(null)

  useEffect(() => {
    setTime(diff())
    const id = setInterval(() => setTime(diff()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'Days', value: time?.days },
    { label: 'Hrs', value: time?.hours },
    { label: 'Min', value: time?.minutes },
    { label: 'Sec', value: time?.seconds },
  ]

  return (
    <div
      className={cn('flex items-stretch gap-2 sm:gap-3', className)}
      role="timer"
      aria-label="Countdown to ZanziFit Festival"
    >
      {units.map((u) => (
        <div
          key={u.label}
          className="flex min-w-[3.75rem] flex-col items-center rounded-sm border border-border bg-ink/60 px-2 py-2.5 backdrop-blur-sm sm:min-w-[4.5rem] sm:px-3"
        >
          <span className="font-utility text-2xl font-semibold tabular-nums text-ember sm:text-3xl">
            {u.value === undefined ? '––' : String(u.value).padStart(2, '0')}
          </span>
          <span className="mt-1 font-utility text-[0.6rem] uppercase tracking-[0.2em] text-bone/55">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  )
}
