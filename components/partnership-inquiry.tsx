'use client'

import { useState } from 'react'
import { Chevrons } from '@/components/chevrons'

const FIELD =
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'

export function PartnershipInquiry({ tiers }: { tiers: string[] }) {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-lg border border-amber/40 bg-background p-10 text-center">
        <Chevrons className="text-amber" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">Thank you.</h3>
        <p className="mt-3 max-w-sm text-muted-foreground">
          Your enquiry is in. Our partnerships team will be in touch within two business days with the full deck.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
      className="rounded-lg border border-border bg-background p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Name</span>
          <input required name="name" className={FIELD} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Company</span>
          <input required name="company" className={FIELD} placeholder="Company" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-utility text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Work email</span>
        <input required type="email" name="email" className={FIELD} placeholder="you@company.com" />
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
        <textarea name="message" rows={4} className={FIELD} placeholder="Tell us about your brand and goals." />
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-6 py-3.5 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Send enquiry <Chevrons />
      </button>
    </form>
  )
}
