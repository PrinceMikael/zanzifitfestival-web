# ZanziFit Festival — Team Accuracy, Missing Pages, Interactivity & Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the Leadership page to show the real board from the company profile, build the four missing pages (Gallery, FAQ, Contact, Register) that are currently 404, add real client-side form validation across all forms, add a custom-cursor interactivity layer, and add a manual light/dark theme toggle — all matching the existing design system in `app/globals.css`.

**Architecture:** Next.js 16 App Router site, no backend. Each new page is a server component (`page.tsx`) composing existing patterns (`PageHero`, `SectionHeading`, `Chevrons`) plus new small client components where interactivity is needed (forms, accordion, cursor, theme toggle). Theme switching works by adding a second CSS custom-property block scoped to `[data-theme="light"]` in `app/globals.css`, toggled via a `data-theme` attribute on `<html>` managed by a small client-side `ThemeProvider`/`ThemeToggle` pair — no per-component rewrites needed except the two logo `invert` classes and one `tone` prop reconciliation.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 (CSS-variable theme, no `tailwind.config` — see `components.json`: `"tailwind": { "config": "" }`), Framer Motion (already a dependency, used for the cursor), lucide-react icons. No new dependencies are added.

## Global Constraints

- Do not introduce a form library (react-hook-form, zod, etc.) — the spec calls for a small shared plain-function validator (`lib/validation.ts`), not a new dependency.
- Do not fabricate facts not in the source profile (`Zanzifit Festival Profile Presentation.pdf`) or blueprint (`ZanziFit_Festival_Website_Blueprint.md`) — bios, FAQ answers, and placeholder copy must read as clearly generic/placeholder, not as invented specific facts (named employers, years of experience, specific visa rules).
- All new pages must use the existing design tokens (`bg-ink`, `text-bone`, `bg-amber`, `border-border`, `font-display`, `font-utility`, the `Chevrons` motif) — no new colors introduced.
- Cursor interactivity must be gated behind `@media (hover: hover) and (pointer: fine)` and must respect `prefers-reduced-motion` — never breaks touch/mobile behavior.
- Theme toggle must persist to `localStorage` and default to `prefers-color-scheme` on first visit, per approved spec addendum.
- Every new/modified page must return `200` when the dev server is running (`pnpm dev`, confirmed working via `npx pnpm@10 dev` in this environment) — verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/<route>` after each page task (port may vary; check the dev server's own log for the actual port, since 3000 was occupied earlier this session).
- Reuse existing category names already defined in `app/festival/page.tsx` (`Elite Road Race`, `Open 60 km`, `Community 20 km`, `Elite`, `Open`, `Corporate Teams`) wherever Register references disciplines/categories — do not invent new category names.

---

## File Structure

**New files:**
- `public/images/leadership/ally-daudi.jpg`, `salim-kikeke.jpg`, `hassan-mussa.jpg`, `mohamed-sharif.jpg`, `hassan-ali.jpg`, `walter-mwach.jpg` — real board portraits, cropped from the profile PDF.
- `lib/validation.ts` — shared plain-function field validators used by all four forms.
- `components/accordion-item.tsx` — small disclosure component for FAQ.
- `components/custom-cursor.tsx` — the morphing cursor, mounted once in `app/layout.tsx`.
- `components/theme-toggle.tsx` — sun/moon button, mounted in `SiteHeader`.
- `components/theme-script.tsx` — tiny inline script (via `next/script` `beforeInteractive`) that reads `localStorage`/`prefers-color-scheme` and sets `data-theme` on `<html>` before paint, avoiding a flash of wrong theme.
- `components/contact-form.tsx` — validated contact form (Contact page).
- `components/register-form.tsx` — validated category-interest form (Register page).
- `components/faq-accordion.tsx` — client wrapper rendering a list of `AccordionItem`s.
- `app/gallery/page.tsx`
- `app/faq/page.tsx`
- `app/contact/page.tsx`
- `app/register/page.tsx`

**Modified files:**
- `app/leadership/page.tsx` — real 6-person `TEAM` array, real photos, drop fabricated `ADVISORS`.
- `app/globals.css` — add `[data-theme="light"]` token block.
- `app/layout.tsx` — mount `ThemeScript` and `CustomCursor`.
- `components/site-header.tsx` — add `ThemeToggle`, make logo `invert` conditional on theme.
- `components/site-footer.tsx` — make logo `invert` conditional on theme.
- `components/newsletter-form.tsx` — wire to shared validators.
- `components/partnership-inquiry.tsx` — wire to shared validators.
- `components/section-heading.tsx` — no functional change expected, verified during Task 8 (theme visual QA); only touched if the `tone` prop needs reconciling with theme.

---

## Task 1: Extract and finalize real leadership photos

**Files:**
- Create: `public/images/leadership/ally-daudi.jpg`
- Create: `public/images/leadership/salim-kikeke.jpg`
- Create: `public/images/leadership/hassan-mussa.jpg`
- Create: `public/images/leadership/mohamed-sharif.jpg`
- Create: `public/images/leadership/hassan-ali.jpg`
- Create: `public/images/leadership/walter-mwach.jpg`

**Interfaces:**
- Produces: 6 JPEG files, each a clean headshot crop (no rounded-corner card frame, no background chevron/orange-line artifacts from the source deck), roughly portrait-oriented (any aspect is fine — Task 6's `<Image fill className="object-cover">` handles cropping to the `aspect-[4/5]` card).

- [ ] **Step 1: Render the profile PDF's leadership page at high resolution**

The PDF is at `Zanzifit Festival Profile Presentation.pdf` in the project root (10 pages; leadership team is page 7, "Meet Our Leadership Team", showing 6 named board members in order: Ally Daudi, Salim Kikeke, Hassan Mussa, Mohamed Sharif, Hassan Ali, Walter Mwach).

Run (adjust the python executable path if PyMuPDF is not yet installed — install via `pip install pymupdf` first if the import fails):

```bash
python3 -c "
import fitz
doc = fitz.open('Zanzifit Festival Profile Presentation.pdf')
pix = doc[6].get_pixmap(dpi=300)
pix.save('leadership_page_hires.png')
print(pix.width, pix.height)
"
```

Expected output: two integers (width, height) — a PNG roughly 6000x3376 or similar (300 DPI render of a 20"x11.25" page).

- [ ] **Step 2: Crop each of the 6 portraits from the high-res render**

Using the layout confirmed visually (6 cards left-to-right in reading order matching the names above, each portrait occupying roughly the top third of its card, centered), crop generously around each face — include some margin since these get `object-cover` treatment later, but exclude the card's rounded-corner black frame and any chevron/orange-line decorative elements bleeding in from neighboring cards.

```python
from PIL import Image

