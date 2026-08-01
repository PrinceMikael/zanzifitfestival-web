# Hero Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the home page hero (`components/hero.tsx`) to a left-text/right-photo
split layout with a fixed-margin content grid, new hero photo, and updated
title/body typography, per `docs/superpowers/specs/2026-08-01-hero-redesign-design.md`.

**Architecture:** The hero moves from a full-bleed background-image section to a
two-column split: a left content column constrained to a 144px/1296px-safe-zone grid
(new, hero-scoped Tailwind arbitrary values, not a global container change), and a right
image panel showing the new athlete photo, cropped with `object-cover` since the source
photo is a tall portrait (4160×6240) and the hero band is wide. The existing
scroll-parallax (`useScroll`/`useTransform`) motion, the countdown component, and the
buttons are preserved and only repositioned into the new column structure.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS v4, Framer Motion,
`next/image`.

## Global Constraints

- Scope is `components/hero.tsx` and its new image asset only. No other component, page,
  or global CSS token may change (per spec "Out of scope").
- Header (`components/site-header.tsx`), `components/countdown.tsx`, and button
  markup/classes must not be modified — only repositioned within the new hero layout.
- Fonts: use only what's already loaded in `app/layout.tsx` — `font-hero-title` (Clash
  Display Semibold, the only weight available) for the title, `font-hero-body` (IBM Plex
  Sans, weight 400 present) for the body copy. Do not add new font weights or files.
- Title: 135pt (set as `135pt`/`180px`-equivalent Tailwind arbitrary value), starting
  200px from the top of the content area; "ZanziFit"/"Festival" line gap 25px.
- Body: IBM Plex Sans Regular, 24pt; 40px gap from the body block to the countdown.
- Content-safe zone: 144px left margin, 1152px content width (to 1296px), 144px right
  margin, against a 1440px design canvas — implemented as hero-local constants (inline
  arbitrary Tailwind values or a local class), scaled down responsively below ~1440px
  viewport width. Do not touch `max-w-7xl` usage elsewhere in the codebase.
- Preserve existing scroll-reduced-motion handling (`useReducedMotion`) and the
  `will-change-transform` performance pattern already in the file.
- Preserve the existing scroll-cue element (bottom "Scroll" chevron indicator).

---

### Task 1: Add the new hero image asset

**Files:**
- Create: `public/images/hero-battle-ropes.jpg` (copied from `Photos/Hero Section Image.jpg`)
- Test: manual (file existence + it renders, verified in Task 3)

**Interfaces:**
- Produces: a static asset served at `/images/hero-battle-ropes.jpg`, consumed by
  `components/hero.tsx` in Task 3.

- [ ] **Step 1: Copy the source image into `public/images/`**

Run:
```bash
cp "Photos/Hero Section Image.jpg" "public/images/hero-battle-ropes.jpg"
```

- [ ] **Step 2: Verify the file copied correctly**

Run: `ls -la public/images/hero-battle-ropes.jpg`
Expected: file exists, size matches the source (`Photos/Hero Section Image.jpg`, roughly
4-6 MB for a 4160x6240 JPEG — confirm non-zero and roughly matching `ls -la "Photos/Hero Section Image.jpg"`).

- [ ] **Step 3: Commit**

```bash
git add public/images/hero-battle-ropes.jpg
git commit -m "Add new hero photo asset for hero redesign"
```

---

### Task 2: Build the hero-local layout constants

**Files:**
- Modify: `components/hero.tsx` (add layout constants near the top of the file, above the
  component function)

**Interfaces:**
- Consumes: nothing new.
- Produces: two exported-from-module-scope (not exported from the file — local `const`s)
  Tailwind class strings used by Task 3:
  - `HERO_SAFE_ZONE_PADDING` — left/right padding classes implementing the 144px margin
    at `lg:` (1440px+ design target) and scaled-down padding below that breakpoint.
  - No new component/file is created — this is a small addition inside `hero.tsx` since
    the margin system is hero-scoped only (per spec, not extracted to a shared module).

- [ ] **Step 1: Add the layout constant to `components/hero.tsx`**

