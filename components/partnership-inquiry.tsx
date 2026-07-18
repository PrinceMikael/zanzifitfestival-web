'use client'

import { useState } from 'react'
import { Chevrons } from '@/components/chevrons'
import { validateField, type FieldError } from '@/lib/validation'

type Fields = { name: string; company: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, FieldError>>

const FIELD =
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
const FIELD_INVALID = 'border-destructive focus:border-destructive'

export function PartnershipInquiry({ tiers }: { tiers: string[] }) {
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState<Fields>({ name: '', company: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})

  function validate(field: keyof Fields, value: string): FieldError {
    if (field === 'email') return validateField('email', value, { label: 'Work email' })
    if (field === 'name') return validateField('required', value, { label: 'Name' })
    if (field === 'company') return validateField('required', value, { label: 'Company' })
    return null // message is optional
  }

  function handleChange(field: keyof Fields, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: validate(field, value) }))
    }
  }

  function handleBlur(field: keyof Fields) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((e) => ({ ...e, [field]: validate(field, values[field]) }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {
      name: validate('name', values.name),
      company: validate('company', values.company),
      email: validate('email', values.email),
    }
    setErrors(nextErrors)
    setTouched({ name: true, company: true, email: true, message: true })
    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[]).find((k) => nextErrors[k])
    if (firstInvalid) {
      document.getElementById(`inquiry-${firstInvalid}`)?.focus()
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-lg border border-amber/40 bg-background p-10 text-center">
        <Chevrons className="text-amber" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Thank you.</h3>
        <p className="mt-3 max-w-sm text-muted-foreground">
          Your enquiry is in. Our partnerships team will be in touch within two business days with the full deck.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-border bg-background p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Name</span>
          <input
            id="inquiry-name"
            name="name"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
            className={`${FIELD} ${errors.name ? FIELD_INVALID : ''}`}
            placeholder="Your name"
          />
          {errors.name ? <p id="inquiry-name-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.name}</p> : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Company</span>
          <input
            id="inquiry-company"
            name="company"
            value={values.company}
            onChange={(e) => handleChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? 'inquiry-company-error' : undefined}
            className={`${FIELD} ${errors.company ? FIELD_INVALID : ''}`}
            placeholder="Company"
          />
          {errors.company ? <p id="inquiry-company-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.company}</p> : null}
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Work email</span>
        <input
          id="inquiry-email"
          type="email"
          name="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'inquiry-email-error' : undefined}
          className={`${FIELD} ${errors.email ? FIELD_INVALID : ''}`}
          placeholder="you@company.com"
        />
        {errors.email ? <p id="inquiry-email-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Tier of interest</span>
        <select name="tier" className={FIELD} defaultValue={tiers[0]}>
          {tiers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Message</span>
        <textarea
          id="inquiry-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={FIELD}
          placeholder="Tell us about your brand and goals."
        />
      </label>
      <button
        type="submit"
        data-cursor-label="Send"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Send enquiry <Chevrons />
      </button>
    </form>
  )
}
