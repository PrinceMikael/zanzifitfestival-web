'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { validateField } from '@/lib/validation'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)

  const runValidation = (value: string) =>
    validateField('email', value, { label: 'Email' })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        const err = runValidation(email)
        setError(err)
        if (err) return
        // Front-end only for now — wire to a mailing provider later.
        setDone(true)
      }}
      noValidate
      className="mt-6 max-w-md"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (touched) setError(runValidation(e.target.value))
          }}
          onBlur={() => {
            setTouched(true)
            setError(runValidation(email))
          }}
          placeholder="you@email.com"
          disabled={done}
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-email-error' : undefined}
          className="h-12 flex-1 rounded-sm border border-border bg-ink-soft px-4 text-sm text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-amber disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={done}
          data-cursor-label="Join"
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
      </div>
      {error ? (
        <p id="newsletter-email-error" role="alert" className="mt-2 text-xs text-ember">
          {error}
        </p>
      ) : null}
    </form>
  )
}
