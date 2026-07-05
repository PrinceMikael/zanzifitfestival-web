'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!email) return
        // Front-end only for now — wire to a mailing provider later.
        setDone(true)
      }}
      className="mt-6 flex max-w-md items-center gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        disabled={done}
        className="h-12 flex-1 rounded-sm border border-border bg-ink-soft px-4 text-sm text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-amber disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={done}
        className="inline-flex h-12 items-center gap-2 rounded-sm bg-bone px-5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-amber disabled:cursor-default disabled:bg-deep-teal disabled:text-bone"
      >
        {done ? (
          <>
            Subscribed <Check className="size-4" />
          </>
        ) : (
          <>
            Join <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  )
}
