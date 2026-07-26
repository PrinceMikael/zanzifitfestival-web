'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { validateField } from '@/lib/validation'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const runValidation = (value: string) =>
    validateField('email', value, { label: 'Email' })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setTouched(true)
        const err = runValidation(email)
        setError(err)
        if (err) return

        setSubmitting(true)
        try {
          const res = await fetch('/api/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kind: 'newsletter', email }),
          })
          if (!res.ok) {
            const data = await res.json().catch(() => null)
            throw new Error(data?.error ?? 'Something went wrong. Please try again.')
          }
          setDone(true)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        } finally {
          setSubmitting(false)
        }
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
          disabled={done || submitting}
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-email-error' : undefined}
          className="h-12 flex-1 rounded-sm border border-border bg-ink-soft px-4 text-sm text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-amber disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={done || submitting}
          data-cursor-label="Join"
          className="inline-flex h-12 items-center gap-2 rounded-sm bg-bone px-5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-amber disabled:cursor-default disabled:bg-ink-soft disabled:text-bone"
        >
          {done ? (
            <>
              Subscribed <Check className="size-4" />
            </>
          ) : submitting ? (
            'Joining…'
          ) : (
            <>
              Join <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
      {error ? (
        <p id="newsletter-email-error" role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  )
}
