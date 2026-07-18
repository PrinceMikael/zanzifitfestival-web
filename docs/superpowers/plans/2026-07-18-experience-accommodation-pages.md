# Experience Zanzibar & Accommodation Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/experience` and `/accommodation` pages that surface real Zanzibar interest points and lodging tiers, each routing "enquire" actions to the festival team via a pre-filled WhatsApp link, and wire both into the site nav.

**Architecture:** Two new App Router pages (`app/experience/page.tsx`, `app/accommodation/page.tsx`) built from local `const` data arrays, composed from existing layout primitives (`PageHero`, `SectionHeading`, `Chevrons`) plus two new shared components (`EnquiryLink`, `ExpandableCard`). Nav wiring is a two-line addition to the existing `NAV` array in `site-header.tsx`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react icons.

## Global Constraints

- No test framework exists in this project (confirmed: no `*.test.*`/`*.spec.*` files, no jest/vitest/playwright config). Verification per task is: TypeScript type-check clean, `eslint .` clean, and a manual browser check against the running dev server — not automated tests.
- Use `npx pnpm <cmd>` for all package-manager commands (plain `pnpm` is not on PATH in this environment; `corepack enable` fails with EPERM against `C:\Program Files\nodejs`).
- No new images may be sourced from the web. Use existing placeholder images from `public/images/` (reuse `zanzibar-coast.png`, `festival-village.png`, etc.) — do not fabricate new image files or claim they are real property photos.
- Named accommodations/attractions are illustrative, not confirmed commercial partners — copy must never claim a partnership (per spec's Non-goals section).
- WhatsApp number for all enquiry links: `255686915587` (matches `app/contact/page.tsx`'s existing `https://wa.me/255686915587`).
- Follow existing design tokens exactly: `font-display`/`font-utility` type classes, `text-amber`/`text-bone`/`text-ink`/`text-ink-soft`/`border-border`/`text-muted-foreground` color tokens, `rounded-sm`/`rounded-lg` radii, `Chevrons` component for bullet/arrow accents — do not introduce new colors or spacing scales.
- Every new page exports a `Metadata` object (`title`, `description`) matching the pattern in every existing `app/*/page.tsx`.

---

### Task 1: `EnquiryLink` shared component

**Files:**
- Create: `components/enquiry-link.tsx`

**Interfaces:**
- Consumes: nothing (leaf component).
- Produces: `EnquiryLink` React component with props `{ label: string; context: 'accommodation' | 'experience'; className?: string }`, default export not used — named export `EnquiryLink`. Later tasks (2, 3, 4) import it as `import { EnquiryLink } from '@/components/enquiry-link'`.

This mirrors the WhatsApp link already hand-rolled in `app/contact/page.tsx:38-48` but makes the message dynamic per place/activity, and reusable across many cards.

- [ ] **Step 1: Write the component**

```tsx
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_NUMBER = '255686915587'

const CONTEXT_VERB: Record<'accommodation' | 'experience', string> = {
  accommodation: "I'd like to know more about booking",
  experience: "I'd like to know more about",
}

export function EnquiryLink({
  label,
  context,
  className,
}: {
  label: string
  context: 'accommodation' | 'experience'
  className?: string
}) {
  const message = `Hi ZanziFit team, ${CONTEXT_VERB[context]}: ${label}.`
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-label="Chat"
      className={cn(
        'inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-bone',
        className,
      )}
    >
      <MessageCircle className="size-4" />
      Enquire on WhatsApp
    </a>
  )
}
```

- [ ] **Step 2: Verify `cn` utility import path is correct**

Run: `grep -n "export function cn" lib/utils.ts` (or equivalent path used elsewhere, e.g. `components/site-header.tsx:8` imports `cn` from `@/lib/utils`).
Expected: a `cn` export exists at that path. If the path differs, fix the import in Step 1's file to match.

- [ ] **Step 3: Type-check and lint**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors referencing `enquiry-link.tsx`.

Run: `npx pnpm lint`
Expected: no errors/warnings referencing `enquiry-link.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/enquiry-link.tsx
git commit -m "Add EnquiryLink component for WhatsApp booking enquiries"
```

---

### Task 2: `ExpandableCard` shared component

**Files:**
- Create: `components/expandable-card.tsx`

**Interfaces:**
- Consumes: `EnquiryLink` from Task 1 (`import { EnquiryLink } from '@/components/enquiry-link'`).
- Produces: `ExpandableCard` React component, named export, props:
  ```ts
  {
    image: string
    alt: string
    title: string
    badge?: string
    summary: string
    details: string[]
    enquiryLabel: string
    enquiryContext: 'accommodation' | 'experience'
  }
  ```
  Later tasks (3, 4) import it as `import { ExpandableCard } from '@/components/expandable-card'`.

This is a client component (needs `useState` for expand/collapse), following the same open/close chevron-rotate affordance as `components/accordion-item.tsx:1-28`, but adds an image, a badge, and an always-visible summary layer that plain text-accordion doesn't have — and keeps `EnquiryLink` visible in both collapsed and expanded states so a visitor never has to expand a card to find how to contact the team.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Chevrons } from '@/components/chevrons'
import { EnquiryLink } from '@/components/enquiry-link'

export function ExpandableCard({
  image,
  alt,
  title,
  badge,
  summary,
  details,
  enquiryLabel,
  enquiryContext,
}: {
  image: string
  alt: string
  title: string
  badge?: string
  summary: string
  details: string[]
  enquiryLabel: string
  enquiryContext: 'accommodation' | 'experience'
}) {
  const [open, setOpen] = useState(false)

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-ink-soft">
      <div className="group relative aspect-[16/10]">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/10 to-transparent" />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-sm bg-ink/80 px-3 py-1.5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-amber backdrop-blur">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-bone">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          data-cursor-label={open ? 'Close' : 'Open'}
          className="mt-4 flex items-center gap-2 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-bone/70 transition-colors hover:text-amber"
        >
          {open ? 'View less' : 'View more'}
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open ? (
          <ul className="mt-4 space-y-2 border-t border-border pt-4">
            {details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                {d}
              </li>
            ))}
          </ul>
        ) : null}

        <EnquiryLink label={enquiryLabel} context={enquiryContext} className="mt-5" />
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors referencing `expandable-card.tsx`.