Add near the top of the file, after the existing imports (before `export function Hero()`):

```tsx
// Hero-scoped content grid: 144px safe-zone margins against a 1440px canvas
// (1152px content width). Scoped to this component only — other pages keep
// their existing max-w-7xl containers. Scales down below the 1440px design
// width so content doesn't crush on smaller viewports.
const HERO_SAFE_ZONE_PADDING = 'px-6 sm:px-10 lg:px-[144px]'
```

- [ ] **Step 2: Verify the file still compiles**

Run: `pnpm exec tsc --noEmit`
Expected: no new TypeScript errors introduced (existing unrelated errors, if any,
predate this change).

- [ ] **Step 3: Commit**

```bash
git add components/hero.tsx
git commit -m "Add hero-scoped safe-zone layout constant"
```

---

### Task 3: Restructure hero into left-text/right-photo split layout

**Files:**
- Modify: `components/hero.tsx:24-104` (the full `Hero()` function body)

**Interfaces:**
- Consumes: `HERO_SAFE_ZONE_PADDING` from Task 2; `/images/hero-battle-ropes.jpg` from
  Task 1; existing `Chevrons` (`components/chevrons.tsx`) and `Countdown`
  (`components/countdown.tsx`) components unchanged.
- Produces: the redesigned `Hero` component, still exported as
  `export function Hero()`, still used as-is by whatever page currently imports it (no
  prop signature — confirm no callers pass props before/after).

- [ ] **Step 1: Confirm the current `Hero` usage takes no props**

Run: `grep -rn "<Hero" app/ components/ --include="*.tsx"`
Expected: a single usage like `<Hero />` with no props, confirming the replacement
component can keep the same no-props signature.

- [ ] **Step 2: Replace the `Hero()` function body**

Replace the full contents of `components/hero.tsx` (keeping the imports and the new
`HERO_SAFE_ZONE_PADDING` constant from Task 2) with:

```tsx
'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Chevrons } from '@/components/chevrons'
import { Countdown } from '@/components/countdown'

// Hero-scoped content grid: 144px safe-zone margins against a 1440px canvas
// (1152px content width). Scoped to this component only — other pages keep
// their existing max-w-7xl containers. Scales down below the 1440px design
// width so content doesn't crush on smaller viewports.
const HERO_SAFE_ZONE_PADDING = 'px-6 sm:px-10 lg:px-[144px]'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Depth layers move at different rates. Disabled for reduced-motion.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '60%'])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-surface-dark pt-16 lg:flex-row lg:items-stretch lg:pt-0"
      aria-label="ZanziFit Festival hero"
    >
      {/* Left column — content, constrained to the 144px safe zone */}
      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className={`relative z-10 flex w-full flex-col justify-center py-12 will-change-transform lg:w-[56%] lg:py-0 lg:pl-[144px] lg:pr-12 ${HERO_SAFE_ZONE_PADDING}`}
      >
        <div className="lg:pt-[200px]">
          <div className="flex items-center gap-3">
            <Chevrons count={3} className="text-amber" animate />
            <span className="eyebrow text-surface-dark-foreground/80">
              Zanzibar, Tanzania · 6-8 November 2026
            </span>
          </div>

          <h1 className="font-hero-title mt-6 text-balance text-[3.35rem] font-semibold leading-[0.95] tracking-[-0.02em] text-surface-dark-foreground sm:text-7xl lg:text-[135pt] lg:leading-[0.95]">
            ZanziFit
            <span className="block text-amber lg:mt-[25px]">Festival</span>
          </h1>

          <p className="font-hero-body mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/75 lg:mt-10 lg:max-w-xl lg:text-[24pt] lg:font-normal lg:leading-relaxed">
            Where the ocean horizon meets the start line. A hybrid road-cycling
            and HYROX-style functional fitness festival on the coast of
            Zanzibar.
          </p>

          <div className="mt-8 lg:mt-[40px]">
            <p className="eyebrow mb-3 text-surface-dark-foreground/55">Countdown to race day</p>
            <Countdown />
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-amber px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Join the Waitlist
              <Chevrons count={3} className="text-primary-foreground/80" animate />
            </Link>
            <Link
              href="/partnership"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-surface-dark-foreground/30 px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right column — photo panel, bleeds to the viewport edge */}
      <motion.div
        style={{ y: bgY }}
        className="relative min-h-[45vh] w-full flex-1 overflow-hidden will-change-transform lg:min-h-0 lg:w-[44%]"
      >
        <Image
          src="/images/hero-battle-ropes.jpg"
          alt="A ZanziFit athlete mid-effort on battle ropes during a HYROX-style functional fitness session"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 44vw"
          className="object-cover object-[50%_25%]"
        />
        {/* Scrim so the panel reads as part of the dark hero, not a jarring photo cutout */}
        <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-surface-dark/30 lg:bg-linear-to-r lg:from-surface-dark/25 lg:via-transparent lg:to-transparent" />
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 z-10 hidden justify-center lg:flex">
        <div className="flex rotate-90 items-center gap-1 font-utility text-[0.65rem] uppercase tracking-[0.3em] text-surface-dark-foreground/45">
          <span className="-rotate-90">Scroll</span>
          <Chevrons count={3} className="text-amber" animate />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run the dev server and visually verify**

Run: `pnpm dev`

Open `http://localhost:3000` in a browser at a ~1440px-wide window. Confirm:
- Left column content sits inside the left margin (not touching the viewport edge, not
  centered).