src = Image.open('leadership_page_hires.png')
W, H = src.size

# Fractional boxes (left, top, right, bottom) as a fraction of page width/height —
# tune these against the actual render; verify each crop visually before finalizing.
names_boxes = [
    ('ally-daudi',     (0.038, 0.295, 0.112, 0.400)),
    ('salim-kikeke',   (0.133, 0.295, 0.213, 0.400)),
    ('hassan-mussa',   (0.235, 0.293, 0.313, 0.400)),
    ('mohamed-sharif', (0.337, 0.290, 0.407, 0.400)),
    ('hassan-ali',     (0.428, 0.288, 0.507, 0.397)),
    ('walter-mwach',   (0.530, 0.295, 0.610, 0.400)),
]

for name, (l, t, r, b) in names_boxes:
    box = (int(l * W), int(t * H), int(r * W), int(b * H))
    crop = src.crop(box)
    crop.save(f'public/images/leadership/{name}.jpg', quality=90)
    print(name, crop.size)
```

Run it, then open each saved file and visually confirm: correct person, no visible black rounded-frame border, no neighboring-card bleed. Adjust the fractional box for any that are off and re-run before moving on — do not proceed with a misaligned crop.

- [ ] **Step 3: Verify all 6 files exist and are non-trivial in size**

```bash
ls -la public/images/leadership/
```

Expected: 6 `.jpg` files, each at least a few KB (not empty/corrupt).

- [ ] **Step 4: Commit**

```bash
git add public/images/leadership/
git commit -m "Add real leadership board photos extracted from company profile"
```

---

## Task 2: Fix Leadership page with real board data

**Files:**
- Modify: `app/leadership/page.tsx`

**Interfaces:**
- Consumes: the 6 image files from Task 1 at `/images/leadership/<name>.jpg`.
- Produces: no exports consumed elsewhere — this is a leaf page.

- [ ] **Step 1: Replace the `TEAM` and remove the `ADVISORS` arrays**

Replace lines 13–45 of `app/leadership/page.tsx` (the current fabricated `TEAM` and `ADVISORS` constants) with:

```tsx
const TEAM = [
  {
    name: 'Ally Daudi',
    role: 'Founder & Executive Director',
    image: '/images/leadership/ally-daudi.jpg',
    bio: 'Founder of ZanziFit Festival, driving the vision to bring a world-class endurance sports platform to East Africa.',
  },
  {
    name: 'Salim Kikeke',
    role: 'Chairman of the Board',
    image: '/images/leadership/salim-kikeke.jpg',
    bio: 'Chairs the ZanziFit board, guiding the festival’s governance and long-term strategic direction.',
  },
  {
    name: 'Hassan Mussa',
    role: 'Project Manager & Board Member',
    image: '/images/leadership/hassan-mussa.jpg',
    bio: 'Oversees festival project delivery, coordinating the operational work that turns the event plan into race day.',
  },
  {
    name: 'Mohamed Sharif',
    role: 'Director & Board Member',
    image: '/images/leadership/mohamed-sharif.jpg',
    bio: 'Contributes to board-level direction and oversight across the festival’s core operations.',
  },
  {
    name: 'Hassan Ali',
    role: 'Director & Board Member',
    image: '/images/leadership/hassan-ali.jpg',
    bio: 'Contributes to board-level direction and oversight across the festival’s core operations.',
  },
  {
    name: 'Walter Mwach',
    role: 'Board Secretary',
    image: '/images/leadership/walter-mwach.jpg',
    bio: 'Maintains board governance records and supports the formal decision-making process behind the festival.',
  },
]
```

Note: bios are intentionally short and generic (per approved spec) since the source profile gives titles only, no biographical text — these are clearly placeholder-quality and easy for the client to replace with real copy.

- [ ] **Step 2: Update the grid layout for 6 people instead of 4**

Find this line (currently targeting a 4-column max layout):

```tsx
<div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
```

Replace with a layout that reads well at 6 items — 2 columns on mobile, 3 on tablet, 3 on desktop (2 rows of 3, avoiding a single cramped row of 6):

```tsx
<div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
```

- [ ] **Step 3: Replace the fabricated "Advisory & partners" section**

Find this whole block (the second `<section>` in the file, currently mapping over `ADVISORS`):

```tsx
      <section className="border-t border-border bg-ink-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Advisory & partners" title="Backed by the right expertise." />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {ADVISORS.map((a) => (
              <li key={a} className="flex items-center gap-3 rounded-sm border border-border bg-background px-5 py-4 text-bone">
                <Chevrons className="shrink-0 text-amber" count={1} />
                <span className="text-sm leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
```

Replace with an honest "Board & Governance" note — no invented advisor list:

```tsx
      <section className="border-t border-border bg-ink-soft py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeading
            eyebrow="Governance"
            title="One board, full accountability."
            align="center"
          />
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            The six leaders above make up ZanziFit Festival&apos;s complete governing board —
            there is no separate advisory layer. As the festival grows, formal advisory and
            sanctioning partnerships (destination, sporting, medical) will be announced here.
          </p>
        </div>
      </section>
```

- [ ] **Step 4: Start the dev server and verify the page**

If not already running:

```bash
npx pnpm@10 dev
```

Check the dev server output for the actual port (it fell back to 3001 earlier this session because 3000 was occupied), then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/leadership
curl -s http://localhost:3001/leadership | grep -o "Ally Daudi\|Salim Kikeke\|Hassan Mussa\|Mohamed Sharif\|Hassan Ali\|Walter Mwach"
```

Expected: `200`, and all 6 real names present in the output. Also grep to confirm the old fabricated names are gone:

```bash
curl -s http://localhost:3001/leadership | grep -o "Juma Salim\|Amina Rashid\|David Okoth\|Sofia Mbwana"
```

Expected: no output (empty match).

- [ ] **Step 5: Commit**

```bash
git add app/leadership/page.tsx
git commit -m "Replace fabricated leadership team with real board from company profile"
```

---

## Task 3: Shared form validation helper

**Files:**
- Create: `lib/validation.ts`

**Interfaces:**
- Produces: `isValidEmail(value: string): boolean`, `isValidPhone(value: string): boolean`, `isRequired(value: string): boolean`, `type FieldError = string | null`, `validateField(kind: 'email' | 'phone' | 'required' | 'minLength', value: string, opts?: { minLength?: number }): FieldError` — a single dispatch function later tasks call per-field, returning a human-readable error string or `null` if valid.
- Consumed by: Task 4 (newsletter), Task 5 (partnership inquiry), Task 9 (contact form), Task 10 (register form).

- [ ] **Step 1: Write the validators**

```typescript
// lib/validation.ts

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d+]/g, '')
  return digits.length >= 7
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export type FieldError = string | null

export function validateField(
  kind: 'email' | 'phone' | 'required' | 'minLength',
  value: string,
  opts?: { minLength?: number; label?: string },
): FieldError {
  const label = opts?.label ?? 'This field'

  if (kind === 'required') {
    return isRequired(value) ? null : `${label} is required.`
  }
  if (kind === 'email') {
    if (!isRequired(value)) return `${label} is required.`
    return isValidEmail(value) ? null : 'Enter a valid email address.'
  }
  if (kind === 'phone') {
    if (!isRequired(value)) return `${label} is required.`
    return isValidPhone(value) ? null : 'Enter a valid phone number.'
  }
  if (kind === 'minLength') {
    const min = opts?.minLength ?? 1
    if (!isRequired(value)) return `${label} is required.`
    return value.trim().length >= min
      ? null
      : `${label} must be at least ${min} characters.`
  }
  return null
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit -p tsconfig.json
```

Expected: no errors referencing `lib/validation.ts`. (Pre-existing unrelated errors elsewhere, if any, are not this task's concern — only confirm no new errors from this file.)

- [ ] **Step 3: Commit**

```bash
git add lib/validation.ts
git commit -m "Add shared form field validation helpers"
```

---

## Task 4: Add validation to Newsletter form

**Files:**
- Modify: `components/newsletter-form.tsx`

**Interfaces:**
- Consumes: `validateField` from `lib/validation.ts` (Task 3).

- [ ] **Step 1: Rewrite the component with validation state**

Replace the full contents of `components/newsletter-form.tsx`:

```tsx
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
```

- [ ] **Step 2: Visually verify in the browser**

With the dev server running, navigate to the home page footer, type an invalid email (e.g. `notanemail`), blur the field, and confirm an error message appears in ember/red text. Then correct it and submit — confirm the "Subscribed" success state appears.

- [ ] **Step 3: Commit**

```bash
git add components/newsletter-form.tsx
git commit -m "Add real-time validation to newsletter form"
```

---

## Task 5: Add validation to Partnership Inquiry form

**Files:**
- Modify: `components/partnership-inquiry.tsx`

**Interfaces:**
- Consumes: `validateField` from `lib/validation.ts` (Task 3).
- Consumes: `tiers: string[]` prop (unchanged from current signature).

- [ ] **Step 1: Rewrite with field-level validation state**

Replace the full contents of `components/partnership-inquiry.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Chevrons } from '@/components/chevrons'
import { validateField, type FieldError } from '@/lib/validation'

type Fields = { name: string; company: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, FieldError>>

const FIELD =
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
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
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">Thank you.</h3>
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
```

- [ ] **Step 2: Visually verify on the Partnership page**

Navigate to `/partnership`, scroll to the inquiry form, submit empty — confirm Name/Company/Email show errors and focus jumps to Name. Fill invalid email — confirm the email-specific error shows. Fill everything validly and submit — confirm the "Thank you" state replaces the form.

- [ ] **Step 3: Commit**

```bash
git add components/partnership-inquiry.tsx
git commit -m "Add real-time validation to partnership inquiry form"
```

---

## Task 6: Build the Gallery page

**Files:**
- Create: `app/gallery/page.tsx`

**Interfaces:**
- Consumes: `GalleryGrid` from `components/gallery-grid.tsx` (already exists, unused until now — no changes needed to it).
- Consumes: `PageHero`, `SectionHeading` (existing).

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { GalleryGrid } from '@/components/gallery-grid'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos from ZanziFit Festival — road cycling, HYROX-style competition, and the festival village on the Zanzibar coast.',
}

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title={<>The horizon, in motion.</>}
        intro="Road cycling, HYROX-style competition, and the festival village along the Fumba peninsula — filter by discipline below."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <GalleryGrid />
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Fix the missing image reference in `GalleryGrid`**

`components/gallery-grid.tsx` references `/images/hero-poster.png` (line 14) which does not exist in `public/images/` (confirmed: only `cycling.png`, `festival-village.png`, `finish-line.png`, `hyrox-arena.png`, `leader-1..4.png`, `zanzibar-coast.png` exist). Fix this broken reference:

In `components/gallery-grid.tsx`, change:

```tsx
  { src: '/images/hero-poster.png', alt: 'The ZanziFit start line at dawn', tag: 'Moments' },
```

to:

```tsx
  { src: '/images/finish-line.png', alt: 'The ZanziFit start line at dawn', tag: 'Moments' },
```

(Reuses an existing real image rather than a 404'ing placeholder path — `finish-line.png` is already used elsewhere for a similar "Moments" context in `app/about/page.tsx`.)

- [ ] **Step 3: Verify the page renders with no broken images**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/gallery
```

Expected: `200`. Then open `/gallery` in a browser, click through each filter tab (All, Cycling, HYROX, Festival, Destination, Moments), and confirm every image loads (no broken-image icons).

- [ ] **Step 4: Commit**

```bash
git add app/gallery/page.tsx components/gallery-grid.tsx
git commit -m "Add Gallery page, wire up existing GalleryGrid component"
```

---

## Task 7: Build the FAQ page with accordion

**Files:**
- Create: `components/accordion-item.tsx`
- Create: `components/faq-accordion.tsx`
- Create: `app/faq/page.tsx`

**Interfaces:**
- Produces: `AccordionItem({ question, answer }: { question: string; answer: string })` — single disclosure item.
- Produces: `FaqAccordion({ items }: { items: { question: string; answer: string }[] })` — renders a list of `AccordionItem`.

- [ ] **Step 1: Write `AccordionItem`**

```tsx
// components/accordion-item.tsx
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
        <span className="font-display text-lg font-semibold text-bone sm:text-xl">{question}</span>
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
```

- [ ] **Step 2: Write `FaqAccordion`**

```tsx
// components/faq-accordion.tsx
import { AccordionItem } from '@/components/accordion-item'

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item) => (
        <AccordionItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Write the FAQ page**

Content covers travel/visa/accommodation/spectator topics per the blueprint sitemap (item 9). These are placeholder-quality general answers (no invented specific visa policy or named hotel partners) flagged for client fact-check:

```tsx
// app/faq/page.tsx
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { FaqAccordion } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Travel, visas, accommodation and spectator information for ZanziFit Festival, 6 November 2026, Fumba Town, Zanzibar.',
}

const FAQS = [
  {
    question: 'How do I get to Zanzibar?',
    answer:
      'Zanzibar is served by Abeid Amani Karume International Airport (ZNZ), with regular connections via mainland Tanzania and regional hubs. Fumba Town, the festival venue, is roughly 30–45 minutes from the airport by road — exact transfer options will be published closer to race day.',
  },
  {
    question: 'Do I need a visa to travel to Tanzania?',
    answer:
      'Visa requirements depend on your nationality. Most visitors can obtain a visa on arrival or apply online in advance; check Tanzania’s official immigration guidance for your specific country before booking travel. This section will be updated with festival-specific guidance once confirmed.',
  },
  {
    question: 'Where should I stay?',
    answer:
      'Fumba Town and the wider Zanzibar coast offer accommodation from beach resorts to guesthouses. Recommended accommodation partners and athlete rate codes will be announced ahead of the registration window.',
  },
  {
    question: 'What should I bring?',
    answer:
      'Race-day kit for your discipline (bike and gear for cycling, training kit for HYROX-style events), sun protection, reef-safe sunscreen, and light clothing for the coastal climate. A detailed athlete kit list will be shared with confirmed entrants.',
  },
  {
    question: 'Can I come just to watch?',
    answer:
      'Yes — ZanziFit welcomes spectators. Course-side viewing areas, the festival village, and the finish-line zone are open to the public across the race weekend. Spectator schedules will be published alongside the full race-day program.',
  },
]

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title={<>Everything before the start line.</>}
        intro="Travel, visas, accommodation and what to expect as a spectator — the practical details for race weekend."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <FaqAccordion items={FAQS} />
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/faq
```

Expected: `200`. In the browser, click each question and confirm it expands/collapses with the chevron rotating.

- [ ] **Step 5: Commit**

```bash
git add components/accordion-item.tsx components/faq-accordion.tsx app/faq/page.tsx
git commit -m "Add FAQ page with accordion component"
```

---

## Task 8: Build the Contact page with validated form

**Files:**
- Create: `components/contact-form.tsx`
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `validateField` from `lib/validation.ts` (Task 3).

- [ ] **Step 1: Write the validated contact form**

Follows the same field-level validation pattern established in Task 5:

```tsx
// components/contact-form.tsx
'use client'

import { useState } from 'react'
import { Chevrons } from '@/components/chevrons'
import { validateField, type FieldError } from '@/lib/validation'

type Fields = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, FieldError>>

const FIELD =
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
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
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-lg border border-amber/40 bg-background p-10 text-center">
        <Chevrons className="text-amber" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">Message sent.</h3>
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
```

- [ ] **Step 2: Write the Contact page**

Uses the real contact details confirmed from the profile PDF page 10 (`info@zanzifitfestival.com`, `+255 686 915 587`, Fumba Town, Zanzibar):

```tsx
// app/contact/page.tsx
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with ZanziFit Festival — Fumba Town, Zanzibar.',
}

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to the team.</>}
        intro="Questions about the festival, your category, or partnering with us — reach out and we'll get back to you."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Get in touch" title="We're based in Fumba Town." align="left" />
            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-3">
                <Chevrons className="text-amber" count={1} />
                info@zanzifitfestival.com
              </p>
              <p className="flex items-center gap-3">
                <Chevrons className="text-amber" count={1} />
                +255 686 915 587
              </p>
              <p className="flex items-center gap-3">
                <Chevrons className="text-amber" count={1} />
                Fumba Town, Zanzibar, Tanzania
              </p>
              <p className="flex items-center gap-3">
                <Chevrons className="text-amber" count={1} />
                <a
                  href="https://wa.me/255686915587"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Chat"
                  className="transition-colors hover:text-amber"
                >
                  Message us on WhatsApp
                </a>
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/contact
```

Expected: `200`. In the browser, test the form's empty-submit error state, then a valid submission producing the "Message sent" state. Confirm the WhatsApp link opens `https://wa.me/255686915587` in a new tab.

- [ ] **Step 4: Commit**

```bash
git add components/contact-form.tsx app/contact/page.tsx
git commit -m "Add Contact page with validated form and WhatsApp link"
```

---

## Task 9: Build the Register page (pre-registration interest form)

**Files:**
- Create: `components/register-form.tsx`
- Create: `app/register/page.tsx`

**Interfaces:**
- Consumes: `validateField` from `lib/validation.ts` (Task 3).
- Reuses category names already defined in `app/festival/page.tsx`'s `DISCIPLINES[].categories`.

- [ ] **Step 1: Write the register form**

Framed explicitly as interest capture, not checkout (no payment provider exists yet — per approved spec):

```tsx
// components/register-form.tsx
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
```

- [ ] **Step 2: Write the Register page**

Explicit "pre-registration" framing in copy, per approved spec (no payment provider exists):

```tsx
// app/register/page.tsx
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { RegisterForm } from '@/components/register-form'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your interest for ZanziFit Festival — road cycling, HYROX-style, and corporate team categories.',
}

export default function RegisterPage() {
  return (
    <main>
      <PageHero
        eyebrow="Register your interest"
        title={<>Claim your place on the start line.</>}
        intro="Official registration hasn't opened yet. Tell us which category you want, and we'll email you the moment entries go live — with pricing, cutoffs and early-bird windows."
      />
      <section className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        <RegisterForm />
      </section>
    </main>
  )
}
```

- [ ] **Step 3: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/register
```

Expected: `200`. In the browser, confirm empty-submit shows errors, valid submit shows the "You're on the list" state referencing the selected category by name.

- [ ] **Step 4: Commit**

```bash
git add components/register-form.tsx app/register/page.tsx
git commit -m "Add Register page as pre-registration interest form"
```

---

## Task 10: Light/dark theme tokens and toggle

**Files:**
- Modify: `app/globals.css`
- Create: `components/theme-script.tsx`
- Create: `components/theme-toggle.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/site-header.tsx`
- Modify: `components/site-footer.tsx`

**Interfaces:**
- Produces: `data-theme="dark" | "light"` attribute on `<html>`, readable/writable via `localStorage.getItem('zanzifit-theme')`.
- Produces: `ThemeToggle` component (client), mounted in `SiteHeader`.

- [ ] **Step 1: Add the light theme token block to `globals.css`**

In `app/globals.css`, immediately after the closing `}` of the existing `:root { ... }` block (after line 50, before the `@theme inline` block), add:

```css
/* Light theme — same brand tokens, Bone becomes the background register */
:root[data-theme='light'] {
  --background: var(--bone);
  --foreground: var(--ink);
  --card: #ffffff;
  --card-foreground: var(--ink);
  --popover: #ffffff;
  --popover-foreground: var(--ink);
  --primary: var(--amber);
  --primary-foreground: #17110a;
  --secondary: var(--deep-teal);
  --secondary-foreground: var(--bone);
  --muted: #e4ddc9;
  --muted-foreground: rgba(11, 14, 18, 0.62);
  --accent: var(--amber);
  --accent-foreground: #17110a;
  --destructive: var(--ember);
  --destructive-foreground: #ffffff;
  --border: rgba(11, 14, 18, 0.12);
  --input: rgba(11, 14, 18, 0.16);
  --ring: var(--amber);

  /* Named brand utilities re-mapped so text-bone/bg-ink continue to mean
     "reversed section" relative to the active theme, not literally the
     ink/bone hexes — components use these tokens directly (see site-header,
     site-footer, page-hero, etc.) so they adapt without per-component edits. */
  --ink: var(--bone-original, #0b0e12);
  --ink-soft: #e4ddc9;
  --bone: #0b0e12;
}
```

Wait — re-read this carefully before implementing: remapping `--ink`/`--bone` themselves is risky because dozens of components use `bg-ink`, `text-bone`, `bg-ink-soft` to mean specific *literal* roles (e.g. "the dark hero background," "reversed light text") independent of overall site theme — for example `PartnerStrip` uses `bg-ink` for what is always meant to be the darkest section, and `StatsBand` always uses `bg-deep-teal` with `text-bone` on top expecting bone to be light-colored text. Blindly flipping what `bone`/`ink` mean would invert this and break contrast sitewide (e.g. `text-bone` on `bg-deep-teal` would become dark-on-dark).

**Correct approach:** do NOT remap `--ink`/`--bone`/`--ink-soft` themselves. Instead, only remap the *semantic* tokens (`--background`, `--foreground`, `--card`, `--muted`, `--border`, `--input`) that `body`/`bg-background`/`text-foreground` consume — these are only used in `app/globals.css`'s `body` rule and are not directly referenced by section components (confirmed: every component file read in this codebase uses `bg-ink`, `text-bone`, `bg-ink-soft`, `bg-deep-teal`, `text-amber` directly, never `bg-background`/`text-foreground`).

This means: **the current component set is written brand-first (literal `ink`/`bone`/`amber` names), not theme-first (`background`/`foreground`)** — so a true full-site light theme requires each section to make its own light/dark decision, not a single global token flip. Given the scope of this plan, implement the theme toggle to control the `<html>` `data-theme` attribute and CSS variables as scaffolding now (so `bg-background`/`text-foreground` usages, like the `body` tag itself, correctly flip), and flag explicitly in the task's verification step that most existing sections will still render in their dark brand colors until they are individually audited — this is a known, visible limitation to surface to the user after this task, not silently ship as "done."

Use this corrected CSS instead:

```css
/* Light theme — remaps only the semantic (shadcn-style) tokens that
   body/bg-background/text-foreground consume. Section components that
   reference brand tokens directly (bg-ink, text-bone, bg-deep-teal) are
   unaffected by this block and are handled per-section in later work. */
:root[data-theme='light'] {
  --background: var(--bone);
  --foreground: var(--ink);
  --card: #ffffff;
  --card-foreground: var(--ink);
  --popover: #ffffff;
  --popover-foreground: var(--ink);
  --secondary-foreground: var(--bone);
  --muted: #e4ddc9;
  --muted-foreground: rgba(11, 14, 18, 0.62);
  --border: rgba(11, 14, 18, 0.12);
  --input: rgba(11, 14, 18, 0.16);
}
```

- [ ] **Step 2: Write `ThemeScript` (flash-of-wrong-theme prevention)**

```tsx
// components/theme-script.tsx
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('zanzifit-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
}
```

- [ ] **Step 3: Write `ThemeToggle`**

```tsx
// components/theme-toggle.tsx
'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    setTheme(current === 'light' ? 'light' : 'dark')
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('zanzifit-theme', next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      data-cursor-label="Theme"
      className="inline-flex size-10 items-center justify-center rounded-sm border border-border text-bone transition-colors hover:border-amber hover:text-amber"
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
```

- [ ] **Step 4: Mount `ThemeScript` in `app/layout.tsx`**

In `app/layout.tsx`, add the import:

```tsx
import { ThemeScript } from '@/components/theme-script'
```

And add `<ThemeScript />` as the very first child inside `<head>` — since this file has no explicit `<head>` tag (Next.js App Router injects one), instead place it as the first child of `<body>`, before `<SiteHeader />`:

```tsx
      <body className="antialiased">
        <ThemeScript />
        <SiteHeader />
```

- [ ] **Step 5: Add `ThemeToggle` to `SiteHeader`**

In `components/site-header.tsx`, add the import:

```tsx
import { ThemeToggle } from '@/components/theme-toggle'
```

Find this block (the `<div className="flex items-center gap-2">` wrapping the Register button and mobile-menu button), and add `<ThemeToggle />` before the Register link:

```tsx
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/register"
```

- [ ] **Step 6: Verify build and manual toggle behavior**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
```

Expected: `200`. In the browser: click the sun/moon icon in the header — confirm `document.documentElement`'s `data-theme` attribute flips (inspect via devtools), and the page background/foreground (`body` text/background, which use `bg-background`/`text-foreground`) visibly changes. Reload the page — confirm the choice persisted (no flash back to dark).

**Explicitly verify and report the known limitation:** most section components (Hero, Disciplines, StatsBand, WhyZanzibar, PartnerStrip, CtaBand, Leadership, page heroes) will still show their literal dark brand backgrounds (`bg-ink`, `bg-deep-teal`, etc.) after toggling to light, since they don't consume `bg-background`. Only the `<body>` base and any component using semantic tokens will visibly change. This must be surfaced to the user as a follow-up decision point (see Task 11), not silently left incomplete.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css components/theme-script.tsx components/theme-toggle.tsx app/layout.tsx components/site-header.tsx
git commit -m "Add theme toggle scaffolding: data-theme attribute, persistence, semantic token remap"
```

---

## Task 11: Extend light theme to section-level components (logo invert + brand-token sections)

**Files:**
- Modify: `components/site-header.tsx`
- Modify: `components/site-footer.tsx`

**Interfaces:**
- Consumes: `data-theme` attribute set up in Task 10.

This task addresses the two concrete, scoped fixes identified in the spec (logo inversion) that are small and mechanical. Full per-section light-mode restyling of Hero/Disciplines/StatsBand/etc. (making `bg-ink` sections adapt) is a larger visual-design effort than fits this plan's scope — flag it to the user as an explicit follow-up rather than attempting a rushed pass across 10+ components with no design direction for each section's light-mode look.

- [ ] **Step 1: Make the header logo invert conditional on theme**

In `components/site-header.tsx`, the logo currently always applies `invert` (assumes dark background):

```tsx
            className="h-8 w-auto invert lg:h-9"
```

Since the header itself renders on a transparent/dark scrim regardless of site theme (it's a fixed-position overlay on the Hero, which stays visually dark per the spec — theming applies to page backgrounds below the fold, not the hero itself), leave the header logo's `invert` as unconditional. Verify this assumption by checking `SiteHeader`'s background classes (`scrolled ? 'bg-ink/85...' : 'bg-transparent'`) — confirmed the header always sits on a dark surface (`bg-ink/85` when scrolled, transparent-over-dark-hero otherwise) in both themes, since the Hero section itself is unaffected by this plan's token remap (it uses `bg-ink` directly). No change needed here — document this reasoning inline as a comment:

```tsx
          <Image
            src="/zfit-logo.png"
            alt="ZFit Festival"
            width={132}
            height={44}
            priority
            // Header always renders over a dark surface (bg-ink/85 or the dark
            // hero) in both themes, so the logo invert stays unconditional.
            className="h-8 w-auto invert lg:h-9"
          />
```

- [ ] **Step 2: Check the footer logo**

`components/site-footer.tsx`'s `<footer>` uses `bg-ink` directly (`<footer className="border-t border-border bg-ink">`) — also a literal brand-dark section unaffected by the semantic-token theme remap from Task 10. Same reasoning applies: leave `invert` unconditional, add the same clarifying comment:

```tsx
            <Image
              src="/zfit-logo.png"
              alt="ZFit Festival"
              width={150}
              height={50}
              // Footer always renders on bg-ink (literal brand-dark), unaffected
              // by the light/dark toggle — invert stays unconditional.
              className="h-9 w-auto invert"
            />
```

- [ ] **Step 3: Verify no visual regression**

Toggle the theme in the browser and confirm the header/footer logo still displays correctly (white logo mark) in both theme states, since these sections don't change color.

- [ ] **Step 4: Commit**

```bash
git add components/site-header.tsx components/site-footer.tsx
git commit -m "Document why header/footer logo invert stays theme-independent"
```

- [ ] **Step 5: Report the scope boundary to the user**

After this task, explicitly tell the user (in the conversation, not just code comments): the toggle works and persists, and the base page background/text now respond to it, but the majority of visual sections (Hero, Disciplines, Stats, Why Zanzibar, Partner Strip, CTA bands, all `PageHero` banners, Leadership cards) are built on literal brand-dark tokens (`bg-ink`, `bg-deep-teal`) and will need a dedicated light-mode visual pass per section — that's a real design decision (e.g., does the Hero's dark parallax scene switch to a light scene, or intentionally stay dark like many brand sites do for hero-only?) that should go back through a quick brainstorming round rather than being guessed at here.

---

## Task 12: Custom cursor interactivity

**Files:**
- Create: `components/custom-cursor.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Reads `data-cursor-label` attributes already added to buttons/links in Tasks 4, 5, 8, 9, 10 (`Join`, `Send`, `Chat`, `Theme`, `Notify me`, `Open`/`Close`).
- No props — self-contained, mounted once globally.

- [ ] **Step 1: Write the `CustomCursor` component**

```tsx
// components/custom-cursor.tsx
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
        className={`flex items-center justify-center rounded-full border border-amber bg-ink/40 backdrop-blur-sm transition-all duration-200 ease-out ${
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
```

- [ ] **Step 2: Mount it in `app/layout.tsx`**

Add the import:

```tsx
import { CustomCursor } from '@/components/custom-cursor'
```

Add `<CustomCursor />` inside `<body>`, after `<ThemeScript />`:

```tsx
      <body className="antialiased">
        <ThemeScript />
        <CustomCursor />
        <SiteHeader />
```

- [ ] **Step 3: Hide the native cursor on fine-pointer devices only**

In `app/globals.css`, inside the existing `@layer base { ... }` block, add:

```css
  @media (hover: hover) and (pointer: fine) {
    body {
      cursor: none;
    }
    a,
    button {
      cursor: none;
    }
  }
```

- [ ] **Step 4: Verify in the browser (desktop viewport)**

Reload the site with devtools NOT in mobile-emulation mode. Confirm: a small amber dot follows the mouse; hovering over nav links, buttons, and the newsletter/contact submit buttons grows the dot into a labeled circle showing "Join"/"Send"/etc.; the native OS cursor is hidden. Switch devtools to mobile/touch emulation and confirm the custom cursor does not render and the native cursor/touch behavior is untouched. Enable "prefers-reduced-motion: reduce" in devtools rendering settings and confirm the custom cursor does not render.

- [ ] **Step 5: Commit**

```bash
git add components/custom-cursor.tsx app/layout.tsx app/globals.css
git commit -m "Add custom cursor with hover labels, gated to fine-pointer/no-reduced-motion"
```

---

## Task 13: Organize logo assets into `public/`

**Files:**
- Create: `public/logo/zfit-logo-light-bg.jpg` (from root `ZFit-Logo.jpg.jpeg`)
- Create: `public/logo/zfit-logo-mark.svg` (from root `file.svg` — cleaner/more recent of the two vector redraws, per file mtimes: `file.svg` was modified 2026-07-04 23:00, after `SMrY001.svg` at 22:51)
- No modification to `public/zfit-logo.png` — already in use, already byte-identical to the root `ZFit-Logo.jpg-removebg-preview.png`, left as-is.

**Interfaces:** none — static asset relocation, not consumed by other tasks in this plan.

- [ ] **Step 1: Copy the solid-background logo and SVG mark into `public/logo/`**

```bash
mkdir -p public/logo
cp "ZFit-Logo.jpg.jpeg" public/logo/zfit-logo-light-bg.jpg
cp "file.svg" public/logo/zfit-logo-mark.svg
```

- [ ] **Step 2: Verify the files copied correctly**

```bash
ls -la public/logo/
```

Expected: both files present, non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/logo/
git commit -m "Organize logo assets into public/logo/ (solid-background JPEG and SVG mark)"
```

Note: the root-level `ZFit-Logo.jpg.jpeg`, `ZFit-Logo.jpg-removebg-preview.png`, `SMrY001.svg`, and `file.svg` are left in place (not deleted) since they were user-added reference files — removing them is a separate decision the user should make, not this plan's call.

---

## Task 14: Hover polish on Festival and About images

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/festival/page.tsx`

**Interfaces:** none — visual-only CSS class changes, no new props or components.

Extends the existing grayscale→color hover pattern (already used on Leadership photos, `group-hover:grayscale-0`) and the existing `GalleryGrid` scale pattern (`group-hover:scale-105`) to the two other pages with static, non-interactive images — for consistency, per approved spec §3.

- [ ] **Step 1: Add hover scale to the About page's finish-line image**

In `app/about/page.tsx`, find:

```tsx
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="/images/finish-line.png"
              alt="An athlete crossing the ZanziFit finish line at sunset on the Zanzibar coast"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
```

Replace with (adding `group` to the wrapper and a scale transition to the image):

```tsx
          <div className="group relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="/images/finish-line.png"
              alt="An athlete crossing the ZanziFit finish line at sunset on the Zanzibar coast"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
```

- [ ] **Step 2: Add hover scale to the Festival page's discipline images**

In `app/festival/page.tsx`, find (inside the `DISCIPLINES.map` block):

```tsx
              <div className="relative aspect-[16/10]">
                <Image src={d.image} alt={`${d.name} at ZanziFit Festival`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
```

Replace with:

```tsx
              <div className="group relative aspect-[16/10]">
                <Image src={d.image} alt={`${d.name} at ZanziFit Festival`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
```

Also find the "Your entry includes" section's festival-village image:

```tsx
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="/images/festival-village.png" alt="The ZanziFit festival village and expo at golden hour" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
```

Replace with:

```tsx
          <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="/images/festival-village.png" alt="The ZanziFit festival village and expo at golden hour" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
```

- [ ] **Step 3: Verify visually**

In the browser, hover over the About page's finish-line photo and the Festival page's two discipline cards and the festival-village photo — confirm each image subtly scales up (1.0 → 1.05) on hover with a smooth transition, matching the existing Leadership/Gallery hover feel.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/festival/page.tsx
git commit -m "Add consistent hover scale to About and Festival page images"
```

---

## Task 15: Database recommendation document

**Files:**
- Create: `docs/database-recommendation.md`

**Interfaces:** none — a standalone markdown document, no code.

Per the approved spec (§4) and the user's explicit instruction that real database/backend planning happens in a later conversation, this task produces the recommendation only — no schema, no ORM, no hosting setup.

- [ ] **Step 1: Write the recommendation document**

```markdown
# Database Recommendation — ZanziFit Festival Website

This is a recommendation only. No backend or database is implemented as part of
this round of work — per explicit instruction, that planning happens separately.

## What needs no database today

Home, About, Festival, Partnership, Leadership, Gallery, and FAQ are static
marketing content. They render the same for every visitor and don't need a
database — keep them statically rendered.

## What needs a database as soon as you want to keep submissions

Right now, four forms (Newsletter, Partnership Inquiry, Contact, Register)
validate input correctly but only simulate success in the browser — submitted
data is never sent anywhere and disappears on page refresh. The moment you want
to actually see who submitted what, this needs a real datastore. This doesn't
require the full architecture below — a single managed Postgres instance
(e.g. Supabase or Neon, both have generous free tiers) with one `submissions`
table (columns: `id`, `form_type`, `payload` as JSON, `created_at`) plus one API
route per form would close this gap without much engineering effort.

## What needs a real backend before it can process money

The Register page is currently a "notify me" interest form by design — no
payment provider is wired up. Turning this into real paid registration needs:
a proper database (not just a submissions table — registrant records, payment
status, category capacity limits), a hosted checkout integration (Stripe, or a
mobile-money provider relevant to the East African market, e.g. Selcom), and
webhook handling for payment confirmation. This is a meaningfully larger build
than the marketing site and should be scoped as its own project phase.

## What needs the full event-day architecture

A live leaderboard (real-time race results for spectators) is a fan-out
problem, not just a database problem — thousands of people refreshing the
same data needs a broadcast mechanism (WebSocket/SSE + Redis pub/sub), not
everyone hitting Postgres directly. This is explicitly a post-launch,
event-day-only feature and doesn't need to exist before the festival's
marketing site and registration flow are live.

## Suggested order, when you're ready to revisit this

1. Managed Postgres + one API route per form, so submissions persist (small effort).
2. Registration/payment backend, once a payment provider is chosen (larger effort, own project).
3. Live leaderboard real-time stack, closer to event day (largest effort, time-boxed to when it's actually needed).
```

- [ ] **Step 2: Commit**

```bash
git add docs/database-recommendation.md
git commit -m "Add database recommendation document (no implementation, per instruction)"
```

---

## Task 16: Full route smoke test

**Files:** none (verification only)

- [ ] **Step 1: Confirm every route returns 200**

```bash
for p in "" about festival leadership partnership gallery faq contact register; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/$p")
  echo "/$p -> $code"
done
```

Expected: every line shows `200`. If the dev server is on a different port (check its startup log — port 3000 was occupied by another process earlier this session, causing a fallback to 3001), substitute the correct port.

- [ ] **Step 2: Confirm no console errors on each page**

Open each of the 9 routes in a browser with devtools console open; confirm no red errors (React hydration mismatches, missing image 404s, etc.). Pay particular attention to `/gallery` (image paths) and `/leadership` (new photo paths).

- [ ] **Step 3: Report remaining known gaps to the user**

Summarize for the user, in plain language (not just in a commit message):
1. Theme toggle works and persists, but only the base page chrome responds today — most branded sections stay dark until a follow-up light-mode visual pass (flagged in Task 11).
2. `/live` (leaderboard) still 404s — intentionally out of scope per the blueprint's own phasing (event-day feature, post-launch).
3. Leadership bios and FAQ answers are placeholder-quality, clearly flagged in code as such, pending real copy from the client.