Run: `npx pnpm lint`
Expected: no errors/warnings referencing `expandable-card.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/expandable-card.tsx
git commit -m "Add ExpandableCard component for tiered listing cards"
```

---

### Task 3: `/experience` page

**Files:**
- Create: `app/experience/page.tsx`

**Interfaces:**
- Consumes: `PageHero` (`components/page-hero.tsx`, props `{ eyebrow, title, intro?, children? }`), `SectionHeading` (`components/section-heading.tsx`, props `{ eyebrow?, title, intro?, align?, tone?, className? }`), `Chevrons` (`components/chevrons.tsx`), `ExpandableCard` from Task 2, `EnquiryLink` from Task 1.
- Produces: default-exported `ExperiencePage` component routed at `/experience`.

Content sourced from public general-knowledge travel sources (Tripadvisor/general Zanzibar travel content), verified during design research on 2026-07-18. No new images are fetched — reuses `zanzibar-coast.png` and `festival-village.png` from `public/images/` as placeholders; other sections use no image (prose/list only) to avoid needing image assets that don't exist yet.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ExpandableCard } from '@/components/expandable-card'
import { EnquiryLink } from '@/components/enquiry-link'

export const metadata: Metadata = {
  title: 'Experience Zanzibar',
  description:
    'What to see, taste and understand on the island that hosts ZanziFit — Stone Town, the coast, the culture and the food, all a short ride from Fumba Town.',
}

