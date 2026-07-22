'use client'

import { useState } from 'react'
import { Chevrons } from '@/components/chevrons'
import { validateField, type FieldError } from '@/lib/validation'

type Fields = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, FieldError>>

const FIELD =
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
const FIELD_INVALID = 'border-destructive focus:border-destructive'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState<Fields>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})

  function validate(field: keyof Fields, value: string): FieldError {
    if (field === 'name') return validateField('required', value, { label: 'Name' })
    if (field === 'email') return validateField('email', value, { label: 'Email' })
    if (field === 'message') return validateField('minLength', value, { label: 'Message', minLength: 10 })
    return null
  }

  function handleChange(field: keyof Fields, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validate(field, value) }))
  }

  function handleBlur(field: keyof Fields) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((e) => ({ ...e, [field]: validate(field, values[field]) }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {
      name: validate('name', values.name),
      email: validate('email', values.email),
      message: validate('message', values.message),
    }
    setErrors(nextErrors)
    setTouched({ name: true, email: true, message: true })
    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[]).find((k) => nextErrors[k])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }
    const subject = `Website enquiry from ${values.name}`
    const body = `${values.message}\n\n— ${values.name} (${values.email})`
    window.location.href = `mailto:info@zanzifit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-lg border border-amber/40 bg-background p-10 text-center">
        <Chevrons className="text-amber" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Message sent.</h3>
        <p className="mt-3 max-w-sm text-muted-foreground">
          Thanks for reaching out — we typically reply within two business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-border bg-background p-8">
      <label className="block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Name</span>
        <input
          id="contact-name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className={`${FIELD} ${errors.name ? FIELD_INVALID : ''}`}
          placeholder="Your name"
        />
        {errors.name ? <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.name}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Email</span>
        <input
          id="contact-email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={`${FIELD} ${errors.email ? FIELD_INVALID : ''}`}
          placeholder="you@email.com"
        />
        {errors.email ? <p id="contact-email-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Message</span>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${FIELD} ${errors.message ? FIELD_INVALID : ''}`}
          placeholder="How can we help?"
        />
        {errors.message ? <p id="contact-message-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.message}</p> : null}
      </label>
      <button
        type="submit"
        data-cursor-label="Send"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Send message <Chevrons />
      </button>
    </form>
  )
}