- Title reads "ZanziFit" / "Festival" (amber), noticeably large, Clash Display font.
- Body copy is IBM Plex Sans, readable size.
- Countdown renders 4 boxes with live-updating numbers.
- Both buttons render with existing amber-filled / outline styles.
- Right side shows the new battle-ropes photo, cropped sensibly (subject not cut off
  awkwardly), bleeding to the right edge of the viewport.
- Scroll the page: background/foreground layers move at different rates (parallax still
  works); scroll cue chevron visible bottom-center on desktop.
- Resize to a mobile width (~390px): layout stacks (text above, photo below or vice
  versa per the flex-col fallback), nothing overflows horizontally.

Expected: all of the above hold true; no console errors in the browser dev tools.

- [ ] **Step 4: Run TypeScript check**

Run: `pnpm exec tsc --noEmit`
Expected: no new TypeScript errors.

- [ ] **Step 5: Run lint**

Run: `pnpm lint`
Expected: no new lint errors in `components/hero.tsx`.

- [ ] **Step 6: Commit**

```bash
git add components/hero.tsx
git commit -m "Restructure hero into left-text/right-photo split layout"
```

---

### Task 4: Final cross-check against the design spec

**Files:**
- Read-only verification task, no files modified unless a discrepancy is found.

**Interfaces:**
- Consumes: the finished `components/hero.tsx` from Task 3.
- Produces: confirmation the implementation matches
  `docs/superpowers/specs/2026-08-01-hero-redesign-design.md`, or a list of fixes applied.

- [ ] **Step 1: Re-read the spec's "Explicitly unchanged" section and diff against the
  final component**

Run: `git diff e7e5875 HEAD -- components/hero.tsx components/site-header.tsx components/countdown.tsx`

Expected: `site-header.tsx` and `countdown.tsx` show zero diff. `hero.tsx` diff shows only
the split-layout restructure, font-size/spacing changes, and image swap described in the
spec — no changes to button classes/text, no changes to color tokens.

- [ ] **Step 2: Confirm no other files were touched**

Run: `git diff --stat e7e5875 HEAD`
Expected: only `public/images/hero-battle-ropes.jpg` (new),
`components/hero.tsx` (modified), and the two spec/plan docs under
`docs/superpowers/` appear in the diff.

- [ ] **Step 3: If any discrepancy is found, fix it directly in `components/hero.tsx` and
  repeat Step 1**

- [ ] **Step 4: Commit any final fixes (skip if Step 1-2 passed clean)**

```bash
git add components/hero.tsx
git commit -m "Fix hero redesign discrepancies against spec"
```
