'use client'

import { useState } from 'react'
import { Chevrons } from '@/components/chevrons'
import { validateField, type FieldError } from '@/lib/validation'

const CATEGORIES = [
  'Elite Road Race',
  'Open 60 km (Cycling)',
  'Community 20 km (Cycling)',
  'HYROX-Style — Elite',
  'HYROX-Style — Open',
  'HYROX-Style — Corporate Teams',
]

type Fields = { name: string; email: string; category: string }
type Errors = Partial<Record<'name' | 'email', FieldError>>

const FIELD =
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
const FIELD_INVALID = 'border-destructive focus:border-destructive'

export function RegisterForm() {
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState<Fields>({ name: '', email: '', category: CATEGORIES[0] })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({})

  function validate(field: 'name' | 'email', value: string): FieldError {
    if (field === 'name') return validateField('required', value, { label: 'Name' })
    return validateField('email', value, { label: 'Email' })
  }

  function handleChange(field: 'name' | 'email', value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validate(field, value) }))
  }

  function handleBlur(field: 'name' | 'email') {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((e) => ({ ...e, [field]: validate(field, values[field]) }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {
      name: validate('name', values.name),
      email: validate('email', values.email),
    }
    setErrors(nextErrors)
    setTouched({ name: true, email: true })
    const firstInvalid = (Object.keys(nextErrors) as ('name' | 'email')[]).find((k) => nextErrors[k])
    if (firstInvalid) {
      document.getElementById(`register-${firstInvalid}`)?.focus()
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-lg border border-amber/40 bg-background p-10 text-center">
        <Chevrons className="text-amber" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">You&apos;re on the list.</h3>
        <p className="mt-3 max-w-sm text-muted-foreground">
          We&apos;ll email you the moment registration opens for {values.category}, with pricing and category cutoffs.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-border bg-background p-8">
      <label className="block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Name</span>
        <input
          id="register-name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'register-name-error' : undefined}
          className={`${FIELD} ${errors.name ? FIELD_INVALID : ''}`}
          placeholder="Your name"
        />
        {errors.name ? <p id="register-name-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.name}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Email</span>
        <input
          id="register-email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          className={`${FIELD} ${errors.email ? FIELD_INVALID : ''}`}
          placeholder="you@email.com"
        />
        {errors.email ? <p id="register-email-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Category</span>
        <select
          value={values.category}
          onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
          className={FIELD}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        data-cursor-label="Notify me"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Register your interest <Chevrons />
      </button>
    </form>
  )
}