const THINGS_TO_DO = [
  {
    title: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary:
      'The UNESCO-listed old town: narrow alleys, carved wooden doors, and centuries of Swahili, Omani and Indian history.',
    details: [
      'House of Wonders — former Sultan’s palace, now a museum of Swahili and Zanzibar history',
      'Guided spice tours run daily from the Old Fort area',
      'Forodhani Gardens waterfront, best visited at sunset',
    ],
  },
  {
    title: 'Forodhani Gardens Night Market',
    badge: 'Stone Town',
    image: '/images/festival-village.png',
    summary:
      'Every evening the seafront gardens turn into an open-air food market — grilled seafood skewers, samosas and Zanzibar “pizza” cooked to order.',
    details: [
      'Best visited 6–9pm as vendors set up for the evening',
      'Try urojo, Zanzibar’s tangy spiced soup, alongside the grills',
      'A five-minute walk from most Stone Town accommodation',
    ],
  },
  {
    title: 'Menai Bay',
    badge: '~10 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary:
      'The conservation area right on Fumba’s doorstep — dolphin encounters, snorkeling and sandbank boat trips.',
    details: [
      'Boat trips typically depart from Fumba and nearby jetties',
      'Snorkeling over the reef is best at low tide',
      'The closest of these excursions to the festival village',
    ],
  },
  {
    title: 'Nungwi & Kendwa Beaches',
    badge: '~70–80 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary:
      'The island’s north-tip beaches — turquoise water, sandbars and the liveliest sunset scene in Zanzibar.',
    details: [
      'Kendwa’s beach stays swimmable at every tide, unlike much of the east coast',
      'A popular day-trip or stay-over add-on after race weekend',
    ],
  },
  {
    title: 'Jozani-Chwaka Bay National Park',
    badge: '~50 min from Fumba',
    image: '/images/festival-village.png',
    summary:
      'Zanzibar’s only national park — home to the red colobus monkey, found nowhere else on Earth.',
    details: [
      'Guided forest walks last roughly 45 minutes to an hour',
      'Combine with the adjacent mangrove boardwalk',
    ],
  },
]

const CULTURE_FACTS = [
  'Zanzibar sits on the historic Swahili Coast, shaped by centuries of Arab, Persian, Indian and European trade and, later, Omani Sultanate rule.',
  'Stone Town’s carved wooden doors are a signature craft — each pattern historically signalled the wealth and trade of the household.',
  'The islands are predominantly Muslim, so modest dress (shoulders and knees covered) is appreciated away from the beach, particularly in Stone Town.',
]

const FOOD_HIGHLIGHTS = [
  {
    name: 'Zanzibar "Pizza"',
    detail: 'A savoury stuffed crepe, grilled fresh at Forodhani Gardens and street stalls island-wide.',
  },
  {
    name: 'Urojo',
    detail: 'A tangy, spiced soup with cassava, potato fritters and mango — a Stone Town staple.',
  },
  {
    name: 'Spice Coffee',
    detail: 'Coffee brewed with island-grown cinnamon, cardamom and ginger, sold by street vendors across Stone Town.',
  },
  {
    name: 'Forodhani Seafood Grills',
    detail: 'Fresh-caught skewers of octopus, prawn and reef fish, grilled to order every evening.',
  },
]

const TRAVEL_INFO = [
  'Dry season: June–October and January–February — the best window for racing and sightseeing',
  'Rains: mid-March–May and November bring heavier showers',
  'Arrive via Abeid Amani Karume International Airport (ZNZ), Zanzibar Town',
  'Visa on arrival is available for most nationalities — confirm your requirement before you fly',
  'Fumba Town is roughly 30–45 minutes by road from the airport and Stone Town',
]

