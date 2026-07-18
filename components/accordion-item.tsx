'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-cursor-label={open ? 'Close' : 'Open'}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-display text-lg font-semibold text-surface-dark-foreground sm:text-xl">{question}</span>
        <ChevronDown
          className={`size-5 shrink-0 text-amber transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <p className="pb-6 pr-10 text-pretty leading-relaxed text-muted-foreground">{answer}</p>
      ) : null}
    </div>
  )
}