export default function ExperiencePage() {
  return (
    <main>
      <PageHero
        eyebrow="Experience Zanzibar"
        title={<>Race here. Stay a while.</>}
        intro="ZanziFit is based in Fumba Town, on Zanzibar's west coast — a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="About Zanzibar" title="An island shaped by centuries of trade." />
        <p className="mt-8 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
          Zanzibar is an archipelago off the coast of mainland Tanzania, its culture
          layered by Swahili, Arab, Persian, Indian and European influence over
          hundreds of years of Indian Ocean trade. ZanziFit races out of Fumba Town,
          a quiet stretch of the west coast on Menai Bay — close enough to Stone
          Town for an afternoon of sightseeing, far enough to still feel like your
          own stretch of coastline.
        </p>
      </section>

      <section id="things-to-do" className="scroll-mt-24 border-y border-border bg-ink-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Things to Do" title="Beyond race day." />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {THINGS_TO_DO.map((item) => (
              <ExpandableCard
                key={item.title}
                image={item.image}
                alt={item.title}
                title={item.title}
                badge={item.badge}
                summary={item.summary}
                details={item.details}
                enquiryLabel={item.title}
                enquiryContext="experience"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="Culture & Heritage" title="A crossroads of the Indian Ocean." align="left" />
            <ul className="mt-8 space-y-4">
              {CULTURE_FACTS.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/zanzibar-coast.png"
              alt="Traditional dhow boats off the Zanzibar coast"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-ink-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Food & Cuisine" title="Eat your way around the island." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {FOOD_HIGHLIGHTS.map((f) => (
              <div key={f.name} className="rounded-lg border border-border bg-background p-6">
                <h3 className="font-display text-xl font-semibold text-bone">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Travel Information" title="Plan your trip." />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {TRAVEL_INFO.map((i) => (
            <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-ink-soft px-4 py-3 text-sm text-bone">
              <Chevrons className="shrink-0 text-amber" count={1} />
              {i}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">
            Have questions about planning your stay around race weekend?
          </p>
          <EnquiryLink label="planning my trip to Zanzibar" context="experience" className="mt-3" />
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors referencing `app/experience/page.tsx`.

Run: `npx pnpm lint`
Expected: no errors/warnings referencing `app/experience/page.tsx`.

- [ ] **Step 3: Manual browser check**

With the dev server running (`npx pnpm dev`, already running in this session at `http://localhost:3000`), open `http://localhost:3000/experience`. Confirm:
- Hero renders with title "Race here. Stay a while."
- All 5 "Things to Do" cards render with images and badges
- Clicking "View more" on a card expands the details list and the chevron rotates
- The "Enquire on WhatsApp" link on a card opens `https://wa.me/255686915587?text=...` with the card's title in the message
- Culture & Heritage, Food & Cuisine, and Travel Information sections all render

- [ ] **Step 4: Commit**

```bash
git add app/experience/page.tsx
git commit -m "Add Experience Zanzibar page"
```

---

### Task 4: `/accommodation` page

**Files:**
- Create: `app/accommodation/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `SectionHeading`, `Chevrons`, `ExpandableCard` from Task 2, `EnquiryLink` from Task 1.
- Produces: default-exported `AccommodationPage` component routed at `/accommodation`.

Property names, areas and approximate travel times from Fumba Town sourced from public general-knowledge travel/hotel-aggregator content, verified during design research on 2026-07-18 (Fumba Beach Lodge is the closest property to the festival venue; others are grouped by the four tiers from the sitemap). Copy explicitly frames the festival as a connector, not the property operator, per the spec's non-goals.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ExpandableCard } from '@/components/expandable-card'

export const metadata: Metadata = {
  title: 'Accommodation',
  description:
    'Where to stay for ZanziFit Festival — hotels, resorts, boutique stays and budget options around Fumba Town, Zanzibar. We help you book.',
}

const HOTELS = [
  {
    title: 'DoubleTree by Hilton Nungwi',
    area: 'Nungwi',
    badge: '~75 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A full-service international hotel on the island’s northern tip, with multiple restaurants and a spa.',
    details: [
      'Ocean-view rooms and suites, on-site pool and fitness centre',
      'Best for travellers who want a familiar hotel-brand experience',
      'A longer transfer from the festival village — plan race-morning logistics ahead',
    ],
  },
  {
    title: 'Green Turaco',
    area: 'Fumba',
    badge: '~5 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A simple, business-friendly hotel right in Fumba — the shortest possible commute to the start line.',
    details: [
      'Walkable or a short ride to the festival village',
      'Straightforward rooms, good for a no-frills race-weekend base',
    ],
  },
]

const RESORTS = [
  {
    title: 'Fumba Beach Lodge',
    area: 'Fumba',
    badge: '~5 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A secluded beach lodge inside the Menai Bay Conservation Area — the closest resort stay to the festival village.',
    details: [
      'Cottage and suite rooms with private terraces and ocean views',
      'On-site dive centre for reef trips and sandbank excursions',
      'Best paired with an early race-morning start given the short transfer',
    ],
  },
  {
    title: 'Essque Zalu Zanzibar',
    area: 'Nungwi',
    badge: '~75 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A five-star resort on Zanzibar’s northern point, known for dramatic ocean views and full-service spa.',
    details: [
      'A good choice for a post-race, stay-longer trip extension',
      'Multiple dining options and an infinity pool over the water',
    ],
  },
  {
    title: 'Zuri Zanzibar',
    area: 'Kendwa',
    badge: '~80 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'An eco-conscious resort with chic bungalows and a private stretch of Kendwa beach.',
    details: [
      'Kendwa’s beach stays swimmable at every tide',
      'Best for travellers extending their trip beyond race weekend',
    ],
  },
]

const BOUTIQUE_STAYS = [
  {
    title: 'Sharazād Wonders Boutique Hotel',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A small, historic courtyard hotel in the heart of Stone Town’s old city.',
    details: [
      'Handful of rooms around a quiet private courtyard',
      'Walking distance to the House of Wonders and Forodhani Gardens',
      'Best for travellers who want culture and nightlife over beachfront',
    ],
  },
  {
    title: 'Mwezi Boutique Resort',
    area: 'Paje',
    badge: '~55 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'An artistic, eco-conscious boutique resort on Zanzibar’s east coast, near Paje’s kite-surfing scene.',
    details: [
      'Stylish bungalow-style rooms',
      'Good base for combining race weekend with kite-surfing or a beach-town stay',
    ],
  },
]

const BUDGET_STAYS = [
  {
    title: 'Jambo Guesthouse',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A family-run guesthouse in Stone Town with rooftop breakfast views — simple, friendly and central.',
    details: [
      'Private rooms at guesthouse rates',
      'Central to Stone Town’s old-city sights',
    ],
  },
  {
    title: 'Drifters Backpackers',
    area: 'Paje',
    badge: '~55 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A few steps from Paje beach — dorms and private bandas, communal kitchen and on-site bar.',
    details: [
      'The most affordable tier covered here',
      'Popular with solo travellers and the kite-surfing crowd',
    ],
  },
]

const TIERS = [
  { id: 'hotels', eyebrow: 'Hotels', title: 'Familiar comfort, full service.', items: HOTELS },
  { id: 'resorts', eyebrow: 'Resorts', title: 'Beachfront, all-inclusive ease.', items: RESORTS },
  { id: 'boutique', eyebrow: 'Boutique Stays', title: 'Small, characterful, personal.', items: BOUTIQUE_STAYS },
  { id: 'budget', eyebrow: 'Budget Stays', title: 'Simple, friendly, affordable.', items: BUDGET_STAYS },
]

const BOOKING_STEPS = [
  { step: '01', title: 'Tell us your dates & budget', detail: 'Message us your race-weekend dates, group size and the tier of stay you’re after.' },
  { step: '02', title: 'We check availability', detail: 'We reach out to the property on your behalf and confirm what’s open for your dates.' },
  { step: '03', title: 'You confirm', detail: 'Book directly with the property or let us handle the confirmation — either way, we stay in the loop.' },
]

export default function AccommodationPage() {
  return (
    <main>
      <PageHero
        eyebrow="Accommodation"
        title={<>We&apos;re not a hotel. We&apos;re your local connection.</>}
        intro="ZanziFit doesn't run properties — we know them. Tell us what you're after and we'll help you find and book a place to stay for race weekend, from beachfront resorts to budget guesthouses."
      />

      {TIERS.map((tier) => (
        <section
          key={tier.id}
          id={tier.id}
          className="scroll-mt-24 border-b border-border px-6 py-20 md:py-28 odd:bg-ink-soft"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow={tier.eyebrow} title={tier.title} />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tier.items.map((item) => (
                <ExpandableCard
                  key={item.title}
                  image={item.image}
                  alt={item.title}
                  title={item.title}
                  badge={item.badge}
                  summary={`${item.area} — ${item.summary}`}
                  details={item.details}
                  enquiryLabel={item.title}
                  enquiryContext="accommodation"
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Booking Info" title="How booking through us works." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {BOOKING_STEPS.map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-ink-soft p-8">
              <div className="font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber">{s.step}</div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-bone">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-3 border-t border-border pt-10 text-sm text-muted-foreground">
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
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors referencing `app/accommodation/page.tsx`.

Run: `npx pnpm lint`
Expected: no errors/warnings referencing `app/accommodation/page.tsx`.

- [ ] **Step 3: Manual browser check**

With the dev server running, open `http://localhost:3000/accommodation`. Confirm:
- Hero renders with title "We're not a hotel. We're your local connection."
- All 4 tiers (Hotels, Resorts, Boutique Stays, Budget Stays) render with their cards, alternating background per section
- Each card's badge shows the travel-time-from-Fumba text
- "View more" expands details; "Enquire on WhatsApp" opens a `wa.me` link with that property's name in the message
- Booking Info section renders the 3 steps and the same contact block style as `/contact`

- [ ] **Step 4: Commit**

```bash
git add app/accommodation/page.tsx
git commit -m "Add Accommodation page"
```

---

### Task 5: Wire both pages into site navigation

**Files:**
- Modify: `components/site-header.tsx:12-20`

**Interfaces:**
- Consumes: nothing new (existing `NAV` array shape: `{ href: string; label: string }[]`).
- Produces: nothing consumed by later tasks — this is the final task.

Both desktop nav (`site-header.tsx:76-94`) and mobile nav (`site-header.tsx:120-130`) render from the same `NAV` array, so this one edit updates both.

- [ ] **Step 1: Add the two nav entries**

In `components/site-header.tsx`, change:

```tsx
const NAV = [
  { href: '/about', label: 'About' },
  { href: '/festival', label: 'The Festival' },
  { href: '/partnership', label: 'Partnership' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]
```

to:

```tsx
const NAV = [
  { href: '/about', label: 'About' },
  { href: '/festival', label: 'The Festival' },
  { href: '/experience', label: 'Experience Zanzibar' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/partnership', label: 'Partnership' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]
```

- [ ] **Step 2: Type-check and lint**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

Run: `npx pnpm lint`
Expected: no errors/warnings.

- [ ] **Step 3: Manual browser check**

With the dev server running, open `http://localhost:3000/`. Confirm:
- Desktop nav bar (viewport ≥ 1024px wide) shows "Experience Zanzibar" and "Accommodation" between "The Festival" and "Partnership"
- Clicking each link navigates to the correct page and highlights as active (amber text)
- Resize to a narrow viewport, open the mobile menu (hamburger icon), confirm both links appear there too and close the menu on navigation

- [ ] **Step 4: Commit**

```bash
git add components/site-header.tsx
git commit -m "Add Experience Zanzibar and Accommodation to site navigation"
```

---

## Post-plan verification

After Task 5, run a final full check:

- [ ] Run: `npx pnpm exec tsc --noEmit` — expect zero errors across the whole project.
- [ ] Run: `npx pnpm lint` — expect zero errors/warnings across the whole project.
- [ ] With the dev server running, click through: Home → Experience Zanzibar → Accommodation → Contact, confirming no console errors in the browser devtools and that both new pages are visually consistent with `/festival` (same hero treatment, spacing, type scale, color tokens).
